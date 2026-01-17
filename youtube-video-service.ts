// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v39.0 — YOUTUBE VIDEO SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

import type { YouTubeVideoData, YouTubeSearchResult } from './types';

export const YOUTUBE_SERVICE_VERSION = "39.0.0";

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface YouTubeServiceConfig {
    serperApiKey: string;
    minViews?: number;
    minDuration?: number;
    maxDuration?: number;
    enableCaching?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎬 YOUTUBE VIDEO SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class YouTubeVideoService {
    private config: YouTubeServiceConfig;
    private cache: Map<string, YouTubeSearchResult> = new Map();
    private cacheTimeout = 30 * 60 * 1000; // 30 minutes

    constructor(config: YouTubeServiceConfig) {
        this.config = {
            minViews: 1000,
            minDuration: 60,
            maxDuration: 3600,
            enableCaching: true,
            ...config,
        };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔍 FIND BEST VIDEO
    // ═══════════════════════════════════════════════════════════════════════════

    async findBestVideo(
        topic: string,
        targetKeyword?: string
    ): Promise<YouTubeSearchResult> {
        const cacheKey = `${topic}:${targetKeyword || ''}`.toLowerCase();

        // Check cache
        if (this.config.enableCaching && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        if (!this.config.serperApiKey) {
            return { video: null, source: 'fallback', searchQuery: topic };
        }

        const queries = [
            `${topic} tutorial guide`,
            `${topic} explained ${new Date().getFullYear()}`,
            `how to ${topic}`,
            targetKeyword ? `${targetKeyword} tutorial` : null,
        ].filter(Boolean) as string[];

        const allVideos: YouTubeVideoData[] = [];

        for (const query of queries) {
            try {
                const videos = await this.searchVideos(query);
                allVideos.push(...videos);

                if (allVideos.length >= 5) break;
            } catch (error) {
                console.warn(`[YouTube] Query failed: "${query}"`, error);
            }
        }

        // Remove duplicates
        const uniqueVideos = this.deduplicateVideos(allVideos);

        // Score and sort
        const scoredVideos = uniqueVideos
            .map(video => ({
                ...video,
                relevanceScore: this.calculateRelevanceScore(video, topic, targetKeyword),
            }))
            .sort((a, b) => b.relevanceScore - a.relevanceScore);

        const bestVideo = scoredVideos[0] || null;

        const result: YouTubeSearchResult = {
            video: bestVideo,
            source: 'serper',
            searchQuery: queries[0],
        };

        // Cache result
        if (this.config.enableCaching) {
            this.cache.set(cacheKey, result);
            setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
        }

        return result;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔎 SEARCH VIDEOS VIA SERPER
    // ═══════════════════════════════════════════════════════════════════════════

    private async searchVideos(query: string): Promise<YouTubeVideoData[]> {
        const response = await fetch('https://google.serper.dev/videos', {
            method: 'POST',
            headers: {
                'X-API-KEY': this.config.serperApiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: query,
                gl: 'us',
                hl: 'en',
                num: 10,
            }),
        });

        if (!response.ok) {
            throw new Error(`Serper API error: ${response.status}`);
        }

        const data = await response.json();
        const videos: YouTubeVideoData[] = [];

        for (const video of data.videos || []) {
            // Must be YouTube
            if (!video.link?.includes('youtube.com') && !video.link?.includes('youtu.be')) {
                continue;
            }

            // Extract video ID
            const videoId = this.extractVideoId(video.link);
            if (!videoId) continue;

            // Parse views
            const views = this.parseViews(video.views);
            if (views < (this.config.minViews || 1000)) continue;

            videos.push({
                videoId,
                title: video.title || 'Video',
                channel: video.channel || 'Unknown',
                views,
                duration: video.duration,
                thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                embedUrl: `https://www.youtube.com/embed/${videoId}`,
                description: video.snippet,
            });
        }

        return videos;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 CALCULATE RELEVANCE SCORE
    // ═══════════════════════════════════════════════════════════════════════════

    private calculateRelevanceScore(
        video: YouTubeVideoData,
        topic: string,
        targetKeyword?: string
    ): number {
        let score = 50;
        const titleLower = video.title.toLowerCase();
        const topicWords = topic.toLowerCase().split(/\s+/).filter(w => w.length > 3);

        // Title relevance
        const matchingWords = topicWords.filter(w => titleLower.includes(w)).length;
        score += Math.min(30, (matchingWords / Math.max(topicWords.length, 1)) * 30);

        // View count bonus
        if (video.views >= 1000000) score += 15;
        else if (video.views >= 100000) score += 10;
        else if (video.views >= 50000) score += 5;

        // Target keyword match
        if (targetKeyword && titleLower.includes(targetKeyword.toLowerCase())) {
            score += 10;
        }

        // Recency (year in title)
        const currentYear = new Date().getFullYear();
        if (titleLower.includes(String(currentYear))) score += 5;
        if (titleLower.includes(String(currentYear - 1))) score += 3;

        return Math.min(100, score);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 UTILITY METHODS
    // ═══════════════════════════════════════════════════════════════════════════

    private extractVideoId(url: string): string | null {
        const patterns = [
            /(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/,
            /^([a-zA-Z0-9_-]{11})$/,
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }

        return null;
    }

    private parseViews(viewsStr: string | number | undefined): number {
        if (typeof viewsStr === 'number') return viewsStr;
        if (!viewsStr) return 0;

        const str = String(viewsStr).toLowerCase();
        const num = parseFloat(str.replace(/[^0-9.]/g, ''));

        if (str.includes('m')) return num * 1000000;
        if (str.includes('k')) return num * 1000;
        return num || 0;
    }

    private deduplicateVideos(videos: YouTubeVideoData[]): YouTubeVideoData[] {
        const seen = new Set<string>();
        return videos.filter(video => {
            if (seen.has(video.videoId)) return false;
            seen.add(video.videoId);
            return true;
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ✅ VALIDATE VIDEO
    // ═══════════════════════════════════════════════════════════════════════════

    async validateVideo(videoId: string): Promise<boolean> {
        try {
            const response = await fetch(
                `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
            );
            return response.ok;
        } catch {
            return false;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 GENERATE EMBED HTML
    // ═══════════════════════════════════════════════════════════════════════════

    generateEmbed(
        video: YouTubeVideoData,
        title: string,
        style: 'full' | 'compact' = 'full'
    ): string {
        return generateVideoEmbedHTML(video, title, style);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🗑️ CLEAR CACHE
    // ═══════════════════════════════════════════════════════════════════════════

    clearCache(): void {
        this.cache.clear();
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 GENERATE VIDEO EMBED HTML
// ═══════════════════════════════════════════════════════════════════════════════

export function generateVideoEmbedHTML(
    video: YouTubeVideoData,
    title: string,
    style: 'full' | 'compact' = 'full'
): string {
    if (!video?.videoId) return '';

    const escapeHtml = (str: string) =>
        str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    const videoSchema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": video.title,
        "description": video.description || `Video about ${title}`,
        "thumbnailUrl": [`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`],
        "uploadDate": new Date().toISOString().split('T')[0],
        "embedUrl": `https://www.youtube.com/embed/${video.videoId}`,
        "contentUrl": `https://www.youtube.com/watch?v=${video.videoId}`,
    };

    return `
<script type="application/ld+json">${JSON.stringify(videoSchema)}</script>
<div style="margin: 48px 0 !important; border-radius: 16px !important; overflow: hidden !important; box-shadow: 0 20px 48px rgba(0,0,0,0.15) !important; background: #000 !important;">
    <div style="position: relative !important; padding-bottom: 56.25% !important; height: 0 !important; overflow: hidden !important; background: #000 !important;">
        <iframe 
            src="https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1"
            title="${escapeHtml(video.title)}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
            style="position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; border: none !important;"
        ></iframe>
    </div>
    <div style="padding: 20px 24px !important; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;">
        <h4 style="font-size: 16px !important; font-weight: 700 !important; margin: 0 0 8px 0 !important; color: #fff !important;">${escapeHtml(video.title.substring(0, 80))}</h4>
        <div style="font-size: 13px !important; color: rgba(255,255,255,0.7) !important;">
            📺 ${escapeHtml(video.channel)} • 👁️ ${video.views.toLocaleString()} views
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📍 INJECT VIDEO INTO CONTENT
// ═══════════════════════════════════════════════════════════════════════════════

export function injectVideoIntoContent(
    htmlContent: string,
    video: YouTubeVideoData,
    title: string,
    position: 'after-intro' | 'middle' | 'before-conclusion' = 'after-intro'
): string {
    if (!video?.videoId || !htmlContent) return htmlContent;

    const embedHtml = generateVideoEmbedHTML(video, title);

    switch (position) {
        case 'after-intro': {
            // Insert after first paragraph
            const firstPEnd = htmlContent.indexOf('</p>');
            if (firstPEnd > -1) {
                return htmlContent.slice(0, firstPEnd + 4) + '\n\n' + embedHtml + '\n\n' + htmlContent.slice(firstPEnd + 4);
            }
            break;
        }
        case 'middle': {
            // Insert after middle H2
            const h2Matches = [...htmlContent.matchAll(/<\/h2>/gi)];
            const midIdx = Math.floor(h2Matches.length / 2);
            if (h2Matches[midIdx]) {
                const pos = h2Matches[midIdx].index! + 5;
                return htmlContent.slice(0, pos) + '\n\n' + embedHtml + '\n\n' + htmlContent.slice(pos);
            }
            break;
        }
        case 'before-conclusion': {
            // Insert before conclusion section
            const conclusionMatch = htmlContent.match(/<h2[^>]*>[^<]*(?:conclusion|summary|takeaway)/i);
            if (conclusionMatch?.index) {
                return htmlContent.slice(0, conclusionMatch.index) + '\n\n' + embedHtml + '\n\n' + htmlContent.slice(conclusionMatch.index);
            }
            break;
        }
    }

    // Fallback: append before end
    return htmlContent + '\n\n' + embedHtml;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 QUICK HELPER FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

export async function findAndEmbedYouTubeVideo(
    serperApiKey: string,
    topic: string,
    targetKeyword?: string
): Promise<{ html: string; video: YouTubeVideoData | null }> {
    if (!serperApiKey) {
        return { html: '', video: null };
    }

    const service = new YouTubeVideoService({ serperApiKey });
    const result = await service.findBestVideo(topic, targetKeyword);

    if (!result.video) {
        return { html: '', video: null };
    }

    return {
        html: service.generateEmbed(result.video, topic),
        video: result.video,
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 RE-EXPORT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type { YouTubeVideoData, YouTubeSearchResult };

export default YouTubeVideoService;
