
import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// Import directly from the file paths instead of the index
import AISettings from "@/components/admin/ai/AISettings";
import AIContentGenerator from "@/components/admin/ai/AIContentGenerator";

const AIManagement = () => {
  useEffect(() => {
    console.log("AIManagement component mounted");
    console.log("AISettings component type:", typeof AISettings);
    console.log("AIContentGenerator component type:", typeof AIContentGenerator);
  }, []);

  console.log("AIManagement rendering");
  
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
