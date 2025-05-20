
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AIContentGenerator, AISettings } from "@/components/admin/ai";
import { toast } from "sonner";

const AIManagement = () => {
  console.log("AIManagement renderizando");
  console.log("AISettings componente:", typeof AISettings);
  console.log("AIContentGenerator componente:", typeof AIContentGenerator);
  
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Configurações de IA</h2>
        <Card>
          <CardContent className="pt-6">
            {AISettings ? <AISettings /> : <div>Erro ao carregar componente AISettings</div>}
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Gerador de Conteúdo</h2>
        <Card>
          <CardContent className="pt-6">
            {AIContentGenerator ? <AIContentGenerator /> : <div>Erro ao carregar componente AIContentGenerator</div>}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AIManagement;
