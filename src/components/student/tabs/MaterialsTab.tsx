
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const MaterialsTab = () => {
  return (
    <>
      <h3 className="text-xl font-bold mb-4">Materiais de Estudo</h3>
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Apostila - Fundamentos da Fotografia</h4>
              <p className="text-sm text-gray-600">PDF - 15MB</p>
            </div>
            <Button size="sm">Download</Button>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Slides - Composição Fotográfica</h4>
              <p className="text-sm text-gray-600">PDF - 8MB</p>
            </div>
            <Button size="sm">Download</Button>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">E-book - Guia de Iluminação</h4>
              <p className="text-sm text-gray-600">PDF - 12MB</p>
            </div>
            <Button size="sm">Download</Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default MaterialsTab;
