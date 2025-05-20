
import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

// Import the settings component 
import AISettings from "@/components/admin/ai/settings/AISettings";

// Import the content generator component
import AIContentGenerator from "@/components/admin/ai/content-generator/AIContentGenerator";

const AIManagement = () => {
  useEffect(() => {
    console.log("AIManagement component mounted");
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Configurações de IA</h2>
        <Card>
          <CardContent className="pt-6">
            <AISettings />
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Gerador de Conteúdo</h2>
        <Card>
          <CardContent className="pt-6">
            <AIContentGenerator />
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AIManagement;
