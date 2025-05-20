
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CertificatesTab = () => {
  return (
    <>
      <h3 className="text-xl font-bold mb-4">Meus Certificados</h3>
      <p className="text-gray-600 mb-6">
        Os certificados ficam disponíveis após a conclusão dos cursos.
      </p>
      
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Fotografia Básica</h4>
              <p className="text-sm text-gray-600">Concluído em 01/09/2023</p>
            </div>
            <Button size="sm">Ver certificado</Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default CertificatesTab;
