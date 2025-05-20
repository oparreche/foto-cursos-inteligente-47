
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const DiagnosticDisplay = () => {
  const [componentCounts, setComponentCounts] = useState<Record<string, number>>({});
  
  useEffect(() => {
    // Log that this component has mounted
    console.log("DiagnosticDisplay mounted - checking DOM");
    
    // Count important components
    const counts: Record<string, number> = {
      'Tabs': document.querySelectorAll('[role="tablist"]').length,
      'TabsTriggers': document.querySelectorAll('[role="tab"]').length,
      'TabsContents': document.querySelectorAll('[role="tabpanel"]').length,
      'Cards': document.querySelectorAll('[class*="card"]').length,
      'Sections': document.querySelectorAll('section').length,
      'h2Elements': document.querySelectorAll('h2').length
    };
    
    setComponentCounts(counts);
    console.log("Component counts:", counts);
    
    // Check if AdminTabs is present
    const adminTabsPresent = document.querySelectorAll('[role="tablist"]').length > 0;
    console.log("AdminTabs present:", adminTabsPresent);
    
    // Check window location
    console.log("Current route:", window.location.pathname);
    console.log("Current hash:", window.location.hash);
  }, []);
  
  return (
    <Card className="mt-4 mb-4 border-2 border-red-500">
      <CardHeader>
        <CardTitle className="text-red-500">Diagnóstico da Página</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-bold">Este componente de diagnóstico está ativo para ajudar a depurar problemas.</p>
            <p>Você está na rota: {window.location.pathname}</p>
            <p>Hash: {window.location.hash || "(nenhum)"}</p>
            <div className="mt-2">
              <p className="font-bold">Componentes detectados:</p>
              <ul className="list-disc pl-5">
                {Object.entries(componentCounts).map(([component, count]) => (
                  <li key={component}>{component}: {count}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default DiagnosticDisplay;
