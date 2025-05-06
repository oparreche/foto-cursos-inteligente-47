
import React, { useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Download, CheckCircle } from "lucide-react";
import { NFSeData } from "../types";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface NFSeDetailsTabProps {
  nfseData: NFSeData;
  onPrint?: () => void;
  onDownload?: () => void;
}

export const NFSeDetailsTab: React.FC<NFSeDetailsTabProps> = ({ 
  nfseData, 
  onPrint,
  onDownload 
}) => {
  const invoiceContentRef = useRef<HTMLDivElement>(null);
  
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

    const toastId = toast.loading("Gerando PDF...");
    
    try {
      // Vamos usar um método mais direto
      const content = invoiceContentRef.current;
      console.log("Elemento para gerar PDF:", content);
      
      // Definir estilo temporário para melhorar a captura do conteúdo
      const originalStyle = content.style.cssText;
      content.style.cssText = `
        ${originalStyle}
        background-color: white;
        padding: 20px;
        border-radius: 0;
        width: 800px;
      `;
      
      // Gerar o canvas
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true,
      });
      
      // Restaurar o estilo original
      content.style.cssText = originalStyle;
      
      console.log("Canvas gerado:", canvas.width, "x", canvas.height);
      
      // Converter para imagem
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      console.log("Imagem base64 gerada, tamanho:", imgData.length);
      
      // Criar o PDF (usando versão específica do jsPDF)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20; // margens de 10mm em cada lado
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Adicionar a imagem ao PDF
      pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight);
      
      // Forçar o download do PDF
      const filename = `NFSe_${nfseData.numeroLote || Date.now().toString()}.pdf`;
      console.log("Preparando download do arquivo:", filename);
      
      // Método 1: usando output direto para blob
      try {
        const pdfBlob = pdf.output('blob');
        console.log("Blob gerado, tamanho:", pdfBlob.size);
        
        const blobUrl = URL.createObjectURL(pdfBlob);
        console.log("URL do blob:", blobUrl);
        
        // Criar um link para download e clicar nele
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = filename;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        
        console.log("Link criado, disparando clique");
        downloadLink.click();
        
        // Limpar após o download
        setTimeout(() => {
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(blobUrl);
          console.log("Link de download removido e URL revogada");
        }, 1000);
        
        toast.dismiss(toastId);
        toast.success("PDF gerado com sucesso!");
      } catch (blobError) {
        console.error("Erro ao gerar blob:", blobError);
        
        // Método alternativo: usar save()
        try {
          console.log("Tentando método alternativo: save()");
          pdf.save(filename);
          toast.dismiss(toastId);
          toast.success("PDF gerado com sucesso!");
        } catch (saveError) {
          console.error("Erro ao usar save():", saveError);
          toast.dismiss(toastId);
          toast.error("Erro ao gerar PDF. Por favor, tente novamente.");
        }
      }
    } catch (error) {
      console.error("Erro completo ao gerar PDF:", error);
      toast.dismiss(toastId);
      toast.error("Falha ao gerar o PDF. Verifique o console para detalhes.");
    }
  };
  
  return (
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
          <Button 
            size="sm" 
            variant="outline"
            className="flex items-center gap-1"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-1" />
            <span>Imprimir</span>
          </Button>
          <Button 
            size="sm" 
            variant="default"
            className="flex items-center gap-1"
            onClick={handleDownloadPDF}
          >
            <Download className="h-4 w-4 mr-1" />
            <span>Baixar PDF</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
