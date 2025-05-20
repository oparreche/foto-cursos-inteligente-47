
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
  // Debug logs for troubleshooting (only in diagnostic mode)
  useEffect(() => {
    if (showDiagnostics) {
      console.log("AdminTabs component mounted");
      console.log("AdminTabs props received:", { userRole, showDiagnostics });
      
      // Check if DOM is rendering correctly
      setTimeout(() => {
        const tabElements = document.querySelectorAll('[role="tablist"] [role="tab"]');
        console.log("Tab elements found:", tabElements.length);
        
        const tabContentElements = document.querySelectorAll('[data-state="inactive"], [data-state="active"]');
        console.log("Tab content elements found:", tabContentElements.length);
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
