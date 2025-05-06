
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClassManagement from "@/components/admin/ClassManagement";
import CourseManagement from "@/components/admin/CourseManagement";
import BlogManagement from "@/components/admin/BlogManagement";
import UserManagement from "@/components/admin/UserManagement";
import PaymentGateway from "@/components/admin/PaymentGateway";
import Dashboard from "@/components/admin/Dashboard";
import { Layers, BookOpen, FileText, AlertTriangle, LayoutDashboard, Users, CreditCard } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Admin = () => {
  const [authenticated] = useState(true); // In a real app, this would check authentication
  const [userRole] = useState('admin'); // In a real app, this would come from auth state

  if (!authenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Acesso Restrito</AlertTitle>
            <AlertDescription>
              Você precisa estar autenticado como administrador para acessar esta página.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="heading-lg mb-6">Painel de Administração</h1>
        
        <Tabs defaultValue="dashboard">
          <TabsList className="grid grid-cols-6 mb-8">
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
            </CardHeader>
            
            <CardContent>
              <TabsContent value="dashboard" className="mt-0">
                <Dashboard />
              </TabsContent>
              <TabsContent value="classes" className="mt-0">
                <ClassManagement />
              </TabsContent>
              <TabsContent value="courses" className="mt-0">
                <CourseManagement />
              </TabsContent>
              <TabsContent value="blog" className="mt-0">
                <BlogManagement />
              </TabsContent>
              <TabsContent value="users" className="mt-0">
                <UserManagement />
              </TabsContent>
              <TabsContent value="payments" className="mt-0">
                <PaymentGateway />
              </TabsContent>
            </CardContent>
          </Card>
          
          {userRole === 'admin' && (
            <div className="mt-6 flex justify-end">
              <Sheet>
                <SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  Configurações de Permissões
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Configurações de Permissões</SheetTitle>
                    <SheetDescription>
                      Configure os níveis de acesso para diferentes funções de usuário.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">Administrador</h3>
                        <div className="grid grid-cols-5 gap-4 text-sm font-medium mb-3">
                          <div>Módulo</div>
                          <div className="text-center">Visualizar</div>
                          <div className="text-center">Criar</div>
                          <div className="text-center">Alterar</div>
                          <div className="text-center">Excluir</div>
                        </div>
                        {['Turmas', 'Cursos', 'Blog', 'Usuários', 'Pagamentos'].map((module) => (
                          <div key={module} className="grid grid-cols-5 gap-4 text-sm py-2 border-t">
                            <div>{module}</div>
                            <div className="text-center">✓</div>
                            <div className="text-center">✓</div>
                            <div className="text-center">✓</div>
                            <div className="text-center">✓</div>
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-3">Editor</h3>
                        <div className="grid grid-cols-5 gap-4 text-sm font-medium mb-3">
                          <div>Módulo</div>
                          <div className="text-center">Visualizar</div>
                          <div className="text-center">Criar</div>
                          <div className="text-center">Alterar</div>
                          <div className="text-center">Excluir</div>
                        </div>
                        {['Turmas', 'Cursos', 'Blog', 'Usuários', 'Pagamentos'].map((module) => (
                          <div key={module} className="grid grid-cols-5 gap-4 text-sm py-2 border-t">
                            <div>{module}</div>
                            <div className="text-center">✓</div>
                            <div className="text-center">✓</div>
                            <div className="text-center">✓</div>
                            <div className="text-center">{module !== 'Usuários' && module !== 'Pagamentos' ? '✓' : '✗'}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-3">Visualizador</h3>
                        <div className="grid grid-cols-5 gap-4 text-sm font-medium mb-3">
                          <div>Módulo</div>
                          <div className="text-center">Visualizar</div>
                          <div className="text-center">Criar</div>
                          <div className="text-center">Alterar</div>
                          <div className="text-center">Excluir</div>
                        </div>
                        {['Turmas', 'Cursos', 'Blog', 'Usuários', 'Pagamentos'].map((module) => (
                          <div key={module} className="grid grid-cols-5 gap-4 text-sm py-2 border-t">
                            <div>{module}</div>
                            <div className="text-center">✓</div>
                            <div className="text-center">✗</div>
                            <div className="text-center">✗</div>
                            <div className="text-center">✗</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Admin;
