
import React, { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClassManagement from "@/components/admin/ClassManagement";
import CourseManagement from "@/components/admin/CourseManagement";
import BlogManagement from "@/components/admin/BlogManagement";
import UserManagement from "@/components/admin/UserManagement";
import PaymentGateway from "@/components/admin/PaymentGateway";
import Dashboard from "@/components/admin/Dashboard";
// Importação direta do componente AIManagement
import AIManagement from "@/components/admin/AIManagement";
import { Layers, BookOpen, FileText, LayoutDashboard, Users, CreditCard, BrainCircuit } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const TabContentWrapper = ({ children, label }: { children: React.ReactNode, label: string }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  useEffect(() => {
    console.log(`TabContent (${label}) montado`);
  }, [label]);
  
  if (hasError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar conteúdo da aba {label}: {errorMessage}
        </AlertDescription>
      </Alert>
    );
  }
  
  try {
    return <>{children}</>;
  } catch (error) {
    console.error(`Erro ao renderizar conteúdo da aba ${label}:`, error);
    setHasError(true);
    setErrorMessage(error instanceof Error ? error.message : String(error));
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao renderizar aba {label}
        </AlertDescription>
      </Alert>
    );
  }
};

const AdminTabs = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  
  // Log outside of JSX
  console.log("AdminTabs renderizando");
  
  useEffect(() => {
    try {
      console.log("AdminTabs useEffect executando");
      setIsClient(true);
      
      // Verificar se hash está definido para a aba AI
      if (window.location.hash === "#ai") {
        console.log("AI tab selecionada por hash");
        setActiveTab("ai");
      }
      
      // Registrar rota atual para depuração
      console.log("Rota atual:", window.location.pathname);
      console.log("Hash atual:", window.location.hash);
      
      // Verificar se AIManagement está disponível
      console.log("AIManagement está disponível para importação:", typeof AIManagement !== 'undefined');
    } catch (error) {
      console.error("Erro no AdminTabs useEffect:", error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido");
    }
  }, []);

  // Use useCallback para prevenir re-renderizações desnecessárias
  const handleTabChange = useCallback((value: string) => {
    console.log("Tab alterada para:", value);
    setActiveTab(value);
  }, []);

  if (!isClient) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      {hasError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar abas: {errorMessage}
          </AlertDescription>
        </Alert>
      )}
    
      <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue="dashboard">
        <TabsList className="grid grid-cols-7 mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span>Turmas</span>
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Cursos</span>
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Blog</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Pagamentos</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2" data-value="ai">
            <BrainCircuit className="h-4 w-4" />
            <span>IA</span>
          </TabsTrigger>
        </TabsList>
        
        <Card>
          <CardHeader>
            <TabsContent value="dashboard">
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>Visão geral e estatísticas do sistema.</CardDescription>
            </TabsContent>
            <TabsContent value="classes">
              <CardTitle>Gerenciamento de Turmas</CardTitle>
              <CardDescription>Crie, edite e gerencie as turmas disponíveis.</CardDescription>
            </TabsContent>
            <TabsContent value="courses">
              <CardTitle>Gerenciamento de Cursos</CardTitle>
              <CardDescription>Gerencie os cursos oferecidos pela escola.</CardDescription>
            </TabsContent>
            <TabsContent value="blog">
              <CardTitle>Gerenciamento do Blog</CardTitle>
              <CardDescription>Crie e edite artigos do blog.</CardDescription>
            </TabsContent>
            <TabsContent value="users">
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>Controle de acesso e permissões dos usuários.</CardDescription>
            </TabsContent>
            <TabsContent value="payments">
              <CardTitle>Gateway de Pagamento</CardTitle>
              <CardDescription>Configure e monitore as transações de pagamento.</CardDescription>
            </TabsContent>
            <TabsContent value="ai">
              <CardTitle>Inteligência Artificial</CardTitle>
              <CardDescription>Geração de conteúdo e análises usando IA.</CardDescription>
            </TabsContent>
          </CardHeader>
          
          <CardContent>
            <TabsContent value="dashboard" className="mt-0">
              <TabContentWrapper label="Dashboard">
                <Dashboard />
              </TabContentWrapper>
            </TabsContent>
            <TabsContent value="classes" className="mt-0">
              <TabContentWrapper label="Classes">
                <ClassManagement />
              </TabContentWrapper>
            </TabsContent>
            <TabsContent value="courses" className="mt-0">
              <TabContentWrapper label="Courses">
                <CourseManagement />
              </TabContentWrapper>
            </TabsContent>
            <TabsContent value="blog" className="mt-0">
              <TabContentWrapper label="Blog">
                <BlogManagement />
              </TabContentWrapper>
            </TabsContent>
            <TabsContent value="users" className="mt-0">
              <TabContentWrapper label="Users">
                <UserManagement />
              </TabContentWrapper>
            </TabsContent>
            <TabsContent value="payments" className="mt-0">
              <TabContentWrapper label="Payments">
                <PaymentGateway />
              </TabContentWrapper>
            </TabsContent>
            <TabsContent value="ai" className="mt-0">
              <TabContentWrapper label="AI">
                <AIManagement />
              </TabContentWrapper>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </>
  );
};

export default AdminTabs;
