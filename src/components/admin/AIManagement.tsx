
import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AIContentGenerator, AISettings } from "@/components/admin/ai";

const AIManagement = () => {
  useEffect(() => {
    console.log("AIManagement component mounted");
    try {
      console.log("AISettings component imported:", typeof AISettings);
      console.log("AIContentGenerator component imported:", typeof AIContentGenerator);
    } catch (error) {
      console.error("Error in AIManagement:", error);
    }
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
