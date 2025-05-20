
import React, { useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { CardContent } from "@/components/ui/card";
import TabContentWrapper from "./TabContentWrapper";

// Import components
import Dashboard from "@/components/admin/Dashboard";
import ClassManagement from "@/components/admin/ClassManagement";
import CourseManagement from "@/components/admin/CourseManagement";
import BlogManagement from "@/components/admin/BlogManagement";
import UserManagement from "@/components/admin/UserManagement";
import PaymentGateway from "@/components/admin/PaymentGateway";
import AIManagement from "@/components/admin/AIManagement";

const TabContents: React.FC = () => {
  useEffect(() => {
    console.log("TabContents componente montado");
    
    // Check if tab content elements are in the DOM
    setTimeout(() => {
      const activeTabContent = document.querySelector('[data-state="active"]');
      console.log("Tab ativa presente:", !!activeTabContent);
      
      if (activeTabContent) {
        console.log("Tab ativa:", activeTabContent.getAttribute('value'));
      }
      
      // Add explicit checks for each tab
      ['dashboard', 'classes', 'courses', 'blog', 'users', 'payments', 'ai'].forEach(tab => {
        const tabContent = document.querySelector(`[data-value="${tab}"]`);
        console.log(`${tab} TabContent presente:`, !!tabContent);
      });
    }, 500);
  }, []);

  return (
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
  );
};

export default TabContents;
