import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { ContentPrompt, AIResponse } from "@/components/admin/ai/types";
import { generateContent } from "@/components/admin/ai/contentService";
import { useQuery } from "@tanstack/react-query";
import { getAIConfig } from "@/components/admin/ai/configService";

interface AIContentGeneratorProps {
  onSelectContent?: (content: string) => void;
}

const AIContentGenerator = ({ onSelectContent }: AIContentGeneratorProps) => {
  const [contentType, setContentType] = useState<'blog' | 'course' | 'seo' | 'dashboard'>('blog');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AIResponse | null>(null);
  const [prompt, setPrompt] = useState<ContentPrompt>({
    type: 'blog',
    topic: '',
    keywords: [],
    targetAudience: '',
    tone: 'casual',
    length: 'medium'
  });

  // Fetch AI configuration to check if it's configured
  const { data: aiConfig } = useQuery({
    queryKey: ['aiConfig'],
    queryFn: getAIConfig
  });

  const aiConfigured = !!aiConfig?.apiKey;

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      const response = await generateContent(prompt);
      setGeneratedContent(response);
      if (response?.content && onSelectContent) {
        onSelectContent(response.content);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (generatedContent?.content) {
      await navigator.clipboard.writeText(generatedContent.content);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerador de Conteúdo com IA</CardTitle>
        <CardDescription>
          Crie conteúdo otimizado para diversas finalidades com o poder da inteligência artificial.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!aiConfigured ? (
          <div className="text-red-500">
            <p>Atenção: As configurações de IA não foram definidas. Por favor, configure as credenciais de IA para usar este recurso.</p>
          </div>
        ) : (
          <Tabs defaultValue="prompt" className="space-y-4">
            <TabsList>
              <TabsTrigger value="prompt">Configurações do Prompt</TabsTrigger>
              <TabsTrigger value="content">Conteúdo Gerado</TabsTrigger>
            </TabsList>
            <TabsContent value="prompt" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contentType">Tipo de Conteúdo</Label>
                  <Select onValueChange={(value) => setContentType(value as 'blog' | 'course' | 'seo' | 'dashboard')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog">Blog Post</SelectItem>
                      <SelectItem value="course">Descrição de Curso</SelectItem>
                      <SelectItem value="seo">SEO Meta Description</SelectItem>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="topic">Tópico</Label>
                  <Input
                    id="topic"
                    placeholder="Insira o tópico"
                    value={prompt.topic || ''}
                    onChange={(e) => setPrompt({ ...prompt, topic: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="keywords">Palavras-chave</Label>
                  <Input
                    id="keywords"
                    placeholder="Palavras-chave separadas por vírgula"
                    value={prompt.keywords?.join(', ') || ''}
                    onChange={(e) =>
                      setPrompt({ ...prompt, keywords: e.target.value.split(',').map((k) => k.trim()) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="targetAudience">Público-alvo</Label>
                  <Input
                    id="targetAudience"
                    placeholder="Defina o público-alvo"
                    value={prompt.targetAudience || ''}
                    onChange={(e) => setPrompt({ ...prompt, targetAudience: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tone">Tom de Voz</Label>
                  <Select onValueChange={(value) => setPrompt({ ...prompt, tone: value as 'formal' | 'casual' | 'technical' | 'friendly' })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tom" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="technical">Técnico</SelectItem>
                      <SelectItem value="friendly">Amigável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="length">Comprimento</Label>
                  <Select onValueChange={(value) => setPrompt({ ...prompt, length: value as 'short' | 'medium' | 'long' })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o comprimento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Curto</SelectItem>
                      <SelectItem value="medium">Médio</SelectItem>
                      <SelectItem value="long">Longo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="additionalInstructions">Instruções Adicionais</Label>
                <Textarea
                  id="additionalInstructions"
                  placeholder="Instruções adicionais para a IA"
                  value={prompt.additionalInstructions || ''}
                  onChange={(e) => setPrompt({ ...prompt, additionalInstructions: e.target.value })}
                />
              </div>
              <Button onClick={handleGenerateContent} disabled={isGenerating}>
                {isGenerating ? 'Gerando...' : 'Gerar Conteúdo'}
              </Button>
            </TabsContent>
            <TabsContent value="content">
              {generatedContent ? (
                <div className="space-y-4">
                  <ScrollArea className="h-[400px] w-full rounded-md border">
                    <Textarea readOnly value={generatedContent.content} className="min-h-[300px]" />
                  </ScrollArea>
                  <div className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={handleCopyToClipboard}>
                      Copiar para a Área de Transferência
                    </Button>
                  </div>
                </div>
              ) : (
                <p>Nenhum conteúdo gerado ainda. Configure o prompt e clique em "Gerar Conteúdo".</p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Dica: Utilize palavras-chave relevantes e um tom de voz adequado para obter melhores resultados.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AIContentGenerator;
