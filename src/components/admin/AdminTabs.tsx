
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
    // Debug log to check if the component is rendering
    const tabsElement = document.querySelector('[role="tablist"]');
    console.log("Tabs element presente no DOM:", !!tabsElement);
    
    // Check active tab from hash
    const hash = window.location.hash.substring(1);
    console.log("Hash atual para tabs:", hash || "nenhum");
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

  // Debug rendering
  console.log("AdminTabs renderizando com tab ativa:", activeTab);

  return (
    <>
      {hasError && <ErrorAlert message={errorMessage} />}
      
      <div className="debug-info mb-4 p-2 bg-yellow-100 rounded">
        <p>Tab ativa: {activeTab}</p>
        <p>Cliente inicializado: {isClient ? "Sim" : "Não"}</p>
      </div>
    
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
