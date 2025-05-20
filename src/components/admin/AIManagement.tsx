
import React, { useEffect } from 'react';

// Import components directly from their source files to avoid duplicated imports
import AISettings from "@/components/admin/ai/settings/AISettings";
import AIContentGenerator from "@/components/admin/ai/content-generator/AIContentGenerator";

const AIManagement = () => {
  useEffect(() => {
    console.log("AIManagement component mounted");
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Configurações de IA</h2>
        <AISettings />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Gerador de Conteúdo</h2>
        <AIContentGenerator />
      </section>
    </div>
  );
};

export default AIManagement;
