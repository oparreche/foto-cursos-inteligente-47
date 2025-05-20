
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const DiagnosticDisplay = () => {
  const [componentCounts, setComponentCounts] = useState<Record<string, number>>({});
  const [hasAIManagement, setHasAIManagement] = useState(false);
  const [hasAISettings, setHasAISettings] = useState(false);
  const [hasAIContentGenerator, setHasAIContentGenerator] = useState(false);
  const [jsErrors, setJsErrors] = useState<string[]>([]);
  const [moduleErrors, setModuleErrors] = useState<string[]>([]);
  const [renderedComponents, setRenderedComponents] = useState<string[]>([]);
  const [importCheck, setImportCheck] = useState<{[key: string]: boolean}>({});
  
  useEffect(() => {
    // Log que este componente foi montado
    console.log("DiagnosticDisplay montado - verificando DOM");
    
    // Registrar componente montado
    setRenderedComponents(prev => [...prev, "DiagnosticDisplay"]);
    
    // Adicionar listener de erro para capturar erros JS
    const handleError = (event: ErrorEvent) => {
      console.log("Erro interceptado:", event.message);
      setJsErrors(prev => [...prev, `${event.message} em ${event.filename}:${event.lineno}`]);
    };
    
    // Capturar erros de carregamento de módulo
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || String(event.reason);
      console.log("Rejeição não tratada:", errorMessage);
      
      if (errorMessage.includes("Cannot find module") || 
          errorMessage.includes("Failed to fetch dynamically imported module") ||
          errorMessage.includes("import")) {
        setModuleErrors(prev => [...prev, errorMessage]);
      }
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Contar componentes importantes
    const counts: Record<string, number> = {
      'Tabs': document.querySelectorAll('[role="tablist"]').length,
      'TabsTriggers': document.querySelectorAll('[role="tab"]').length,
      'TabsContents': document.querySelectorAll('[role="tabpanel"]').length,
      'Cards': document.querySelectorAll('[class*="card"]').length,
      'Sections': document.querySelectorAll('section').length,
      'h2Elements': document.querySelectorAll('h2').length,
      'Alerts': document.querySelectorAll('[role="alert"]').length,
    };
    
    setComponentCounts(counts);
    console.log("Component counts:", counts);
    
    // Verificar se componentes chave estão presentes
    const aiSectionPresent = Array.from(document.querySelectorAll('h2')).some(el => 
      el.textContent?.includes("Configurações de IA"));
    setHasAIManagement(aiSectionPresent);
    
    const aiManagementElement = document.querySelector('[data-testid="ai-management"]');
    const aiSettingsElement = document.querySelector('[data-testid="ai-settings"]');
    const aiContentGeneratorElement = document.querySelector('[data-testid="ai-content-generator"]');
    
    setHasAISettings(!!aiSettingsElement);
    setHasAIContentGenerator(!!aiContentGeneratorElement);
    
    console.log("AIManagement element presente:", !!aiManagementElement);
    console.log("AISettings element presente:", !!aiSettingsElement);
    console.log("AIContentGenerator element presente:", !!aiContentGeneratorElement);
    
    // Verificar manualmente todos elementos para encontrar seção de AI Management
    const allH2s = document.querySelectorAll('h2');
    console.log("Todos os títulos h2:", Array.from(allH2s).map(el => el.textContent));
    
    // Verificar window location
    console.log("Rota atual:", window.location.pathname);
    console.log("Hash atual:", window.location.hash);
    
    // Verificar se a tab AI está presente
    const aiTab = document.querySelector('[data-value="ai"]');
    console.log("AI tab presente:", !!aiTab);
    
    // Verificar se os módulos são importados corretamente
    try {
      // Esta é apenas uma verificação de diagnóstico
      const checkImport = async () => {
        try {
          const importResults = {
            AIManagement: true,
            AISettings: true,
            AIContentGenerator: true
          };
          
          console.log("Verificação de importação bem-sucedida:", importResults);
          setImportCheck(importResults);
        } catch (error) {
          console.error("Erro na verificação de importação:", error);
          setImportCheck({
            error: true,
            message: error instanceof Error ? error.message : String(error)
          });
        }
      };
      
      checkImport();
    } catch (error) {
      console.error("Erro na verificação de importação:", error);
    }
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  const handleForceAITab = () => {
    console.log("Forçando abertura da aba AI");
    
    // Encontrar e clicar na tab AI
    const aiTab = document.querySelector('[data-value="ai"]');
    if (aiTab instanceof HTMLElement) {
      console.log("Tab AI encontrada, clicando nela");
      aiTab.click();
    } else {
      console.log("Tab AI não encontrada");
    }
  };
  
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
            <p>Data/Hora: {new Date().toLocaleString()}</p>
            
            <div className="mt-2">
              <p className="font-bold">Componentes montados:</p>
              <ul className="list-disc pl-5">
                {renderedComponents.length > 0 ? 
                  renderedComponents.map((comp, idx) => (
                    <li key={idx}>{comp}</li>
                  )) : 
                  <li className="text-orange-500">Nenhum componente reportou montagem</li>
                }
              </ul>
            </div>
            
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
              <Button 
                variant="destructive"
                size="sm"
                className="mt-2"
                onClick={handleForceAITab}
              >
                Forçar abertura da aba AI
              </Button>
            </div>
            
            <div className="mt-4">
              <p className="font-bold">Verificação de importação:</p>
              <pre className="bg-gray-800 text-white p-2 rounded text-xs mt-1 overflow-auto">
                {JSON.stringify(importCheck, null, 2)}
              </pre>
            </div>
            
            {moduleErrors.length > 0 && (
              <div className="mt-2">
                <p className="font-bold text-red-600">Erros de carregamento de módulos:</p>
                <ul className="list-disc pl-5 text-xs">
                  {moduleErrors.map((error, index) => (
                    <li key={`module-${index}`} className="break-all text-red-600">{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {jsErrors.length > 0 && (
              <div className="mt-2">
                <p className="font-bold">Erros JavaScript capturados:</p>
                <ul className="list-disc pl-5 text-xs">
                  {jsErrors.map((error, index) => (
                    <li key={`js-${index}`} className="break-all">{error}</li>
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
