
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAISettings } from "@/hooks/useAISettings";
import { AIConfig, AIModel } from "./aiService";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const AISettings = () => {
  const { 
    aiConfig, 
    isLoading, 
    error, 
    isEditDialogOpen, 
    setIsEditDialogOpen,
    handleSaveConfig,
    isUpdating
  } = useAISettings();
  
  const [editConfig, setEditConfig] = useState<AIConfig>({
    provider: null,
    model: null,
    apiKey: null
  });
  
  const handleOpenEditDialog = () => {
    if (aiConfig) {
      setEditConfig({
        provider: aiConfig.provider,
        model: aiConfig.model,
        apiKey: aiConfig.apiKey,
      });
    } else {
      setEditConfig({
        provider: null,
        model: null,
        apiKey: null
      });
    }
    setIsEditDialogOpen(true);
  };
  
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
    handleSaveConfig(editConfig);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar configurações de IA</AlertTitle>
        <AlertDescription>Ocorreu um erro ao carregar as configurações. Por favor, tente novamente mais tarde.</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de IA</CardTitle>
        <CardDescription>Configure o serviço de inteligência artificial para geração de conteúdo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Provedor</Label>
              <div className="mt-1 font-medium">
                {aiConfig?.provider === 'openai' ? 'OpenAI' : 
                 aiConfig?.provider === 'perplexity' ? 'Perplexity AI' : 
                 'Não configurado'}
              </div>
            </div>
            
            <div>
              <Label>Modelo</Label>
              <div className="mt-1 font-medium">
                {aiConfig?.model || 'Não configurado'}
              </div>
            </div>
            
            <div>
              <Label>Chave API</Label>
              <div className="mt-1 font-medium">
                {aiConfig?.apiKey ? '••••••••••••••••' : 'Não configurada'}
              </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {aiConfig?.lastUpdated && `Última atualização: ${new Date(aiConfig.lastUpdated).toLocaleString('pt-BR')}`}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleOpenEditDialog}>Editar Configurações</Button>
      </CardFooter>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                  <Radio value="openai" id="openai" />
                  <Label htmlFor="openai">OpenAI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Radio value="perplexity" id="perplexity" />
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
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
    </Card>
  );
};

export default AISettings;
