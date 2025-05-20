
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AIConfig, getAIConfig, updateAIConfig } from "@/components/admin/ai/aiService";
import { toast } from "sonner";

export const useAISettings = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch AI settings
  const { 
    data: aiConfig,
    isLoading,
    error
  } = useQuery({
    queryKey: ['aiConfig'],
    queryFn: getAIConfig
  });
  
  // Update AI settings
  const updateConfigMutation = useMutation({
    mutationFn: updateAIConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiConfig'] });
      setIsEditDialogOpen(false);
      toast.success("Configurações de IA atualizadas com sucesso");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar configurações: ${error}`);
    }
  });
  
  const handleSaveConfig = (config: AIConfig) => {
    updateConfigMutation.mutate(config);
  };
  
  return {
    aiConfig,
    isLoading,
    error,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleSaveConfig,
    isUpdating: updateConfigMutation.isPending
  };
};
