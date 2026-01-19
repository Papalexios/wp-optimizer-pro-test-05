/**
 * Enterprise SEO Analyzer - SOTA Content Analysis System
 * Provides comprehensive SEO analysis for WordPress content optimization
 */

export interface SEOAnalysisResult {
  overallScore: number;
  keywordDensity: number;
  readabilityScore: number;
  suggestions: SEOSuggestion[];
  metaAnalysis: MetaAnalysis;
}

export interface SEOSuggestion {
  type: 'critical' | 'warning' | 'info';
  category: string;
  message: string;
  impact: number;
}

export interface MetaAnalysis {
  titleLength: number;
  titleOptimal: boolean;
  descriptionLength: number;
  descriptionOptimal: boolean;
  keywordInTitle: boolean;
  keywordInDescription: boolean;
}

export class SEOAnalyzer {
  private content: string;
  private html: string;
  private keyword: string;

  constructor(html: string, keyword: string) {
    this.html = html;
    this.content = this.stripHtml(html);
    this.keyword = keyword.toLowerCase();
  }

  public analyze(): SEOAnalysisResult {
    const keywordDensity = this.calculateKeywordDensity();
    const readabilityScore = this.calculateReadability();
    const metaAnalysis = this.analyzeMetaTags();
    const suggestions = this.generateSuggestions(keywordDensity, readabilityScore, metaAnalysis);
    const overallScore = this.calculateOverallScore(keywordDensity, readabilityScore, metaAnalysis);

    return { overallScore, keywordDensity, readabilityScore, suggestions, metaAnalysis };
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  private calculateKeywordDensity(): number {
    const words = this.content.toLowerCase().split(/\s+/);
    const keywordCount = words.filter(w => w.includes(this.keyword)).length;
    return Math.round((keywordCount / words.length) * 100 * 100) / 100;
  }

  private calculateReadability(): number {
    const words = this.content.split(/\s+/);
    const sentences = this.content.split(/[.!?]+/).filter(s => s.trim());
    const avgWordsPerSentence = words.length / Math.max(1, sentences.length);
    const complexWords = words.filter(w => w.length > 10).length;
    const complexRatio = complexWords / words.length;
    return Math.round((1 - complexRatio) * (1 - Math.min(avgWordsPerSentence / 30, 1)) * 100);
  }

  private analyzeMetaTags(): MetaAnalysis {
    const titleMatch = this.html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const descMatch = this.html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i);
    const title = titleMatch?.[1] || '';
    const desc = descMatch?.[1] || '';

    return {
      titleLength: title.length,
      titleOptimal: title.length >= 30 && title.length <= 60,
      descriptionLength: desc.length,
      descriptionOptimal: desc.length >= 120 && desc.length <= 160,
      keywordInTitle: title.toLowerCase().includes(this.keyword),
      keywordInDescription: desc.toLowerCase().includes(this.keyword),
    };
  }

  private calculateOverallScore(density: number, readability: number, meta: MetaAnalysis): number {
    let score = 0;
    if (density >= 1 && density <= 3) score += 25;
    else if (density > 0) score += 10;
    score += readability * 0.3;
    if (meta.titleOptimal) score += 15;
    if (meta.descriptionOptimal) score += 15;
    if (meta.keywordInTitle) score += 10;
    if (meta.keywordInDescription) score += 5;
    return Math.min(100, Math.round(score));
  }

  private generateSuggestions(density: number, readability: number, meta: MetaAnalysis): SEOSuggestion[] {
    const suggestions: SEOSuggestion[] = [];
    if (density < 1) suggestions.push({ type: 'critical', category: 'Keywords', message: 'Increase keyword density to at least 1%', impact: 15 });
    if (density > 3) suggestions.push({ type: 'warning', category: 'Keywords', message: 'Reduce keyword density below 3% to avoid over-optimization', impact: 10 });
    if (!meta.keywordInTitle) suggestions.push({ type: 'critical', category: 'Meta', message: 'Add primary keyword to title tag', impact: 10 });
    if (!meta.titleOptimal) suggestions.push({ type: 'warning', category: 'Meta', message: 'Optimize title length (30-60 characters)', impact: 8 });
    if (!meta.descriptionOptimal) suggestions.push({ type: 'warning', category: 'Meta', message: 'Optimize meta description (120-160 characters)', impact: 8 });
    if (readability < 60) suggestions.push({ type: 'info', category: 'Readability', message: 'Simplify content for better readability', impact: 5 });
    return suggestions.sort((a, b) => b.impact - a.impact);
  }
}

export default SEOAnalyzer;
