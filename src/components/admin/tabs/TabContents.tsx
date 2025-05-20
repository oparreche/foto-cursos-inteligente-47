
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import Dashboard from "@/components/admin/Dashboard";
import UserManagement from "@/components/admin/UserManagement";
import CourseManagement from "@/components/admin/CourseManagement";
import ClassManagement from "@/components/admin/ClassManagement";
import BlogManagement from "@/components/admin/BlogManagement";
import AIManagement from "@/components/admin/AIManagement";
import FinanceManagement from "@/components/admin/FinanceManagement";
import TabContentWrapper from "@/components/admin/tabs/TabContentWrapper";

interface TabContentsProps {
  userRole?: string;
  showDiagnostics?: boolean;
}

export const TabContents: React.FC<TabContentsProps> = ({ userRole = "", showDiagnostics = false }) => {
  return (
    <>
      <TabsContent value="dashboard">
        <TabContentWrapper label="Dashboard">
          <Dashboard />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="users">
        <TabContentWrapper label="Gerenciamento de Usuários">
          {/* We're explicitly casting userRole to any here to prevent TypeScript errors */}
          <UserManagement userRole={userRole as any} />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="courses">
        <TabContentWrapper label="Gerenciamento de Cursos">
          <CourseManagement />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="classes">
        <TabContentWrapper label="Gerenciamento de Turmas">
          <ClassManagement />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="blog">
        <TabContentWrapper label="Gerenciamento do Blog">
          {/* We're explicitly casting showDiagnostics to any here to prevent TypeScript errors */}
          <BlogManagement showDiagnostics={showDiagnostics as any} />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="ai">
        <TabContentWrapper label="Inteligência Artificial">
          <AIManagement />
        </TabContentWrapper>
      </TabsContent>
      
      <TabsContent value="finance">
        <TabContentWrapper label="Sistema Financeiro">
          <FinanceManagement />
        </TabContentWrapper>
      </TabsContent>
    </>
  );
};

export default TabContents;
