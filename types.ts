// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v39.0 — TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const APP_VERSION = "39.0.0";

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 CORE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ContentContract {
    title: string;
    metaDescription: string;
    slug: string;
    htmlContent: string;
    excerpt?: string;
    wordCount: number;
    faqs?: Array<{ question: string; answer: string }>;
    schema?: string;
    references?: ValidatedReference[];
}

export interface GenerateConfig {
    topic: string;
    provider: 'google' | 'openrouter' | 'openai' | 'anthropic' | 'groq';
    model: string;
    apiKeys: APIKeyConfig;
    internalLinks?: InternalLinkTarget[];
    neuronTerms?: NeuronTerm[];
    existingContent?: string;
    targetWordCount?: number;
    writingStyle?: string;
}

export interface APIKeyConfig {
    google?: string;
    openrouter?: string;
    openrouterModel?: string;
    openai?: string;
    anthropic?: string;
    groq?: string;
    groqModel?: string;
    serper?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📄 PAGE & CRAWLING TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface CrawledPage {
    id: string;
    url: string;
    title: string;
    slug: string;
    excerpt?: string;
    categories?: string[];
    healthScore: number | null;
    wordCount: number;
    seoMetrics?: SeoMetrics;
    jobState?: JobState;
    opportunity?: OpportunityScore;
}

export interface SitemapPage extends CrawledPage {
    lastmod?: string;
    priority?: number;
    changefreq?: string;
}

export interface JobState {
    status: 'idle' | 'running' | 'completed' | 'failed';
    phase?: GodModePhase;
    progress?: number;
    startTime?: number;
    endTime?: number;
    error?: string;
}

export interface OpportunityScore {
    total: number;
    wordCountGap: number;
    competitorGap: number;
    seoScore: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔗 INTERNAL LINKING TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface InternalLinkTarget {
    url: string;
    title: string;
    slug: string;
    excerpt?: string;
    categories?: string[];
    keywords?: string[];
    relevanceScore?: number;
}

export interface InternalLinkResult {
    url: string;
    anchorText: string;
    relevanceScore: number;
    position: number;
    context?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📈 SEO METRICS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SeoMetrics {
    wordCount: number;
    contentDepth: number;
    readability: number;
    headingStructure: number;
    aeoScore: number;
    geoScore: number;
    eeatSignals: number;
    internalLinkScore: number;
    schemaDetected: boolean;
    schemaTypes?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 NLP & NEURON TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface NeuronTerm {
    term: string;
    type: 'critical' | 'title' | 'header' | 'body';
    importance: number;
    recommended: number;
    current?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ QA VALIDATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface QAValidationResult {
    agent: string;
    category: 'critical' | 'seo' | 'aeo' | 'geo' | 'enhancement';
    status: 'passed' | 'failed' | 'warning';
    score: number;
    feedback: string;
    fixSuggestion?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧬 ENTITY GAP ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

export interface EntityGapAnalysis {
    competitorEntities: string[];
    missingEntities: string[];
    topKeywords: string[];
    paaQuestions: string[];
    contentGaps: string[];
    avgWordCount: number;
    serpFeatures: SerpFeature[];
    competitorUrls: string[];
    competitors: CompetitorAnalysis[];
    recommendedWordCount: number;
    topicClusters: string[];
    semanticTerms: string[];
    validatedReferences: ValidatedReference[];
    knowledgeGraphData?: any;
    featuredSnippetOpportunity: boolean;
    localPackPresent: boolean;
}

export interface CompetitorAnalysis {
    url: string;
    title: string;
    wordCount: number;
    headings: string[];
    entities: string[];
    snippet?: string;
    position: number;
    domain?: string;
    hasSchema?: boolean;
    hasFAQ?: boolean;
}

export interface SerpFeature {
    type: string;
    present: boolean;
    targetable: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📚 REFERENCE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ValidatedReference {
    url: string;
    title: string;
    source: string;
    year?: string | number;
    status?: number;
    isValid?: boolean;
    domain?: string;
    isAuthority?: boolean;
    snippet?: string;
    author?: string;
    authorityScore?: number;
    favicon?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎬 YOUTUBE TYPES
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

export interface YouTubeSearchResult {
    video: YouTubeVideoData | null;
    source: string;
    alternates?: YouTubeVideoData[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔄 GOD MODE PHASES
// ═══════════════════════════════════════════════════════════════════════════════

export type GodModePhase =
    | 'idle'
    | 'initializing'
    | 'crawling'
    | 'resolving_post'
    | 'analyzing_existing'
    | 'collect_intel'
    | 'strategic_intel'
    | 'entity_gap_analysis'
    | 'reference_discovery'
    | 'reference_validation'
    | 'neuron_analysis'
    | 'competitor_deep_dive'
    | 'outline_generation'
    | 'section_drafts'
    | 'link_plan'
    | 'section_finalize'
    | 'merge_content'
    | 'prompt_assembly'
    | 'content_synthesis'
    | 'qa_validation'
    | 'auto_fix_loop'
    | 'self_improvement'
    | 'internal_linking'
    | 'schema_generation'
    | 'final_polish'
    | 'publishing'
    | 'completed'
    | 'failed'
    | 'youtube_integration';

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 FAQ TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface FAQItem {
    question: string;
    answer: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 BULK GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface BulkGenerationResult {
    url: string;
    success: boolean;
    postId?: number;
    error?: string;
    wordCount?: number;
    processingTime?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔔 TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 API KEYS TYPE
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiKeys {
    google?: string;
    openrouter?: string;
    openrouterModel?: string;
    openai?: string;
    anthropic?: string;
    groq?: string;
    groqModel?: string;
    serper?: string;
    wordpress?: {
        siteUrl: string;
        username: string;
        applicationPassword: string;
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 GLOBAL STATS
// ═══════════════════════════════════════════════════════════════════════════════

export interface GlobalStats {
    totalPages: number;
    pagesOptimized: number;
    averageScore: number;
    totalWords: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎛️ AUTONOMOUS CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

export interface AutonomousConfig {
    targetScore: number;
    maxConcurrent: number;
    autoPublish: boolean;
    publishStatus: 'draft' | 'publish';
}
