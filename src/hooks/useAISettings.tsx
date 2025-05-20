
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AIConfig } from "@/components/admin/ai/types";
import { getAIConfig, updateAIConfig } from "@/components/admin/ai/configService";
import { toast } from "sonner";

export const useAISettings = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  console.log("useAISettings hook inicializado");
  
  // Fetch AI settings
  const { 
    data: aiConfig,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['aiConfig'],
    queryFn: async () => {
      console.log("Buscando configurações de IA...");
      try {
        const config = await getAIConfig();
        console.log("Configurações de IA carregadas:", config);
        return config;
      } catch (err) {
        console.error("Erro ao carregar configurações de IA:", err);
        toast.error("Erro ao carregar configurações de IA");
        throw err;
      }
    }
  });
  
  console.log("Estado atual do hook useAISettings:", { 
    temConfiguracao: !!aiConfig, 
    isLoading, 
    temErro: !!error 
  });
  
  // Update AI settings with useCallback to prevent function recreation
  const handleSaveConfig = useCallback((config: AIConfig) => {
    console.log("Salvando configuração:", config);
    updateConfigMutation.mutate(config);
  }, []);
  
  // Update AI settings
  const updateConfigMutation = useMutation({
    mutationFn: updateAIConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiConfig'] });
      setIsEditDialogOpen(false);
      toast.success("Configurações de IA atualizadas com sucesso");
    },
    onError: (error: any) => {
      console.error("Erro na atualização:", error);
      toast.error(`Erro ao atualizar configurações: ${error?.message || 'Erro desconhecido'}`);
    }
  });
  
  return {
    aiConfig,
    isLoading,
    error,
    refetch,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleSaveConfig,
    isUpdating: updateConfigMutation.isPending
  };
};
