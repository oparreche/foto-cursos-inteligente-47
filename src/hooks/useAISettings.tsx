
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AIConfig, getAIConfig, updateAIConfig } from "@/components/admin/ai";
import { toast } from "sonner";

export const useAISettings = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch AI settings
  const { 
    data: aiConfig,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['aiConfig'],
    queryFn: async () => {
      try {
        const config = await getAIConfig();
        console.log("AI Config loaded:", config);
        return config;
      } catch (err) {
        console.error("Error loading AI config:", err);
        toast.error("Erro ao carregar configurações de IA");
        throw err;
      }
    }
  });
  
  // Update AI settings
  const updateConfigMutation = useMutation({
    mutationFn: updateAIConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiConfig'] });
      setIsEditDialogOpen(false);
      toast.success("Configurações de IA atualizadas com sucesso");
    },
    onError: (error: any) => {
      console.error("Update error:", error);
      toast.error(`Erro ao atualizar configurações: ${error?.message || 'Erro desconhecido'}`);
    }
  });
  
  const handleSaveConfig = (config: AIConfig) => {
    console.log("Saving config:", config);
    updateConfigMutation.mutate(config);
  };
  
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
