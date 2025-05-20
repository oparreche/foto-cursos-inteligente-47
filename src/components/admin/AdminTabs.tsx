
import React, { useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useAdminTabs } from "./tabs/useAdminTabs";
import { TabTriggers } from "./tabs/TabTriggers";
import TabHeaders from "./tabs/TabHeaders";
import { TabContents } from "./tabs/TabContents";
import ErrorAlert from "./tabs/ErrorAlert";

interface AdminTabsProps {
  userRole?: string;
  showDiagnostics?: boolean;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ userRole = "", showDiagnostics = false }) => {
  // Log outside of JSX for better debugging
  useEffect(() => {
    console.log("AdminTabs componente montado");
    console.log("AdminTabs props:", { userRole, showDiagnostics });
    // Debug log to check if the component is rendering
    const tabsElement = document.querySelector('[role="tablist"]');
    console.log("Tabs element presente no DOM:", !!tabsElement);
    
    // Check active tab from hash
    const hash = window.location.hash.substring(1);
    console.log("Hash atual para tabs:", hash || "nenhum");
    
    // Force a check for the courses tab if that's the current hash
    if (hash === "courses") {
      setTimeout(() => {
        const coursesContent = document.querySelector('[data-value="courses"]');
        console.log("Courses content element encontrado:", !!coursesContent);
        
        const courseTabTrigger = document.querySelector('[data-state="active"]');
        console.log("Tab trigger ativo:", courseTabTrigger?.getAttribute('value'));
      }, 500);
    }
  }, [userRole, showDiagnostics]);
  
  const {
    activeTab,
    hasError,
    errorMessage,
    isClient,
    handleTabChange
  } = useAdminTabs();

  if (!isClient) {
    return <div className="p-4 text-center">Carregando interface de administração...</div>;
  }

  // Debug rendering
  console.log("AdminTabs renderizando com tab ativa:", activeTab);

  return (
    <>
      {hasError && <ErrorAlert message={errorMessage} />}
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        defaultValue={activeTab}
        className="w-full"
      >
        <TabTriggers userRole={userRole} />
        
        <Card>
          <TabHeaders />
          <TabContents userRole={userRole} showDiagnostics={showDiagnostics} />
        </Card>
      </Tabs>
    </>
  );
};

export default AdminTabs;
