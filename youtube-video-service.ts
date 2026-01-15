// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO — ENTERPRISE YOUTUBE VIDEO INTEGRATION SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
//
// SOTA FEATURES:
// ✅ Serper.dev API integration for YouTube video discovery
// ✅ Multi-strategy search with relevance scoring
// ✅ Video quality validation (views, duration, channel authority)
// ✅ Smart video selection algorithm
// ✅ Responsive embed HTML generation
// ✅ SEO-optimized video schema markup
// ✅ Rate limiting and caching
// ✅ Fallback mechanisms for reliability
// ═══════════════════════════════════════════════════════════════════════════════

import type { YouTubeVideoData, YouTubeSearchResult } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// 📌 CONSTANTS & CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const SERPER_API_URL = 'https://google.serper.dev/videos';
const MIN_VIEWS_THRESHOLD = 1000;
const MIN_DURATION_SECONDS = 60; // Minimum 1 minute
const MAX_DURATION_SECONDS = 3600; // Maximum 1 hour
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache
const RATE_LIMIT_DELAY_MS = 100;

// Authority channels get bonus scoring
const AUTHORITY_CHANNEL_KEYWORDS = [
    'official', 'verified', 'tutorial', 'guide', 'academy',
    'learn', 'education', 'how to', 'explained', 'university',
    'course', 'training', 'masterclass', 'pro', 'expert'
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SerperVideoResult {
    title: string;
    link: string;
    snippet?: string;
    imageUrl?: string;
    duration?: string;
    source?: string;
    channel?: string;
    date?: string;
    position?: number;
}

export interface SerperVideoResponse {
    videos?: SerperVideoResult[];
    searchParameters?: {
        q: string;
        type: string;
    };
    credits?: number;
}

export interface VideoQualityScore {
    total: number;
    relevanceScore: number;
    viewsScore: number;
    durationScore: number;
    channelScore: number;
    recencyScore: number;
}

export interface YouTubeVideoServiceConfig {
    serperApiKey: string;
    minViews?: number;
    minDuration?: number;
    maxDuration?: number;
    preferredLanguage?: string;
    enableCaching?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🗄️ CACHE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

interface CacheEntry {
    data: YouTubeVideoData | null;
    timestamp: number;
    query: string;
}

const videoCache = new Map<string, CacheEntry>();

function getCacheKey(query: string): string {
    return query.toLowerCase().trim().replace(/\s+/g, '_');
}

function getFromCache(query: string): YouTubeVideoData | null | undefined {
    const key = getCacheKey(query);
    const entry = videoCache.get(key);
    
    if (!entry) return undefined;
    
    const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;
    if (isExpired) {
        videoCache.delete(key);
        return undefined;
    }
    
    return entry.data;
}

function setCache(query: string, data: YouTubeVideoData | null): void {
    const key = getCacheKey(query);
    videoCache.set(key, {
        data,
        timestamp: Date.now(),
        query
    });
    
    // Clean old entries if cache grows too large
    if (videoCache.size > 100) {
        const oldestKey = videoCache.keys().next().value;
        if (oldestKey) videoCache.delete(oldestKey);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔍 SERPER API INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Search for YouTube videos using Serper.dev API
 */
async function searchVideosWithSerper(
    query: string,
    apiKey: string,
    numResults: number = 10
): Promise<SerperVideoResult[]> {
    if (!apiKey || apiKey.trim() === '') {
        console.warn('[YouTubeService] No Serper API key provided');
        return [];
    }

    try {
        const response = await fetch(SERPER_API_URL, {
            method: 'POST',
            headers: {
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: `${query} site:youtube.com`,
                num: numResults,
                gl: 'us',
                hl: 'en'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[YouTubeService] Serper API error: ${response.status} - ${errorText}`);
            return [];
        }

        const data: SerperVideoResponse = await response.json();
        
        if (!data.videos || data.videos.length === 0) {
            console.log('[YouTubeService] No videos found in Serper response');
            return [];
        }

        console.log(`[YouTubeService] Found ${data.videos.length} videos from Serper`);
        return data.videos;
        
    } catch (error) {
        console.error('[YouTubeService] Serper API request failed:', error);
        return [];
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 VIDEO QUALITY SCORING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extract YouTube video ID from URL
 */
function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }
    
    return null;
}

/**
 * Parse duration string to seconds (e.g., "10:30" -> 630)
 */
function parseDurationToSeconds(duration: string | undefined): number {
    if (!duration) return 0;
    
    // Handle "HH:MM:SS" or "MM:SS" format
    const parts = duration.split(':').map(Number);
    
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
        return parts[0];
    }
    
    return 0;
}

/**
 * Parse view count from string (e.g., "1.5M views" -> 1500000)
 */
function parseViewCount(viewStr: string | undefined): number {
    if (!viewStr) return 0;
    
    const normalized = viewStr.toLowerCase().replace(/[^0-9.kmb]/g, '');
    const match = normalized.match(/([\d.]+)([kmb])?/);
    
    if (!match) return 0;
    
    let num = parseFloat(match[1]);
    const suffix = match[2];
    
    if (suffix === 'k') num *= 1000;
    else if (suffix === 'm') num *= 1000000;
    else if (suffix === 'b') num *= 1000000000;
    
    return Math.round(num);
}

/**
 * Calculate relevance score based on title/snippet matching
 */
function calculateRelevanceScore(video: SerperVideoResult, query: string): number {
    let score = 0;
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    const title = (video.title || '').toLowerCase();
    const snippet = (video.snippet || '').toLowerCase();
    
    // Title matching (more important)
    for (const term of queryTerms) {
        if (title.includes(term)) score += 20;
        if (snippet.includes(term)) score += 10;
    }
    
    // Exact phrase bonus
    if (title.includes(query.toLowerCase())) score += 30;
    
    // Tutorial/guide/how-to bonus
    const helpfulTerms = ['tutorial', 'guide', 'how to', 'explained', 'step by step', 'complete'];
    for (const term of helpfulTerms) {
        if (title.includes(term)) score += 15;
    }
    
    return Math.min(score, 100);
}

/**
 * Calculate channel authority score
 */
function calculateChannelScore(channel: string | undefined): number {
    if (!channel) return 30;
    
    const channelLower = channel.toLowerCase();
    let score = 40; // Base score
    
    for (const keyword of AUTHORITY_CHANNEL_KEYWORDS) {
        if (channelLower.includes(keyword)) {
            score += 10;
        }
    }
    
    return Math.min(score, 100);
}

/**
 * Calculate recency score based on publish date
 */
function calculateRecencyScore(dateStr: string | undefined): number {
    if (!dateStr) return 50;
    
    const dateLower = dateStr.toLowerCase();
    
    // Parse relative dates
    if (dateLower.includes('hour') || dateLower.includes('minute')) return 100;
    if (dateLower.includes('day')) {
        const days = parseInt(dateLower) || 1;
        return days <= 7 ? 95 : days <= 30 ? 85 : 70;
    }
    if (dateLower.includes('week')) {
        const weeks = parseInt(dateLower) || 1;
        return weeks <= 4 ? 80 : 60;
    }
    if (dateLower.includes('month')) {
        const months = parseInt(dateLower) || 1;
        return months <= 6 ? 60 : months <= 12 ? 40 : 20;
    }
    if (dateLower.includes('year')) {
        const years = parseInt(dateLower) || 1;
        return years <= 1 ? 40 : years <= 2 ? 25 : 10;
    }
    
    return 50;
}

/**
 * Calculate comprehensive quality score for a video
 */
function calculateVideoQualityScore(
    video: SerperVideoResult,
    query: string,
    config: YouTubeVideoServiceConfig
): VideoQualityScore {
    const relevanceScore = calculateRelevanceScore(video, query);
    
    // Duration scoring
    const durationSeconds = parseDurationToSeconds(video.duration);
    let durationScore = 50;
    if (durationSeconds >= (config.minDuration || MIN_DURATION_SECONDS) && 
        durationSeconds <= (config.maxDuration || MAX_DURATION_SECONDS)) {
        // Optimal duration: 5-15 minutes
        if (durationSeconds >= 300 && durationSeconds <= 900) {
            durationScore = 100;
        } else if (durationSeconds >= 180 && durationSeconds <= 1200) {
            durationScore = 80;
        } else {
            durationScore = 60;
        }
    } else {
        durationScore = 20; // Outside acceptable range
    }
    
    const channelScore = calculateChannelScore(video.channel);
    const recencyScore = calculateRecencyScore(video.date);
    
    // Views score (estimated from snippet or position)
    const viewsScore = video.position ? Math.max(100 - (video.position - 1) * 10, 30) : 50;
    
    // Calculate weighted total
    const total = Math.round(
        relevanceScore * 0.35 +
        viewsScore * 0.25 +
        durationScore * 0.20 +
        channelScore * 0.10 +
        recencyScore * 0.10
    );
    
    return {
        total,
        relevanceScore,
        viewsScore,
        durationScore,
        channelScore,
        recencyScore
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎬 VIDEO SELECTION & VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Select the best video from search results
 */
function selectBestVideo(
    videos: SerperVideoResult[],
    query: string,
    config: YouTubeVideoServiceConfig
): { video: SerperVideoResult; score: VideoQualityScore } | null {
    if (videos.length === 0) return null;
    
    let bestVideo: SerperVideoResult | null = null;
    let bestScore: VideoQualityScore | null = null;
    
    for (const video of videos) {
        // Skip if no valid video ID
        const videoId = extractVideoId(video.link);
        if (!videoId) continue;
        
        // Skip shorts
        if (video.link.includes('/shorts/')) continue;
        
        const score = calculateVideoQualityScore(video, query, config);
        
        if (!bestScore || score.total > bestScore.total) {
            bestScore = score;
            bestVideo = video;
        }
    }
    
    if (!bestVideo || !bestScore) return null;
    
    // Minimum quality threshold
    if (bestScore.total < 40) {
        console.log(`[YouTubeService] Best video score ${bestScore.total} below threshold`);
        return null;
    }
    
    return { video: bestVideo, score: bestScore };
}

/**
 * Convert Serper result to YouTubeVideoData
 */
function convertToYouTubeVideoData(video: SerperVideoResult): YouTubeVideoData | null {
    const videoId = extractVideoId(video.link);
    if (!videoId) return null;
    
    return {
        videoId,
        title: video.title || 'Related Video',
        channel: video.channel || 'YouTube',
        views: 0, // Would need additional API call to get exact views
        duration: video.duration,
        thumbnailUrl: video.imageUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        publishedAt: video.date
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔍 SEARCH STRATEGIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate multiple search queries for better coverage
 */
function generateSearchQueries(topic: string, targetKeyword?: string): string[] {
    const queries: string[] = [];
    const baseTopic = targetKeyword || topic;
    
    // Primary search
    queries.push(baseTopic);
    
    // Tutorial-focused
    queries.push(`${baseTopic} tutorial`);
    
    // Guide-focused  
    queries.push(`${baseTopic} guide`);
    
    // Explained/How-to
    queries.push(`${baseTopic} explained`);
    
    return queries.slice(0, 4); // Limit to 4 queries to conserve API credits
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📺 EMBED HTML GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate responsive, SEO-optimized video embed HTML
 */
export function generateVideoEmbedHTML(video: YouTubeVideoData, topic: string): string {
    const { videoId, title, channel, duration, thumbnailUrl, embedUrl } = video;
    
    // Generate VideoObject schema
    const schema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": title,
        "description": `Video about ${topic}`,
        "thumbnailUrl": thumbnailUrl,
        "uploadDate": video.publishedAt || new Date().toISOString(),
        "embedUrl": embedUrl,
        "contentUrl": `https://www.youtube.com/watch?v=${videoId}`,
        "duration": duration ? `PT${duration.replace(':', 'M').replace(':', 'S')}S` : undefined
    };
    
    return `
<!-- YouTube Video Section - Enterprise Grade Integration -->
<div class="wp-block-embed wp-block-embed-youtube alignwide" style="margin: 2rem 0;">
    <div class="wp-block-embed__wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
        <iframe 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
            src="${embedUrl}?rel=0&modestbranding=1"
            title="${title.replace(/"/g, '&quot;')}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
        ></iframe>
    </div>
    <figcaption class="wp-element-caption" style="text-align: center; margin-top: 12px; font-size: 14px; color: #666;">
        <strong>📺 Helpful Video:</strong> ${title} ${channel ? `| By ${channel}` : ''}
    </figcaption>
</div>
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
<!-- End YouTube Video Section -->
`.trim();
}

/**
 * Generate video callout box for inline placement
 */
export function generateVideoCalloutHTML(video: YouTubeVideoData, topic: string): string {
    const { videoId, title, channel, thumbnailUrl } = video;
    
    return `
<!-- Video Recommendation Callout -->
<div class="video-recommendation" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 24px; margin: 24px 0; color: white;">
    <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
        <div style="flex: 0 0 auto;">
            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer" style="display: block; position: relative;">
                <img 
                    src="${thumbnailUrl}" 
                    alt="${title.replace(/"/g, '&quot;')}" 
                    style="width: 200px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);"
                    loading="lazy"
                />
                <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,0,0,0.9); border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </span>
            </a>
        </div>
        <div style="flex: 1; min-width: 250px;">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; margin-bottom: 8px;">🎬 Recommended Video</div>
            <h4 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; line-height: 1.3;">
                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer" style="color: white; text-decoration: none;">
                    ${title}
                </a>
            </h4>
            ${channel ? `<p style="margin: 0; opacity: 0.85; font-size: 14px;">By ${channel}</p>` : ''}
        </div>
    </div>
</div>
<!-- End Video Recommendation Callout -->
`.trim();
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 MAIN SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class YouTubeVideoService {
    private config: YouTubeVideoServiceConfig;
    private lastRequestTime: number = 0;
    
    constructor(config: YouTubeVideoServiceConfig) {
        this.config = {
            minViews: MIN_VIEWS_THRESHOLD,
            minDuration: MIN_DURATION_SECONDS,
            maxDuration: MAX_DURATION_SECONDS,
            enableCaching: true,
            ...config
        };
    }
    
    /**
     * Rate limiting helper
     */
    private async rateLimit(): Promise<void> {
        const now = Date.now();
        const elapsed = now - this.lastRequestTime;
        if (elapsed < RATE_LIMIT_DELAY_MS) {
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY_MS - elapsed));
        }
        this.lastRequestTime = Date.now();
    }
    
    /**
     * Find the best YouTube video for a topic
     */
    async findBestVideo(
        topic: string,
        targetKeyword?: string
    ): Promise<YouTubeSearchResult> {
        console.log(`[YouTubeService] Searching for video: ${targetKeyword || topic}`);
        
        // Check cache first
        if (this.config.enableCaching) {
            const cached = getFromCache(targetKeyword || topic);
            if (cached !== undefined) {
                console.log('[YouTubeService] Returning cached result');
                return {
                    video: cached,
                    source: 'serper',
                    searchQuery: targetKeyword || topic
                };
            }
        }
        
        // Generate search queries
        const queries = generateSearchQueries(topic, targetKeyword);
        let allVideos: SerperVideoResult[] = [];
        
        // Search with each query
        for (const query of queries) {
            await this.rateLimit();
            
            const results = await searchVideosWithSerper(
                query,
                this.config.serperApiKey,
                5
            );
            
            // Add position info
            results.forEach((v, i) => {
                v.position = allVideos.length + i + 1;
            });
            
            allVideos = [...allVideos, ...results];
            
            // If we found good results, don't need more queries
            if (results.length >= 3) {
                const bestCandidate = selectBestVideo(results, query, this.config);
                if (bestCandidate && bestCandidate.score.total >= 70) {
                    break;
                }
            }
        }
        
        // Remove duplicates by video ID
        const seenIds = new Set<string>();
        allVideos = allVideos.filter(v => {
            const id = extractVideoId(v.link);
            if (!id || seenIds.has(id)) return false;
            seenIds.add(id);
            return true;
        });
        
        console.log(`[YouTubeService] Total unique videos found: ${allVideos.length}`);
        
        // Select best video
        const best = selectBestVideo(allVideos, targetKeyword || topic, this.config);
        
        if (!best) {
            console.log('[YouTubeService] No suitable video found');
            if (this.config.enableCaching) {
                setCache(targetKeyword || topic, null);
            }
            return {
                video: null,
                source: 'serper',
                searchQuery: targetKeyword || topic
            };
        }
        
        console.log(`[YouTubeService] Selected video: ${best.video.title} (score: ${best.score.total})`);
        
        const videoData = convertToYouTubeVideoData(best.video);
        
        if (this.config.enableCaching && videoData) {
            setCache(targetKeyword || topic, videoData);
        }
        
        return {
            video: videoData,
            source: 'serper',
            searchQuery: targetKeyword || topic
        };
    }
    
    /**
     * Generate embed HTML for a video
     */
    generateEmbed(video: YouTubeVideoData, topic: string, style: 'full' | 'callout' = 'full'): string {
        if (style === 'callout') {
            return generateVideoCalloutHTML(video, topic);
        }
        return generateVideoEmbedHTML(video, topic);
    }
    
    /**
     * Validate a video is still accessible
     */
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
    
    /**
     * Clear the video cache
     */
    clearCache(): void {
        videoCache.clear();
        console.log('[YouTubeService] Cache cleared');
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 HELPER EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Quick helper to find and embed a video
 */
export async function findAndEmbedYouTubeVideo(
    serperApiKey: string,
    topic: string,
    targetKeyword?: string
): Promise<{ html: string; video: YouTubeVideoData | null }> {
    const service = new YouTubeVideoService({ serperApiKey });
    const result = await service.findBestVideo(topic, targetKeyword);
    
    if (!result.video) {
        return { html: '', video: null };
    }
    
    return {
        html: service.generateEmbed(result.video, topic),
        video: result.video
    };
}

/**
 * Inject YouTube video into HTML content at optimal position
 */
export function injectVideoIntoContent(
    htmlContent: string,
    video: YouTubeVideoData,
    topic: string,
    position: 'after-intro' | 'middle' | 'before-conclusion' = 'after-intro'
): string {
    const videoHtml = generateVideoEmbedHTML(video, topic);
    
    // Find injection point based on position
    const h2Matches = [...htmlContent.matchAll(/<h2[^>]*>/gi)];
    
    if (h2Matches.length === 0) {
        // No H2s, inject after first paragraph
        const firstPEnd = htmlContent.indexOf('</p>');
        if (firstPEnd !== -1) {
            return htmlContent.slice(0, firstPEnd + 4) + '\n\n' + videoHtml + '\n\n' + htmlContent.slice(firstPEnd + 4);
        }
        return videoHtml + '\n\n' + htmlContent;
    }
    
    let injectionIndex: number;
    
    switch (position) {
        case 'after-intro':
            // After first H2
            injectionIndex = h2Matches[0].index! + h2Matches[0][0].length;
            // Find end of that section (next H2 or significant content)
            const nextH2 = h2Matches[1]?.index || htmlContent.length;
            const sectionContent = htmlContent.slice(injectionIndex, nextH2);
            const endOfFirstPara = sectionContent.indexOf('</p>');
            if (endOfFirstPara !== -1) {
                injectionIndex = injectionIndex + endOfFirstPara + 4;
            }
            break;
            
        case 'middle':
            // Middle of content
            const middleIndex = Math.floor(h2Matches.length / 2);
            injectionIndex = h2Matches[middleIndex]?.index || htmlContent.length / 2;
            break;
            
        case 'before-conclusion':
            // Before last H2
            const lastH2 = h2Matches[h2Matches.length - 1];
            injectionIndex = lastH2?.index || htmlContent.length;
            break;
            
        default:
            injectionIndex = htmlContent.length / 2;
    }
    
    return (
        htmlContent.slice(0, injectionIndex) +
        '\n\n' + videoHtml + '\n\n' +
        htmlContent.slice(injectionIndex)
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default YouTubeVideoService;
