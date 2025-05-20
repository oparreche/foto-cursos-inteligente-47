
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { ContentPrompt, AIResponse, generateContent } from "./aiService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface AIContentGeneratorProps {
  onSelectContent?: (content: string) => void;
}

const AIContentGenerator = ({ onSelectContent }: AIContentGeneratorProps) => {
  const [contentType, setContentType] = useState<'blog' | 'course' | 'seo' | 'dashboard'>('blog');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AIResponse | null>(null);
  
  const form = useForm<ContentPrompt>({
    defaultValues: {
      type: 'blog',
      topic: '',
      keywords: [],
      targetAudience: '',
      tone: 'formal',
      length: 'medium',
      additionalInstructions: '',
    }
  });
  
  const handleContentTypeChange = (value: 'blog' | 'course' | 'seo' | 'dashboard') => {
    setContentType(value);
    form.setValue('type', value);
  };
  
  const handleKeywordsChange = (value: string) => {
    const keywords = value.split(',').map(k => k.trim()).filter(k => k);
    form.setValue('keywords', keywords);
  };
  
  const handleSubmit = async (values: ContentPrompt) => {
    setIsGenerating(true);
    
    try {
      const response = await generateContent(values);
      
      if (response) {
        setGeneratedContent(response);
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Ocorreu um erro ao gerar o conteúdo");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleUseContent = () => {
    if (generatedContent && onSelectContent) {
      onSelectContent(generatedContent.content);
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={contentType} onValueChange={(v) => handleContentTypeChange(v as any)}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="blog">Artigo de Blog</TabsTrigger>
          <TabsTrigger value="course">Descrição de Curso</TabsTrigger>
          <TabsTrigger value="seo">Otimização SEO</TabsTrigger>
          <TabsTrigger value="dashboard">KPIs & Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blog" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Artigo de Blog</CardTitle>
              <CardDescription>Use IA para criar artigos de blog completos ou esboços</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                  <FormField
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tópico</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Técnicas avançadas de edição de vídeo" {...field} />
                        </FormControl>
                        <FormDescription>
                          O tema principal do artigo
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    name="keywords"
                    render={() => (
                      <FormItem>
                        <FormLabel>Palavras-chave</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: vídeo, edição, pós-produção" 
                            onChange={(e) => handleKeywordsChange(e.target.value)} 
                          />
                        </FormControl>
                        <FormDescription>
                          Palavras-chave separadas por vírgulas
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      name="tone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tom</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecionar tom" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="formal">Formal</SelectItem>
                              <SelectItem value="casual">Casual</SelectItem>
                              <SelectItem value="technical">Técnico</SelectItem>
                              <SelectItem value="friendly">Amigável</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      name="length"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comprimento</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecionar comprimento" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="short">Curto</SelectItem>
                              <SelectItem value="medium">Médio</SelectItem>
                              <SelectItem value="long">Longo</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Público-alvo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Estudantes de audiovisual" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    name="additionalInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instruções adicionais</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Ex: Incluir exemplos práticos e referências a softwares atuais" 
                            className="min-h-[80px]" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Gerando..." : "Gerar Conteúdo"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="course" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Descrição de Curso</CardTitle>
              <CardDescription>Use IA para criar descrições atraentes para seus cursos</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                  <FormField
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Curso</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Design de Interface para Web" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Público-alvo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Designers iniciantes e desenvolvedores front-end" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    name="additionalInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detalhes do curso</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Ex: O curso deve cobrir princípios básicos de UI/UX e incluir projetos práticos" 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Gerando..." : "Gerar Descrição"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seo" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Otimização SEO</CardTitle>
              <CardDescription>Gere meta descrições, tags e recomendações SEO para seu conteúdo</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                  <FormField
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do conteúdo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Curso de Marketing Digital para Iniciantes" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    name="keywords"
                    render={() => (
                      <FormItem>
                        <FormLabel>Palavras-chave alvo</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: marketing digital, SEO, redes sociais" 
                            onChange={(e) => handleKeywordsChange(e.target.value)} 
                          />
                        </FormControl>
                        <FormDescription>
                          Palavras-chave separadas por vírgulas
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    name="additionalInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição do conteúdo</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Cole aqui o conteúdo ou um resumo que você quer otimizar" 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Analisando..." : "Gerar Otimização SEO"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dashboard" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>KPIs e Insights</CardTitle>
              <CardDescription>Gere análises e insights para seus dashboards</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                  <FormField
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área de análise</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Desempenho de vendas de cursos" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    name="additionalInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dados para análise</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Ex: Coloque aqui os dados que deseja analisar, ou especifique que tipo de KPIs e insights você precisa" 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Analisando..." : "Gerar Análise"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Conteúdo Gerado</CardTitle>
            <CardDescription>
              {generatedContent.metadata?.processingTime && 
                `Gerado em ${(generatedContent.metadata.processingTime / 1000).toFixed(1)} segundos`}
                
              {generatedContent.metadata?.tokens && 
                ` • ${generatedContent.metadata.tokens} tokens utilizados`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={generatedContent.content} 
              className="min-h-[300px] font-mono text-sm"
              readOnly
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setGeneratedContent(null)}
            >
              Limpar
            </Button>
            {onSelectContent && (
              <Button onClick={handleUseContent}>
                Usar Este Conteúdo
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AIContentGenerator;
