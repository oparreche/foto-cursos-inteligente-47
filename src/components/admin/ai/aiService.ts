import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

// Defining the structure of the AI settings table data
interface AISettingsRecord {
  id: number;
  provider: string;
  model: string;
  api_key: string;
  last_updated: string | null;
  updated_by: string | null;
}

// Get AI configuration from database
export const getAIConfig = async (): Promise<AIConfig | null> => {
  try {
    // Use the database function for getting AI settings
    const { data, error } = await supabase
      .rpc('get_ai_settings')
      .single();
      
    if (error) {
      console.error('Error fetching AI configuration:', error);
      return null;
    }
    
    if (!data) {
      console.error('No AI configuration found');
      return null;
    }
    
    // Convert the returned data to our AIConfig format with proper type casting
    return {
      provider: data.provider as 'openai' | 'perplexity' | null,
      model: data.model as AIModel | null,
      apiKey: data.api_key,
      lastUpdated: data.last_updated || undefined,
      updatedBy: data.updated_by || undefined
    };
  } catch (error) {
    console.error('Exception when fetching AI configuration:', error);
    return null;
  }
};

// Update AI configuration
export const updateAIConfig = async (config: AIConfig): Promise<boolean> => {
  try {
    // Use the database function for updating AI settings
    const { error } = await supabase
      .rpc('update_ai_settings', {
        p_provider: config.provider,
        p_model: config.model,
        p_api_key: config.apiKey
      });
      
    if (error) {
      console.error('Error updating AI configuration:', error);
      toast.error('Falha ao atualizar configurações de IA');
      return false;
    }
    
    toast.success('Configurações de IA atualizadas com sucesso');
    return true;
  } catch (error) {
    console.error('Exception when updating AI configuration:', error);
    toast.error('Erro ao atualizar configurações de IA');
    return false;
  }
};

// Generate content using configured AI model
export const generateContent = async (prompt: ContentPrompt): Promise<AIResponse | null> => {
  try {
    const config = await getAIConfig();
    
    if (!config || !config.apiKey || !config.model || !config.provider) {
      toast.error('Configurações de IA incompletas. Configure através do painel de administrador.');
      return null;
    }
    
    // Format the prompt based on content type
    const formattedPrompt = formatPrompt(prompt);
    
    if (config.provider === 'openai') {
      return await generateWithOpenAI(config, formattedPrompt);
    } else if (config.provider === 'perplexity') {
      return await generateWithPerplexity(config, formattedPrompt);
    } else {
      toast.error('Provedor de IA não suportado');
      return null;
    }
  } catch (error) {
    console.error('Error generating content:', error);
    toast.error('Falha ao gerar conteúdo com IA');
    return null;
  }
};

// Format prompt based on content type
const formatPrompt = (prompt: ContentPrompt): string => {
  const { type, topic, keywords, targetAudience, tone, length, additionalInstructions } = prompt;
  
  let formattedPrompt = '';
  
  switch (type) {
    case 'blog':
      formattedPrompt = `Crie um artigo para o blog sobre "${topic || 'o tópico especificado'}".`;
      if (keywords && keywords.length) {
        formattedPrompt += ` Inclua as seguintes palavras-chave: ${keywords.join(', ')}.`;
      }
      break;
    case 'course':
      formattedPrompt = `Crie uma descrição de curso sobre "${topic || 'o tópico especificado'}"`;
      break;
    case 'seo':
      formattedPrompt = `Gere uma otimização SEO para o conteúdo sobre "${topic || 'o tópico especificado'}"`;
      if (keywords && keywords.length) {
        formattedPrompt += ` com foco nas palavras-chave: ${keywords.join(', ')}.`;
      }
      break;
    case 'dashboard':
      formattedPrompt = `Crie uma análise de KPIs para um dashboard sobre "${topic || 'métricas de desempenho'}"`;
      break;
  }
  
  if (targetAudience) {
    formattedPrompt += ` O público-alvo é: ${targetAudience}.`;
  }
  
  if (tone) {
    formattedPrompt += ` Use um tom ${tone === 'formal' ? 'formal' : 
                              tone === 'casual' ? 'casual' : 
                              tone === 'technical' ? 'técnico' : 'amigável'}.`;
  }
  
  if (length) {
    formattedPrompt += ` O conteúdo deve ser ${length === 'short' ? 'curto' : 
                               length === 'medium' ? 'de tamanho médio' : 'longo'}.`;
  }
  
  if (additionalInstructions) {
    formattedPrompt += ` ${additionalInstructions}`;
  }
  
  return formattedPrompt;
};

// Generate content with OpenAI
const generateWithOpenAI = async (config: AIConfig, prompt: string): Promise<AIResponse | null> => {
  try {
    const startTime = Date.now();
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: 'Você é um assistente especializado em criar conteúdo educacional de alta qualidade.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });
    
    const data = await response.json();
    const processingTime = Date.now() - startTime;
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      toast.error(`Erro na API OpenAI: ${data.error?.message || 'Erro desconhecido'}`);
      return null;
    }
    
    return {
      content: data.choices[0].message.content,
      metadata: {
        tokens: data.usage?.total_tokens,
        processingTime,
      }
    };
  } catch (error) {
    console.error('Error with OpenAI generation:', error);
    toast.error('Falha ao gerar com OpenAI');
    return null;
  }
};

// Generate content with Perplexity
const generateWithPerplexity = async (config: AIConfig, prompt: string): Promise<AIResponse | null> => {
  try {
    const startTime = Date.now();
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: 'Você é um assistente especializado em criar conteúdo educacional de alta qualidade.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });
    
    const data = await response.json();
    const processingTime = Date.now() - startTime;
    
    if (!response.ok) {
      console.error('Perplexity API error:', data);
      toast.error(`Erro na API Perplexity: ${data.error?.message || 'Erro desconhecido'}`);
      return null;
    }
    
    return {
      content: data.choices[0].message.content,
      metadata: {
        processingTime,
      }
    };
  } catch (error) {
    console.error('Error with Perplexity generation:', error);
    toast.error('Falha ao gerar com Perplexity');
    return null;
  }
};
