// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v39.0 — YOUTUBE VIDEO SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

export const YOUTUBE_VIDEO_SERVICE_VERSION = "39.0.0";

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface YouTubeVideoData {
    videoId: string;
    title: string;
    channel: string;
    channelUrl?: string;
    views: number;
    duration?: string;
    thumbnailUrl: string;
    embedUrl: string;
    publishedAt?: string;
    description?: string;
    relevanceScore: number;
}

export interface YouTubeServiceConfig {
    serperApiKey: string;
    minViews?: number;
    minDuration?: number;
    maxDuration?: number;
    enableCaching?: boolean;
}

export interface YouTubeSearchResult {
    video: YouTubeVideoData | null;
    source: string;
    alternates?: YouTubeVideoData[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function extractYouTubeVideoId(url: string): string | null {
    if (!url) return null;
    
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }
    
    return null;
}

function parseViewCount(viewString: string | number | undefined): number {
    if (!viewString) return 0;
    if (typeof viewString === 'number') return viewString;
    
    const str = viewString.toString().toLowerCase().replace(/,/g, '');
    const multipliers: Record<string, number> = {
        'k': 1000,
        'm': 1000000,
        'b': 1000000000
    };
    
    for (const [suffix, mult] of Object.entries(multipliers)) {
        if (str.includes(suffix)) {
            return Math.round(parseFloat(str.replace(/[^0-9.]/g, '')) * mult);
        }
    }
    
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
}

function escapeHtml(str: string): string {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎬 YOUTUBE VIDEO SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class YouTubeVideoService {
    private config: YouTubeServiceConfig;
    private cache: Map<string, YouTubeSearchResult> = new Map();
    
    constructor(config: YouTubeServiceConfig) {
        this.config = {
            minViews: 1000,
            minDuration: 60,
            maxDuration: 3600,
            enableCaching: true,
            ...config
        };
    }
    
    async findBestVideo(
        topic: string,
        targetKeyword: string
    ): Promise<YouTubeSearchResult> {
        const cacheKey = `${topic}:${targetKeyword}`.toLowerCase();
        
        if (this.config.enableCaching && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }
        
        const currentYear = new Date().getFullYear();
        
        const queries = [
            `${topic} tutorial guide`,
            `${topic} explained ${currentYear}`,
            `how to ${topic}`,
            `${topic} for beginners`
        ];
        
        const allVideos: YouTubeVideoData[] = [];
        
        for (const query of queries) {
            try {
                const response = await fetch('https://google.serper.dev/videos', {
                    method: 'POST',
                    headers: {
                        'X-API-KEY': this.config.serperApiKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        q: query,
                        gl: 'us',
                        hl: 'en',
                        num: 10
                    })
                });
                
                if (!response.ok) continue;
                
                const data = await response.json();
                
                for (const video of (data.videos || [])) {
                    if (!video.link?.includes('youtube.com') && !video.link?.includes('youtu.be')) {
                        continue;
                    }
                    
                    const videoId = extractYouTubeVideoId(video.link);
                    if (!videoId) continue;
                    
                    if (allVideos.some(v => v.videoId === videoId)) continue;
                    
                    const views = parseViewCount(video.views);
                    if (views < (this.config.minViews || 1000)) continue;
                    
                    // Calculate relevance score
                    const titleLower = (video.title || '').toLowerCase();
                    const topicWords = topic.toLowerCase().split(/\s+/).filter(w => w.length > 3);
                    const matchingWords = topicWords.filter(w => titleLower.includes(w)).length;
                    
                    let relevanceScore = 50 + Math.min(30, (matchingWords / Math.max(topicWords.length, 1)) * 30);
                    
                    if (views >= 1000000) relevanceScore += 15;
                    else if (views >= 100000) relevanceScore += 10;
                    else if (views >= 50000) relevanceScore += 5;
                    
                    allVideos.push({
                        videoId,
                        title: video.title || 'Video',
                        channel: video.channel || 'Unknown',
                        views,
                        duration: video.duration,
                        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                        embedUrl: `https://www.youtube.com/embed/${videoId}`,
                        relevanceScore: Math.min(100, relevanceScore),
                        description: video.snippet || video.description || ''
                    });
                }
                
                if (allVideos.length >= 5) break;
                
            } catch (err) {
                console.error('YouTube search error:', err);
            }
            
            await new Promise(r => setTimeout(r, 300));
        }
        
        allVideos.sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        const result: YouTubeSearchResult = {
            video: allVideos[0] || null,
            source: 'serper',
            alternates: allVideos.slice(1, 5)
        };
        
        if (this.config.enableCaching) {
            this.cache.set(cacheKey, result);
        }
        
        return result;
    }
    
    async validateVideo(videoId: string): Promise<boolean> {
        try {
            const response = await fetch(
                `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
                { method: 'GET' }
            );
            return response.ok;
        } catch {
            return false;
        }
    }
    
    generateEmbed(
        video: YouTubeVideoData,
        title: string,
        style: 'full' | 'minimal' = 'full'
    ): string {
        const titleEscaped = escapeHtml(video.title || title);
        
        if (style === 'minimal') {
            return `
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; margin: 32px 0;">
    <iframe 
        src="https://www.youtube.com/embed/${video.videoId}?rel=0"
        title="${titleEscaped}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    ></iframe>
</div>`;
        }
        
        const videoSchema = {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": video.title,
            "description": video.description || `Video about ${title}`,
            "thumbnailUrl": [`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`],
            "uploadDate": new Date().toISOString().split('T')[0],
            "embedUrl": video.embedUrl,
            "contentUrl": `https://www.youtube.com/watch?v=${video.videoId}`
        };
        
        return `
<script type="application/ld+json">${JSON.stringify(videoSchema)}</script>
<div style="margin: 48px 0; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 48px rgba(0,0,0,0.15); background: #000;">
    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
        <iframe 
            src="https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1"
            title="${titleEscaped}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
        ></iframe>
    </div>
    <div style="padding: 20px 24px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
        <h4 style="font-size: 16px; font-weight: 700; margin: 0 0 8px 0; color: #fff; line-height: 1.4;">${escapeHtml(video.title.substring(0, 60))}${video.title.length > 60 ? '...' : ''}</h4>
        <div style="display: flex; gap: 16px; font-size: 13px; color: rgba(255,255,255,0.7);">
            <span>📺 ${escapeHtml(video.channel)}</span>
            <span>👁️ ${video.views.toLocaleString()} views</span>
        </div>
    </div>
</div>`;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function generateVideoEmbedHTML(video: YouTubeVideoData, title: string): string {
    const service = new YouTubeVideoService({ serperApiKey: '' });
    return service.generateEmbed(video, title, 'full');
}

export function injectVideoIntoContent(
    htmlContent: string,
    video: YouTubeVideoData,
    title: string,
    position: 'after-intro' | 'before-conclusion' | 'middle' = 'after-intro'
): string {
    const embed = generateVideoEmbedHTML(video, title);
    
    if (position === 'after-intro') {
        // Find first H2 and insert before it
        const h2Match = htmlContent.match(/<h2[^>]*>/i);
        if (h2Match && h2Match.index !== undefined) {
            return htmlContent.slice(0, h2Match.index) + embed + '\n\n' + htmlContent.slice(h2Match.index);
        }
    } else if (position === 'before-conclusion') {
        // Find last H2 and insert before it
        const h2Matches = [...htmlContent.matchAll(/<h2[^>]*>/gi)];
        if (h2Matches.length > 0) {
            const lastH2 = h2Matches[h2Matches.length - 1];
            if (lastH2.index !== undefined) {
                return htmlContent.slice(0, lastH2.index) + embed + '\n\n' + htmlContent.slice(lastH2.index);
            }
        }
    } else {
        // Middle - insert at approximately 40% through
        const h2Matches = [...htmlContent.matchAll(/<h2[^>]*>/gi)];
        const midPoint = Math.floor(h2Matches.length * 0.4);
        if (h2Matches[midPoint]?.index !== undefined) {
            return htmlContent.slice(0, h2Matches[midPoint].index) + embed + '\n\n' + htmlContent.slice(h2Matches[midPoint].index);
        }
    }
    
    // Fallback: append to end
    return htmlContent + '\n\n' + embed;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
    YOUTUBE_VIDEO_SERVICE_VERSION,
    YouTubeVideoService,
    generateVideoEmbedHTML,
    injectVideoIntoContent
};
