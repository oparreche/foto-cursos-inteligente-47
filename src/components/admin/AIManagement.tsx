
import React, { useEffect, memo } from 'react';
import AISettings from "@/components/admin/ai/settings/AISettings";
import AIContentGenerator from "@/components/admin/ai/content-generator/AIContentGenerator";

const AIManagement = memo(() => {
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
});

AIManagement.displayName = 'AIManagement';

export default AIManagement;
