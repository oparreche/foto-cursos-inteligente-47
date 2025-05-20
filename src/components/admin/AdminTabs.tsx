
import React, { useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useAdminTabs } from "./tabs/useAdminTabs";
import TabTriggers from "./tabs/TabTriggers";
import TabHeaders from "./tabs/TabHeaders";
import TabContents from "./tabs/TabContents";
import ErrorAlert from "./tabs/ErrorAlert";

const AdminTabs = () => {
  // Log outside of JSX for better debugging
  useEffect(() => {
    console.log("AdminTabs componente montado");
  }, []);
  
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
