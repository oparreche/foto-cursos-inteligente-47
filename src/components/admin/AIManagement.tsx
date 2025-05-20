
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AISettings from "./ai/AISettings";
import AIContentGenerator from "./ai/AIContentGenerator";
import { useUserAuth } from "./users/useUserAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AIManagement = () => {
  const { isAuthenticated, currentUserRole } = useUserAuth();
  const [activeTab, setActiveTab] = useState("settings");
  const isAuthorized = isAuthenticated && (currentUserRole === "admin" || currentUserRole === "super_admin");
  const isSuperAdmin = currentUserRole === "super_admin";
  
  return (
    <div>
      {!isAuthenticated && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Autenticação necessária</AlertTitle>
          <AlertDescription>
            Você precisa estar logado para gerenciar ferramentas de IA.
          </AlertDescription>
        </Alert>
      )}
      
      {isAuthenticated && !isAuthorized && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Permissão negada</AlertTitle>
          <AlertDescription>
            Apenas administradores podem acessar as ferramentas de IA.
          </AlertDescription>
        </Alert>
      )}
      
      {isAuthorized && (
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="content">Geração de Conteúdo</TabsTrigger>
            <TabsTrigger value="analytics">Análise de Dados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings">
            {!isSuperAdmin ? (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Acesso limitado</AlertTitle>
                <AlertDescription>
                  Apenas Super Administradores podem modificar as configurações de IA.
                  Você pode visualizar as configurações atuais, mas não pode alterá-las.
                </AlertDescription>
              </Alert>
            ) : null}
            
            <AISettings />
          </TabsContent>
          
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Geração de Conteúdo com IA</CardTitle>
                <CardDescription>
                  Use inteligência artificial para criar conteúdo para blog, descrições de cursos, 
                  e otimização SEO
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIContentGenerator />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Dados com IA</CardTitle>
                <CardDescription>
                  Use inteligência artificial para analisar dados, gerar relatórios e insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIContentGenerator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AIManagement;
