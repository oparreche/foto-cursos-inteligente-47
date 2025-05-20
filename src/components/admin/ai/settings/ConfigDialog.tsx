
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AIConfig, AIModel } from "@/components/admin/ai/types";
import { toast } from "sonner";

interface ConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  aiConfig: AIConfig | null;
  onSave: (config: AIConfig) => void;
  isUpdating: boolean;
}

const ConfigDialog = ({ isOpen, onOpenChange, aiConfig, onSave, isUpdating }: ConfigDialogProps) => {
  const [editConfig, setEditConfig] = useState<AIConfig>({
    provider: null,
    model: null,
    apiKey: null
  });
  
  useEffect(() => {
    if (isOpen && aiConfig) {
      setEditConfig({
        provider: aiConfig.provider,
        model: aiConfig.model,
        apiKey: aiConfig.apiKey,
      });
    } else if (isOpen) {
      setEditConfig({
        provider: null,
        model: null,
        apiKey: null
      });
    }
  }, [isOpen, aiConfig]);
  
  const handleProviderChange = (provider: 'openai' | 'perplexity') => {
    // Reset model when changing provider since they have different models
    setEditConfig({
      ...editConfig,
      provider,
      model: null
    });
  };
  
  const handleModelChange = (model: AIModel) => {
    setEditConfig({
      ...editConfig,
      model
    });
  };
  
  const handleApiKeyChange = (apiKey: string) => {
    setEditConfig({
      ...editConfig,
      apiKey
    });
  };
  
  const handleSubmit = () => {
    console.log("Enviando configuração para salvar:", editConfig);
    
    if (!editConfig.provider || !editConfig.model || !editConfig.apiKey) {
      toast.error("Preencha todos os campos para salvar");
      return;
    }
    
    try {
      onSave(editConfig);
    } catch (error) {
      console.error("Erro ao enviar configuração:", error);
      toast.error("Falha ao processar o pedido de salvamento");
    }
  };

  // Resto do código permanece igual
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurações de IA</DialogTitle>
          <DialogDescription>
            Configure o serviço de IA para geração de conteúdo. Apenas super administradores podem alterar estas configurações.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Provedor de IA</Label>
            <RadioGroup 
              value={editConfig.provider || ''}
              onValueChange={(value) => handleProviderChange(value as 'openai' | 'perplexity')}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="openai" id="openai" />
                <Label htmlFor="openai">OpenAI</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="perplexity" id="perplexity" />
                <Label htmlFor="perplexity">Perplexity AI</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Modelo</Label>
            <Select 
              value={editConfig.model || ''}
              onValueChange={(value) => handleModelChange(value as AIModel)}
              disabled={!editConfig.provider}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um modelo" />
              </SelectTrigger>
              <SelectContent>
                {editConfig.provider === 'openai' ? (
                  <>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  </>
                ) : editConfig.provider === 'perplexity' ? (
                  <>
                    <SelectItem value="llama-3.1-sonar-small-128k-online">Llama 3.1 Sonar Small</SelectItem>
                    <SelectItem value="llama-3.1-sonar-large-128k-online">Llama 3.1 Sonar Large</SelectItem>
                  </>
                ) : null}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Chave API</Label>
            <Input
              value={editConfig.apiKey || ''}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="Insira sua chave API"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              {editConfig.provider === 'openai' ? 
                'Obtenha sua chave API em https://platform.openai.com/api-keys' : 
               editConfig.provider === 'perplexity' ? 
                'Obtenha sua chave API em https://www.perplexity.ai/settings/api' : 
                'Selecione um provedor para obter instruções'}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!editConfig.provider || !editConfig.model || !editConfig.apiKey || isUpdating}
          >
            {isUpdating ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigDialog;
