
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClassManagement from "@/components/admin/ClassManagement";
import CourseManagement from "@/components/admin/CourseManagement";
import BlogManagement from "@/components/admin/BlogManagement";
import { Layers, BookOpen, FileText, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Admin = () => {
  const [authenticated] = useState(true); // In a real app, this would check authentication

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
        
        <Tabs defaultValue="classes">
          <TabsList className="grid grid-cols-3 mb-8">
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
          </TabsList>
          
          <Card>
            <CardHeader>
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
            </CardHeader>
            
            <CardContent>
              <TabsContent value="classes" className="mt-0">
                <ClassManagement />
              </TabsContent>
              <TabsContent value="courses" className="mt-0">
                <CourseManagement />
              </TabsContent>
              <TabsContent value="blog" className="mt-0">
                <BlogManagement />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Admin;
