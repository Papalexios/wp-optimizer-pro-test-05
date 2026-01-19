/**
 * WP OPTIMIZER PRO v50.0 - VECTOR MEMORY SYSTEM
 * 
 * Enterprise-grade semantic memory for content optimization
 * Features:
 * - Vector embeddings for semantic search
 * - Episodic memory for context retention
 * - Similarity-based content retrieval
 * - Multi-dimensional content clustering
 */

export interface VectorEmbedding {
  id: string;
  vector: number[];
  content: string;
  metadata: Record<string, unknown>;
  timestamp: Date;
  contentType: 'article' | 'keyword' | 'serp' | 'entity' | 'topic';
}

export interface MemoryEntry {
  id: string;
  content: string;
  embedding?: VectorEmbedding;
  importance: number;
  accessCount: number;
  lastAccessed: Date;
  created: Date;
  tags: string[];
  associations: string[];
}

export interface EpisodeContext {
  sessionId: string;
  goal: string;
  actions: Array<{
    action: string;
    result: string;
    timestamp: Date;
  }>;
  learnings: string[];
}

export interface SimilarityResult {
  entry: MemoryEntry;
  score: number;
  relevanceExplanation?: string;
}

const generateId = (): string => 
  `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * VectorMemorySystem - Semantic memory with vector search
 */
export class VectorMemorySystem {
  private memories: Map<string, MemoryEntry> = new Map();
  private embeddings: Map<string, VectorEmbedding> = new Map();
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'text-embedding-3-small') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async store(content: string, metadata: Record<string, unknown> = {}, tags: string[] = []): Promise<MemoryEntry> {
    const embedding = await this.createEmbedding(content, metadata);
    
    const entry: MemoryEntry = {
      id: generateId(),
      content,
      embedding,
      importance: this.calculateImportance(content, metadata),
      accessCount: 0,
      lastAccessed: new Date(),
      created: new Date(),
      tags,
      associations: []
    };

    this.memories.set(entry.id, entry);
    if (embedding) {
      this.embeddings.set(embedding.id, embedding);
    }

    return entry;
  }

  async search(query: string, topK: number = 5): Promise<SimilarityResult[]> {
    const queryEmbedding = await this.createEmbedding(query, {});
    if (!queryEmbedding) return [];

    const results: SimilarityResult[] = [];

    for (const [, entry] of this.memories) {
      if (entry.embedding) {
        const score = this.cosineSimilarity(queryEmbedding.vector, entry.embedding.vector);
        results.push({ entry, score });
      }
    }

    results.sort((a, b) => b.score - a.score);
    
    // Update access counts for retrieved memories
    const topResults = results.slice(0, topK);
    topResults.forEach(r => {
      r.entry.accessCount++;
      r.entry.lastAccessed = new Date();
    });

    return topResults;
  }

  async findSimilar(entryId: string, topK: number = 5): Promise<SimilarityResult[]> {
    const entry = this.memories.get(entryId);
    if (!entry?.embedding) return [];

    return this.searchByVector(entry.embedding.vector, topK, [entryId]);
  }

  private async searchByVector(vector: number[], topK: number, excludeIds: string[] = []): Promise<SimilarityResult[]> {
    const results: SimilarityResult[] = [];

    for (const [id, entry] of this.memories) {
      if (excludeIds.includes(id)) continue;
      if (entry.embedding) {
        const score = this.cosineSimilarity(vector, entry.embedding.vector);
        results.push({ entry, score });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  private async createEmbedding(content: string, metadata: Record<string, unknown>): Promise<VectorEmbedding | undefined> {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          input: content.substring(0, 8000), // Token limit safety
        }),
      });

      if (!response.ok) {
        console.error('Embedding API error:', response.status);
        return undefined;
      }

      const data = await response.json();
      const vector = data.data?.[0]?.embedding;

      if (!vector) return undefined;

      return {
        id: generateId(),
        vector,
        content,
        metadata,
        timestamp: new Date(),
        contentType: (metadata.type as VectorEmbedding['contentType']) || 'article'
      };
    } catch (error) {
      console.error('Failed to create embedding:', error);
      return undefined;
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
  }

  private calculateImportance(content: string, metadata: Record<string, unknown>): number {
    let score = 0.5;
    
    // Length factor
    if (content.length > 500) score += 0.1;
    if (content.length > 1000) score += 0.1;
    
    // Metadata richness
    const metaKeys = Object.keys(metadata).length;
    score += Math.min(metaKeys * 0.05, 0.2);
    
    // Priority boost
    if (metadata.priority === 'high') score += 0.2;
    
    return Math.min(score, 1);
  }

  getStats(): Record<string, number> {
    return {
      totalMemories: this.memories.size,
      totalEmbeddings: this.embeddings.size,
      avgImportance: Array.from(this.memories.values()).reduce((a, m) => a + m.importance, 0) / this.memories.size || 0,
      avgAccessCount: Array.from(this.memories.values()).reduce((a, m) => a + m.accessCount, 0) / this.memories.size || 0
    };
  }

  prune(maxAge: number = 7 * 24 * 60 * 60 * 1000): number {
    const cutoff = Date.now() - maxAge;
    let removed = 0;

    for (const [id, entry] of this.memories) {
      if (entry.lastAccessed.getTime() < cutoff && entry.importance < 0.5) {
        this.memories.delete(id);
        if (entry.embedding) {
          this.embeddings.delete(entry.embedding.id);
        }
        removed++;
      }
    }

    return removed;
  }
}

/**
 * EpisodicMemory - Session-based contextual memory
 */
export class EpisodicMemory {
  private episodes: Map<string, EpisodeContext> = new Map();
  private currentEpisode: EpisodeContext | null = null;

  startEpisode(goal: string): string {
    const sessionId = `ep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.currentEpisode = {
      sessionId,
      goal,
      actions: [],
      learnings: []
    };

    this.episodes.set(sessionId, this.currentEpisode);
    return sessionId;
  }

  recordAction(action: string, result: string): void {
    if (!this.currentEpisode) return;
    
    this.currentEpisode.actions.push({
      action,
      result,
      timestamp: new Date()
    });
  }

  addLearning(learning: string): void {
    if (!this.currentEpisode) return;
    this.currentEpisode.learnings.push(learning);
  }

  endEpisode(): EpisodeContext | null {
    const episode = this.currentEpisode;
    this.currentEpisode = null;
    return episode;
  }

  getEpisode(sessionId: string): EpisodeContext | undefined {
    return this.episodes.get(sessionId);
  }

  getRecentEpisodes(count: number = 10): EpisodeContext[] {
    return Array.from(this.episodes.values())
      .sort((a, b) => {
        const aTime = a.actions[0]?.timestamp.getTime() || 0;
        const bTime = b.actions[0]?.timestamp.getTime() || 0;
        return bTime - aTime;
      })
      .slice(0, count);
  }

  findSimilarEpisodes(goal: string): EpisodeContext[] {
    const keywords = goal.toLowerCase().split(/\s+/);
    
    return Array.from(this.episodes.values())
      .filter(ep => {
        const epKeywords = ep.goal.toLowerCase().split(/\s+/);
        const overlap = keywords.filter(k => epKeywords.some(ek => ek.includes(k) || k.includes(ek)));
        return overlap.length >= Math.min(2, keywords.length / 2);
      });
  }

  extractPatterns(): Record<string, string[]> {
    const patterns: Record<string, string[]> = {
      successfulActions: [],
      commonLearnings: [],
      frequentGoals: []
    };

    const actionCounts = new Map<string, number>();
    const learningCounts = new Map<string, number>();

    for (const episode of this.episodes.values()) {
      for (const action of episode.actions) {
        if (action.result.toLowerCase().includes('success')) {
          const count = actionCounts.get(action.action) || 0;
          actionCounts.set(action.action, count + 1);
        }
      }
      
      for (const learning of episode.learnings) {
        const count = learningCounts.get(learning) || 0;
        learningCounts.set(learning, count + 1);
      }
    }

    patterns.successfulActions = Array.from(actionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([action]) => action);

    patterns.commonLearnings = Array.from(learningCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([learning]) => learning);

    return patterns;
  }

  getStats(): Record<string, number> {
    const totalActions = Array.from(this.episodes.values())
      .reduce((sum, ep) => sum + ep.actions.length, 0);
    
    const totalLearnings = Array.from(this.episodes.values())
      .reduce((sum, ep) => sum + ep.learnings.length, 0);

    return {
      totalEpisodes: this.episodes.size,
      totalActions,
      totalLearnings,
      avgActionsPerEpisode: this.episodes.size > 0 ? totalActions / this.episodes.size : 0,
      avgLearningsPerEpisode: this.episodes.size > 0 ? totalLearnings / this.episodes.size : 0
    };
  }
}

// Export combined memory factory
export function createMemorySystem(
  apiKey: string,
  embeddingModel?: string
): { vector: VectorMemorySystem; episodic: EpisodicMemory } {
  return {
    vector: new VectorMemorySystem(apiKey, embeddingModel),
    episodic: new EpisodicMemory()
  };
}
