
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AIContentGenerator, AISettings } from "@/components/admin/ai";
import { toast } from "sonner";

const AIManagement = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("AIManagement component mounted");
    try {
      console.log("AISettings component imported:", typeof AISettings);
      console.log("AIContentGenerator component imported:", typeof AIContentGenerator);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error in AIManagement:", error);
      toast.error("Erro ao carregar componentes de IA");
    }
  }, []);

  if (!isLoaded) {
    return <div className="p-4">Carregando componentes de IA...</div>;
  }

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
