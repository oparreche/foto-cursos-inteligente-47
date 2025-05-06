
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { NFSeData } from "./types";
import { generateAbrasfXml } from "./xmlGenerator";
import { NFSeDetailsTab } from "./components/NFSeDetailsTab";
import { NFSeXmlTab } from "./components/NFSeXmlTab";
import { NFSeDialogHeader } from "./components/NFSeDialogHeader";
import { toast } from "sonner";

interface NFSeViewerProps {
  nfseData: NFSeData;
  protocol?: string;
  onPrint?: () => void;
  onDownload?: () => void;
}

export const NFSeViewer: React.FC<NFSeViewerProps> = ({ 
  nfseData, 
  protocol,
  onPrint,
  onDownload
}) => {
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // Gera o XML a partir dos dados
  const xmlContent = generateAbrasfXml(nfseData);
  
  const handlePrintFallback = () => {
    console.log("Tentando imprimir NFSe");
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };
  
  const handleDownloadFallback = () => {
    console.log("Tentando baixar NFSe PDF");
    if (onDownload) {
      onDownload();
    } else {
      toast.info("Gerando PDF da NFS-e...");
      // O download será tratado diretamente pelo componente NFSeDetailsTab
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Visualizar NFS-e</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl">
        <DialogDescription>
          Visualize e baixe a Nota Fiscal de Serviços Eletrônica
        </DialogDescription>
        <NFSeDialogHeader nfseData={nfseData} protocol={protocol} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="xml">XML (ABRASF 2.0)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4">
            <NFSeDetailsTab 
              nfseData={nfseData} 
              onPrint={handlePrintFallback} 
              onDownload={handleDownloadFallback} 
            />
          </TabsContent>
          
          <TabsContent value="xml" className="mt-4">
            <NFSeXmlTab xmlContent={xmlContent} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <p className="text-xs text-muted-foreground">
            Esta simulação demonstra a geração de XML no padrão ABRASF 2.0 para a Prefeitura do Recife.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
