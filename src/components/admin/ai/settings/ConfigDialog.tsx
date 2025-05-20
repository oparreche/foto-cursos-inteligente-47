
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { AIConfig, AIModel } from "@/components/admin/ai/types";
import { toast } from "sonner";

interface ConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  aiConfig: AIConfig | null;
  onSave: (config: AIConfig) => void;
  isUpdating: boolean;
  saveError?: string | null;
}

const ConfigDialog = ({ isOpen, onOpenChange, aiConfig, onSave, isUpdating, saveError }: ConfigDialogProps) => {
  const [editConfig, setEditConfig] = useState<AIConfig>({
    provider: null,
    model: null,
    apiKey: null
  });
  
  const [validationError, setValidationError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isOpen && aiConfig) {
      console.log("Configurações atuais carregadas no diálogo:", {
        provider: aiConfig.provider,
        model: aiConfig.model,
        apiKeyPresent: !!aiConfig.apiKey
      });
      
      setEditConfig({
        provider: aiConfig.provider,
        model: aiConfig.model,
        apiKey: aiConfig.apiKey,
      });
      setValidationError(null); // Reset validation error when dialog opens
    } else if (isOpen) {
      setEditConfig({
        provider: null,
        model: null,
        apiKey: null
      });
      setValidationError(null);
    }
  }, [isOpen, aiConfig]);
  
  // Não feche o modal durante atualização
  useEffect(() => {
    const handleBeforeClose = (open: boolean) => {
      if (!open && isUpdating) {
        console.log("Tentativa de fechar durante atualização bloqueada");
        return false;
      }
      return true;
    };
    
    // Este é um uso simulado de um event handler para prevenção
    // Na prática, o componente Dialog do shadcn/ui não tem esta funcionalidade diretamente
    if (isUpdating) {
      console.log("Em atualização, bloqueando fechamento do modal");
    }
    
    return () => {
      // Cleanup logic if needed
    };
  }, [isUpdating]);
  
  const handleProviderChange = (provider: 'openai' | 'perplexity') => {
    // Reset model when changing provider since they have different models
    setEditConfig({
      ...editConfig,
      provider,
      model: null
    });
    setValidationError(null);
  };
  
  const handleModelChange = (model: AIModel) => {
    setEditConfig({
      ...editConfig,
      model
    });
    setValidationError(null);
  };
  
  const handleApiKeyChange = (apiKey: string) => {
    setEditConfig({
      ...editConfig,
      apiKey
    });
    setValidationError(null);
  };
  
  const validateConfig = (): boolean => {
    if (!editConfig.provider) {
      setValidationError("Selecione um provedor de IA");
      return false;
    }
    
    if (!editConfig.model) {
      setValidationError("Selecione um modelo de IA");
      return false;
    }
    
    if (!editConfig.apiKey || editConfig.apiKey.trim().length < 10) {
      setValidationError("Insira uma chave API válida");
      return false;
    }
    
    setValidationError(null);
    return true;
  };
  
  const handleSubmit = () => {
    console.log("Enviando configuração para salvar:", {
      provider: editConfig.provider,
      model: editConfig.model,
      apiKeyLength: editConfig.apiKey ? editConfig.apiKey.length : 0
    });
    
    if (!validateConfig()) {
      toast.error("Dados inválidos. Verifique todos os campos.");
      return;
    }
    
    try {
      onSave(editConfig);
    } catch (error) {
      console.error("Erro ao enviar configuração:", error);
      toast.error("Falha ao processar o pedido de salvamento");
      setValidationError("Erro ao processar o pedido de salvamento");
    }
  };

  // Prevent closing dialog when updating
  const safeOnOpenChange = (open: boolean) => {
    if (!open && isUpdating) {
      console.log("Prevenindo fechamento do diálogo durante atualização");
      toast.info("Aguarde a conclusão do salvamento...");
      return;
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={safeOnOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurações de IA</DialogTitle>
          <DialogDescription>
            Configure o serviço de IA para geração de conteúdo. Apenas super administradores podem alterar estas configurações.
          </DialogDescription>
        </DialogHeader>
        
        {(saveError || validationError) && (
          <Alert variant="destructive" className="my-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {saveError || validationError}
            </AlertDescription>
          </Alert>
        )}
        
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
              className="font-mono"
              disabled={isUpdating}
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
        
        <DialogFooter className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => safeOnOpenChange(false)} 
            disabled={isUpdating}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!editConfig.provider || !editConfig.model || !editConfig.apiKey || isUpdating}
            className="relative"
          >
            {isUpdating ? 'Salvando...' : 'Salvar'}
            {isUpdating && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigDialog;
