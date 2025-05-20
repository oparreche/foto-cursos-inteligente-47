
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import Dashboard from "@/components/admin/Dashboard";
import UserManagement from "@/components/admin/UserManagement";
import CourseManagement from "@/components/admin/CourseManagement";
import ClassManagement from "@/components/admin/ClassManagement";
import BlogManagement from "@/components/admin/BlogManagement";
import AIManagement from "@/components/admin/AIManagement";
import FinanceManagement from "@/components/admin/FinanceManagement";
import { TabContentWrapper } from "@/components/admin/tabs/TabContentWrapper";

interface TabContentsProps {
  userRole: string;
  showDiagnostics: boolean;
}

export const TabContents = ({ userRole, showDiagnostics }: TabContentsProps) => {
  return (
    <>
      <TabsContent value="dashboard">
        <TabContentWrapper title="Dashboard">
          <Dashboard />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="users">
        <TabContentWrapper title="Gerenciamento de Usuários">
          <UserManagement userRole={userRole} />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="courses">
        <TabContentWrapper title="Gerenciamento de Cursos">
          <CourseManagement />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="classes">
        <TabContentWrapper title="Gerenciamento de Turmas">
          <ClassManagement />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="blog">
        <TabContentWrapper title="Gerenciamento do Blog">
          <BlogManagement showDiagnostics={showDiagnostics} />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="ai">
        <TabContentWrapper title="Inteligência Artificial">
          <AIManagement />
        </TabContentWrapper>
      </TabsContent>
      
      <TabsContent value="finance">
        <TabContentWrapper title="Sistema Financeiro">
          <FinanceManagement />
        </TabContentWrapper>
      </TabsContent>
    </>
  );
};
