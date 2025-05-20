
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useAdminTabs } from "./tabs/useAdminTabs";
import TabTriggers from "./tabs/TabTriggers";
import TabHeaders from "./tabs/TabHeaders";
import TabContents from "./tabs/TabContents";
import ErrorAlert from "./tabs/ErrorAlert";

const AdminTabs = () => {
  // Log outside of JSX
  console.log("AdminTabs renderizando");
  
  const {
    activeTab,
    hasError,
    errorMessage,
    isClient,
    handleTabChange
  } = useAdminTabs();

  if (!isClient) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      {hasError && <ErrorAlert message={errorMessage} />}
    
      <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue="dashboard">
        <TabTriggers />
        
        <Card>
          <TabHeaders />
          <TabContents />
        </Card>
      </Tabs>
    </>
  );
};

export default AdminTabs;
