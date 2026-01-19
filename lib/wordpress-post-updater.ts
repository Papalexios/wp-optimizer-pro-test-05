/**
 * ENTERPRISE-GRADE WORDPRESS POST UPDATER
 * Provides comprehensive functionality for fetching and updating existing WordPress posts
 * with SOTA architecture, error handling, retry logic, and batch processing.
 */

import type { WordPressCredentials, ContentContract } from '../types';
import { logger } from './logger';

export interface WordPressPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  slug: string;
  status: 'publish' | 'draft' | 'pending' | 'private';
  link: string;
  date: string;
  modified: string;
  categories: number[];
  tags: number[];
}

export interface PostMetadata {
  id: number;
  url: string;
  title: string;
  excerpt: string;
  status: string;
  wordCount: number;
  lastModified: string;
}

export interface PostUpdatePayload {
  title?: string;
  content?: string;
  excerpt?: string;
  status?: 'publish' | 'draft';
}

export interface BatchUpdateResult {
  successful: number;
  failed: number;
  results: Array<{ id: number; success: boolean; error?: string }>;
}

interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
};

export class WordPressAPIClient {
  private readonly baseUrl: string;
  private readonly credentials: WordPressCredentials;
  private readonly retryConfig: RetryConfig;

  constructor(credentials: WordPressCredentials, retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG) {
    this.credentials = credentials;
    this.baseUrl = `${credentials.siteUrl}/wp-json/wp/v2`;
    this.retryConfig = retryConfig;
    logger.info('WordPress API Client initialized', { siteUrl: credentials.siteUrl });
  }

  private getAuthHeaders(): Headers {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const authString = btoa(`${this.credentials.username}:${this.credentials.applicationPassword}`);
    headers.set('Authorization', `Basic ${authString}`);
    return headers;
  }

  private async retryableRequest<T>(url: string, options: RequestInit): Promise<T> {
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText}`);
        }
        return await response.json() as T;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < this.retryConfig.maxAttempts) {
          const delay = this.retryConfig.delayMs * Math.pow(this.retryConfig.backoffMultiplier, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    throw lastError || new Error('Request failed');
  }

  async getPostById(postId: number): Promise<WordPressPost> {
    return this.retryableRequest<WordPressPost>(`${this.baseUrl}/posts/${postId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  async getPostByUrl(postUrl: string): Promise<WordPressPost | null> {
    try {
      const urlObj = new URL(postUrl);
      const slug = urlObj.pathname.split('/').filter(Boolean).pop() || '';
      const url = `${this.baseUrl}/posts?slug=${encodeURIComponent(slug)}`;
      const posts = await this.retryableRequest<WordPressPost[]>(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      return posts.length > 0 ? posts[0] : null;
    } catch (error) {
      logger.error('Failed to fetch post by URL', { postUrl, error });
      return null;
    }
  }

  async updatePost(postId: number, updates: PostUpdatePayload): Promise<WordPressPost> {
    logger.info('Updating post', { postId });
    return this.retryableRequest<WordPressPost>(`${this.baseUrl}/posts/${postId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
    });
  }
}

export function extractPostMetadata(post: WordPressPost): PostMetadata {
  const contentText = post.content.rendered.replace(/<[^>]*>/g, '');
  const wordCount = contentText.trim().split(/\s+/).length;
  return {
    id: post.id,
    url: post.link,
    title: post.title.rendered,
    excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150),
    status: post.status,
    wordCount,
    lastModified: post.modified,
  };
}

export async function fetchPostsFromUrls(
  urls: string[],
  credentials: WordPressCredentials
): Promise<Map<string, PostMetadata>> {
  const client = new WordPressAPIClient(credentials);
  const postsMap = new Map<string, PostMetadata>();
  logger.info(`Fetching ${urls.length} posts from WordPress...`);
  const batchSize = 10;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    await Promise.all(batch.map(async (url) => {
      const post = await client.getPostByUrl(url);
      if (post) {
        postsMap.set(url, extractPostMetadata(post));
      }
    }));
  }
  logger.info(`Successfully fetched ${postsMap.size} posts`);
  return postsMap;
}

export async function updatePostWithOptimizedContent(
  postId: number,
  optimizedContent: ContentContract,
  credentials: WordPressCredentials
): Promise<boolean> {
  try {
    const client = new WordPressAPIClient(credentials);
    await client.updatePost(postId, {
      content: optimizedContent.content,
      excerpt: optimizedContent.metaDescription,
      ...(optimizedContent.title && { title: optimizedContent.title }),
    });
    logger.info('Post updated successfully', { postId });
    return true;
  } catch (error) {
    logger.error('Failed to update post', { postId, error });
    return false;
  }
}

export async function batchUpdatePosts(
  updates: Array<{ postId: number; content: ContentContract }>,
  credentials: WordPressCredentials
): Promise<BatchUpdateResult> {
  logger.info(`Batch update: ${updates.length} posts`);
  const results: Array<{ id: number; success: boolean; error?: string }> = [];
  let successful = 0;
  let failed = 0;
  for (const update of updates) {
    const success = await updatePostWithOptimizedContent(update.postId, update.content, credentials);
    if (success) {
      successful++;
      results.push({ id: update.postId, success: true });
    } else {
      failed++;
      results.push({ id: update.postId, success: false, error: 'Update failed' });
    }
  }
  logger.info('Batch complete', { successful, failed });
  return { successful, failed, results };
}

export const WordPressPostUpdater = {
  WordPressAPIClient,
  extractPostMetadata,
  fetchPostsFromUrls,
  updatePostWithOptimizedContent,
  batchUpdatePosts,
};
