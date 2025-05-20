
// Models supported by the system
export type AIModel = 'gpt-4o' | 'gpt-4o-mini' | 'llama-3.1-sonar-small-128k-online' | 'llama-3.1-sonar-large-128k-online';

export interface AIConfig {
  provider: 'openai' | 'perplexity' | null;
  model: AIModel | null;
  apiKey: string | null;
  lastUpdated?: string;
  updatedBy?: string;
}

export interface ContentPrompt {
  type: 'blog' | 'course' | 'seo' | 'dashboard';
  topic?: string;
  keywords?: string[];
  targetAudience?: string;
  tone?: 'formal' | 'casual' | 'technical' | 'friendly';
  length?: 'short' | 'medium' | 'long';
  additionalInstructions?: string;
}

export interface AIResponse {
  content: string;
  metadata?: {
    tokens?: number;
    processingTime?: number;
  };
}
