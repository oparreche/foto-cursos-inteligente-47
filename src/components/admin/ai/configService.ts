
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AIConfig } from "./types";

// Get AI configuration from database
export const getAIConfig = async (): Promise<AIConfig | null> => {
  try {
    // Use the database function for getting AI settings
    const { data, error } = await supabase
      .rpc('get_ai_settings');
      
    if (error) {
      console.error('Error fetching AI configuration:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.error('No AI configuration found');
      return null;
    }
    
    // Convert the returned data to our AIConfig format with proper type casting
    const record = data[0];
    return {
      provider: record.provider as 'openai' | 'perplexity' | null,
      model: record.model as AIConfig['model'],
      apiKey: record.api_key,
      lastUpdated: record.last_updated || undefined,
      updatedBy: record.updated_by || undefined
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
