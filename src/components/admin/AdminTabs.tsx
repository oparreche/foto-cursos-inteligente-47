import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClassManagement from "@/components/admin/ClassManagement";
import CourseManagement from "@/components/admin/CourseManagement";
import BlogManagement from "@/components/admin/BlogManagement";
import UserManagement from "@/components/admin/UserManagement";
import PaymentGateway from "@/components/admin/PaymentGateway";
import Dashboard from "@/components/admin/Dashboard";
import AIManagement from "@/components/admin/AIManagement";
import { Layers, BookOpen, FileText, LayoutDashboard, Users, CreditCard, BrainCircuit } from "lucide-react";

const AdminTabs = () => {
  return (
    <Tabs defaultValue="dashboard">
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
        <TabsTrigger value="ai" className="flex items-center gap-2">
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
          <TabsContent value="ai" className="mt-0">
            <AIManagement />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};

export default AdminTabs;
