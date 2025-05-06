import React, { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Download, Printer, Code, CheckCircle, Upload } from "lucide-react";
import { NFSeData } from "./types";
import { generateAbrasfXml } from "./xmlGenerator";
import { TransactionStatusIndicator } from "../TransactionStatusIndicator";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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
  const invoiceContentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Gera o XML a partir dos dados
  const xmlContent = generateAbrasfXml(nfseData);
  
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleDownloadPDF = async () => {
    if (onDownload) {
      onDownload();
      return;
    }
    
    if (!invoiceContentRef.current) {
      toast.error("Não foi possível gerar o PDF");
      return;
    }

    toast.loading("Gerando PDF...");

    try {
      const content = invoiceContentRef.current;
      const canvas = await html2canvas(content, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`NFS-e_${nfseData.numeroLote}.pdf`);
      
      toast.dismiss();
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.dismiss();
      toast.error("Erro ao gerar o PDF. Tente novamente.");
    }
  };
  
  const handleXmlFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const processXmlFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const xmlContent = event.target?.result as string;
          // Here you would typically parse the XML and process it
          // For demo purposes, we'll just show a success message
          toast.success("XML importado com sucesso");
          console.log("XML Content:", xmlContent);
          // Reset the file input
          if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
          toast.error("Erro ao processar o arquivo XML");
          console.error("Error processing XML:", error);
        }
      };
      reader.readAsText(file);
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Visualizar NFS-e</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span>Nota Fiscal de Serviço Eletrônica</span>
            {protocol && <span className="text-sm text-muted-foreground ml-2">Protocolo: {protocol}</span>}
          </DialogTitle>
          
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-sm font-medium">NFS-e #{nfseData.numeroLote}</p>
            </div>
            <TransactionStatusIndicator status={nfseData.status || 'completed'} type="nfse" />
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="xml">XML (ABRASF 2.0)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações da NFS-e</CardTitle>
                <CardDescription>Detalhes da nota fiscal eletrônica de serviço</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div ref={invoiceContentRef} className="invoice-content">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-sm">Prestador</h3>
                      <p className="text-sm">CNPJ: {nfseData.cnpj}</p>
                      <p className="text-sm">Inscrição Municipal: {nfseData.inscricaoMunicipal}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm">Tomador</h3>
                      <p className="text-sm">Nome: {nfseData.tomador.nome}</p>
                      {nfseData.tomador.cpf && <p className="text-sm">CPF: {nfseData.tomador.cpf}</p>}
                      {nfseData.tomador.cnpj && <p className="text-sm">CNPJ: {nfseData.tomador.cnpj}</p>}
                      {nfseData.tomador.endereco && (
                        <p className="text-sm">
                          Endereço: {nfseData.tomador.endereco.logradouro}, {nfseData.tomador.endereco.numero} - {nfseData.tomador.endereco.bairro}, {nfseData.tomador.endereco.cidade}/{nfseData.tomador.endereco.uf}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium text-sm">Serviço</h3>
                    <p className="text-sm">Descrição: {nfseData.servico.descricao}</p>
                    <p className="text-sm">Código: {nfseData.servico.codigoTributacaoMunicipio}</p>
                    <p className="text-sm">Alíquota: {(nfseData.servico.aliquota * 100).toFixed(2)}%</p>
                    <div className="mt-2">
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Valor do Serviço:</span>
                        <span className="font-medium">
                          R$ {nfseData.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">ISS ({(nfseData.servico.aliquota * 100).toFixed(2)}%):</span>
                        <span>
                          R$ {(nfseData.valor * nfseData.servico.aliquota).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-b py-2 my-2">
                        <span className="font-medium">Valor Líquido:</span>
                        <span className="font-medium">
                          R$ {(nfseData.valor * (1 - nfseData.servico.aliquota)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>Documento Fiscal Eletrônico</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-1" />
                    Imprimir
                  </Button>
                  <Button variant="default" size="sm" onClick={handleDownloadPDF}>
                    <Download className="h-4 w-4 mr-1" />
                    Baixar PDF
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="xml" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  <span>XML ABRASF 2.0</span>
                </CardTitle>
                <CardDescription>
                  Formato XML para envio à Prefeitura do Recife (padrão ABRASF 2.0)
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="bg-slate-50 p-4 rounded-md border overflow-auto max-h-[300px]">
                  <pre className="text-xs whitespace-pre-wrap font-mono">{xmlContent}</pre>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Você também pode importar seu próprio arquivo XML:</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleXmlFileUpload}>
                      <Upload className="h-4 w-4 mr-1" />
                      Importar XML
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={processXmlFile}
                      accept=".xml"
                      className="hidden"
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end">
                <Button variant="outline" size="sm" onClick={() => {
                  navigator.clipboard.writeText(xmlContent);
                  toast.success("XML copiado para a área de transferência");
                }}>
                  Copiar XML
                </Button>
              </CardFooter>
            </Card>
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
