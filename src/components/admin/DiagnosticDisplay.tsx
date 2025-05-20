
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const DiagnosticDisplay = () => {
  const [componentCounts, setComponentCounts] = useState<Record<string, number>>({});
  const [hasAIManagement, setHasAIManagement] = useState(false);
  const [hasAISettings, setHasAISettings] = useState(false);
  const [hasAIContentGenerator, setHasAIContentGenerator] = useState(false);
  const [jsErrors, setJsErrors] = useState<string[]>([]);
  
  useEffect(() => {
    // Log that this component has mounted
    console.log("DiagnosticDisplay mounted - checking DOM");
    
    // Add error listener to capture JS errors
    const handleError = (event: ErrorEvent) => {
      console.log("Error intercepted:", event.message);
      setJsErrors(prev => [...prev, `${event.message} at ${event.filename}:${event.lineno}`]);
    };
    
    window.addEventListener('error', handleError);
    
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
    
    // Check if key components are present
    const aiSectionPresent = Array.from(document.querySelectorAll('h2')).some(el => 
      el.textContent?.includes("Configurações de IA"));
    setHasAIManagement(aiSectionPresent);
    
    const aiSettingsPresent = document.querySelector('[data-testid="ai-settings"]') !== null;
    setHasAISettings(aiSettingsPresent);
    
    const aiContentGenPresent = document.querySelector('[data-testid="ai-content-generator"]') !== null;
    setHasAIContentGenerator(aiContentGenPresent);
    
    console.log("AIManagement section present:", aiSectionPresent);
    console.log("AISettings present:", aiSettingsPresent);
    console.log("AIContentGenerator present:", aiContentGenPresent);
    
    // Try to manually check all elements to find AI Management section
    const allH2s = document.querySelectorAll('h2');
    console.log("All h2 titles:", Array.from(allH2s).map(el => el.textContent));
    
    // Check window location
    console.log("Current route:", window.location.pathname);
    console.log("Current hash:", window.location.hash);
    
    // Check if the AI tab is present
    const aiTab = document.querySelector('[data-value="ai"]');
    console.log("AI tab present:", !!aiTab);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
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
            <div className="mt-2">
              <p className="font-bold">Status dos componentes de IA:</p>
              <ul className="list-disc pl-5">
                <li>Seção AIManagement: {hasAIManagement ? "✅ Presente" : "❌ NÃO detectada"}</li>
                <li>Componente AISettings: {hasAISettings ? "✅ Presente" : "❌ NÃO detectado"}</li>
                <li>Componente AIContentGenerator: {hasAIContentGenerator ? "✅ Presente" : "❌ NÃO detectado"}</li>
              </ul>
            </div>
            {jsErrors.length > 0 && (
              <div className="mt-2">
                <p className="font-bold">Erros JavaScript capturados:</p>
                <ul className="list-disc pl-5 text-xs">
                  {jsErrors.map((error, index) => (
                    <li key={index} className="break-all">{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default DiagnosticDisplay;
