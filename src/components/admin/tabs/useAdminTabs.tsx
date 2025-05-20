
import { useState, useEffect, useCallback } from "react";

export const useAdminTabs = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    try {
      console.log("useAdminTabs hook initializing");
      setIsClient(true);
      
      // Define allowed tabs explicitly including finance
      const allowedTabs = [
        "dashboard", 
        "users", 
        "courses", 
        "classes", 
        "blog", 
        "ai", 
        "finance",
        "payments"
      ];
      
      // Get hash from URL or use default
      const hashValue = window.location.hash.substring(1);
      console.log("Current hash value:", hashValue || "(none)");
      
      if (hashValue && allowedTabs.includes(hashValue)) {
        console.log(`Setting active tab to ${hashValue} from hash`);
        setActiveTab(hashValue);
        
        // Force tab content visibility check
        setTimeout(() => {
          const activeTabContent = document.querySelector(`[data-value="${hashValue}"]`);
          console.log(`Tab content for ${hashValue} found:`, !!activeTabContent);
          
          if (!activeTabContent) {
            console.log(`Forcing hash update for tab: ${hashValue}`);
            window.location.hash = hashValue;
          }
        }, 300);
      } else {
        console.log("Using dashboard as default tab");
        setActiveTab("dashboard");
        if (!hashValue) {
          window.location.hash = "dashboard";
        }
      }
      
      // Add hash change listener
      const handleHashChange = () => {
        const newHash = window.location.hash.substring(1);
        if (newHash && allowedTabs.includes(newHash)) {
          console.log(`Hash changed to: ${newHash}`);
          setActiveTab(newHash);
        }
      };
      
      window.addEventListener('hashchange', handleHashChange);
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
      };
    } catch (error) {
      console.error("Error in useAdminTabs hook:", error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
    }
  }, []);

  // Handle tab change with useCallback
  const handleTabChange = useCallback((value: string) => {
    console.log(`Tab changed to: ${value}`);
    setActiveTab(value);
    
    // Update URL hash
    if (window.location.hash.substring(1) !== value) {
      window.location.hash = value;
    }
  }, []);

  return {
    activeTab,
    hasError,
    errorMessage,
    isClient,
    handleTabChange
  };
};
