
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import AIContentGenerator from "@/components/admin/ai/AIContentGenerator";
import AISettings from "@/components/admin/ai/AISettings";
import { useAISettings } from "@/hooks/useAISettings";

const AIManagement = () => {
  const { 
    aiConfig, 
    isLoading, 
    error, 
    isEditDialogOpen, 
    setIsEditDialogOpen, 
    handleSaveConfig,
    isUpdating
  } = useAISettings();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Configurações de IA</h2>
        <Card>
          <CardContent className="pt-6">
            {/* AISettings now manages its own state via useAISettings hook directly */}
            <AISettings />
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Gerador de Conteúdo</h2>
        <Card>
          <CardContent className="pt-6">
            <AIContentGenerator />
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AIManagement;
