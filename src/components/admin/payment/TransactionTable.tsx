
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, XCircle, FileText, Send, Download, Printer } from "lucide-react";
import { PaymentTransaction } from "../types";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface TransactionTableProps {
  transactions: PaymentTransaction[];
  searchTerm: string;
}

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const [invoiceStatus, setInvoiceStatus] = useState<{[key: number]: string}>({});
  const [isEmitting, setIsEmitting] = useState<{[key: number]: boolean}>({});
  const [invoiceData, setInvoiceData] = useState<{[key: number]: {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
  }}>({});

  // Função para gerar um número de nota fiscal único
  const generateInvoiceNumber = () => {
    const prefix = "NFS-";
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const year = new Date().getFullYear();
    return `${prefix}${year}-${randomDigits}`;
  };

  const handleInvoiceGeneration = async (transactionId: number, status: string) => {
    if (status !== "completed") {
      toast.error("Somente transações completadas podem ter notas fiscais emitidas");
      return;
    }
    
    // Setando estado de emissão para mostrar loading
    setIsEmitting(prev => ({
      ...prev,
      [transactionId]: true
    }));
    
    try {
      // Simulando processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Gerando dados da nota fiscal
      const today = new Date();
      const invoiceNumber = generateInvoiceNumber();
      const issueDate = today.toLocaleDateString('pt-BR');
      
      // Data de vencimento: 30 dias após emissão
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + 30);
      
      // Armazenando os dados da nota fiscal
      setInvoiceData(prev => ({
        ...prev,
        [transactionId]: {
          invoiceNumber,
          issueDate,
          dueDate: dueDate.toLocaleDateString('pt-BR')
        }
      }));

      // Atualiza o status da nota fiscal para esta transação
      setInvoiceStatus(prev => ({
        ...prev,
        [transactionId]: "emitida"
      }));
      
      toast.success(`Nota fiscal ${invoiceNumber} emitida com sucesso para transação #${transactionId}`);
    } catch (error) {
      toast.error("Falha ao emitir nota fiscal. Tente novamente.");
    } finally {
      setIsEmitting(prev => ({
        ...prev,
        [transactionId]: false
      }));
    }
  };

  const handlePrintInvoice = (transactionId: number) => {
    if (!invoiceData[transactionId]) return;
    
    // Abrindo uma nova janela para impressão
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.");
      return;
    }
    
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    // Conteúdo HTML da nota fiscal
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Nota Fiscal de Serviço - ${invoiceData[transactionId].invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .company-info { margin-bottom: 20px; }
            .invoice-details { border: 1px solid #ddd; padding: 10px; margin-bottom: 20px; }
            .customer-info { margin-bottom: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .totals { margin-left: auto; width: 300px; }
            .totals table { width: 100%; }
            .totals td { padding: 5px; }
            .footer { margin-top: 50px; font-size: 12px; text-align: center; }
            @media print {
              .no-print { display: none; }
              body { margin: 0; padding: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px;">
            <button onclick="window.print()">Imprimir Nota Fiscal</button>
            <button onclick="window.close()">Fechar</button>
          </div>
          
          <div class="header">
            <div>
              <img src="/lovable-uploads/d580b9f4-ed3f-44c5-baa5-e0a42dfcb768.png" alt="Logo da Empresa" style="height: 60px;">
            </div>
            <div>
              <h1>NOTA FISCAL DE SERVIÇO ELETRÔNICA</h1>
              <h2>${invoiceData[transactionId].invoiceNumber}</h2>
            </div>
          </div>
          
          <div class="invoice-details">
            <table width="100%">
              <tr>
                <td><strong>Data de Emissão:</strong> ${invoiceData[transactionId].issueDate}</td>
                <td><strong>Data de Vencimento:</strong> ${invoiceData[transactionId].dueDate}</td>
              </tr>
              <tr>
                <td colspan="2"><strong>Status:</strong> Emitida</td>
              </tr>
            </table>
          </div>
          
          <div class="company-info">
            <h3>PRESTADOR DE SERVIÇOS</h3>
            <p><strong>Razão Social:</strong> Escola Pernambucana de Fotografia LTDA</p>
            <p><strong>CNPJ:</strong> XX.XXX.XXX/0001-XX</p>
            <p><strong>Endereço:</strong> Rua da Fotografia, 123 - Recife/PE</p>
          </div>
          
          <div class="customer-info">
            <h3>TOMADOR DE SERVIÇOS</h3>
            <p><strong>Nome/Razão Social:</strong> ${transaction.userName}</p>
            <p><strong>ID do Cliente:</strong> ${transaction.userId}</p>
          </div>
          
          <h3>DESCRIÇÃO DOS SERVIÇOS</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor Unitário</th>
                <th>Quantidade</th>
                <th>Valor Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${transaction.description}</td>
                <td>R$ ${transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>1</td>
                <td>R$ ${transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="totals">
            <table>
              <tr>
                <td><strong>Subtotal:</strong></td>
                <td>R$ ${transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td><strong>ISS (5%):</strong></td>
                <td>R$ ${(transaction.amount * 0.05).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td><strong>Valor Total:</strong></td>
                <td><strong>R$ ${transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></td>
              </tr>
            </table>
          </div>
          
          <div class="footer">
            <p>Esta é uma Nota Fiscal de Serviço Eletrônica emitida de acordo com a Lei Complementar nº 116/2003.</p>
            <p>Documento gerado eletronicamente. Emitido em ${invoiceData[transactionId].issueDate}.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    toast.success("Nota fiscal pronta para impressão");
  };

  const handleDownloadInvoice = (transactionId: number) => {
    if (!invoiceData[transactionId]) return;
    
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    // Criando conteúdo da nota fiscal em formato texto
    const invoiceContent = `
NOTA FISCAL DE SERVIÇO ELETRÔNICA
${invoiceData[transactionId].invoiceNumber}

Data de Emissão: ${invoiceData[transactionId].issueDate}
Data de Vencimento: ${invoiceData[transactionId].dueDate}
Status: Emitida

PRESTADOR DE SERVIÇOS:
Razão Social: Escola Pernambucana de Fotografia LTDA
CNPJ: XX.XXX.XXX/0001-XX
Endereço: Rua da Fotografia, 123 - Recife/PE

TOMADOR DE SERVIÇOS:
Nome/Razão Social: ${transaction.userName}
ID do Cliente: ${transaction.userId}

DESCRIÇÃO DOS SERVIÇOS:
${transaction.description}
Valor: R$ ${transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Quantidade: 1
Valor Total: R$ ${transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

Subtotal: R$ ${transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
ISS (5%): R$ ${(transaction.amount * 0.05).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Valor Total: R$ ${transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

Esta é uma Nota Fiscal de Serviço Eletrônica emitida de acordo com a Lei Complementar nº 116/2003.
Documento gerado eletronicamente. Emitido em ${invoiceData[transactionId].issueDate}.
    `;
    
    // Criando o arquivo para download
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Nota_Fiscal_${invoiceData[transactionId].invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Nota fiscal baixada com sucesso");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Usuário</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Nota Fiscal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length > 0 ? (
          transactions.map(transaction => (
            <TableRow key={transaction.id}>
              <TableCell>#{transaction.id}</TableCell>
              <TableCell>{transaction.userName}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell>{transaction.date.toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {transaction.status === "completed" ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Completado</span>
                    </>
                  ) : transaction.status === "pending" ? (
                    <>
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span className="text-amber-600">Pendente</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">Falhou</span>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {invoiceStatus[transaction.id] ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Emitida #{invoiceData[transaction.id]?.invoiceNumber}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => handlePrintInvoice(transaction.id)}
                      >
                        <Printer className="h-3 w-3" />
                        <span>Imprimir</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => handleDownloadInvoice(transaction.id)}
                      >
                        <Download className="h-3 w-3" />
                        <span>Baixar</span>
                      </Button>
                    </div>
                  </div>
                ) : transaction.status === "completed" ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1"
                        disabled={isEmitting[transaction.id]}
                      >
                        {isEmitting[transaction.id] ? (
                          <>
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            <span>Emitindo...</span>
                          </>
                        ) : (
                          <>
                            <FileText className="h-3 w-3" />
                            <span>Emitir NFS</span>
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Emitir Nota Fiscal de Serviço</AlertDialogTitle>
                        <AlertDialogDescription>
                          Você está prestes a emitir uma nota fiscal para a transação #{transaction.id} no valor de 
                          R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
                          Deseja prosseguir com a emissão?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleInvoiceGeneration(transaction.id, transaction.status)}>
                          <Send className="h-4 w-4 mr-2" />
                          Emitir Nota Fiscal
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <button 
                    disabled={true}
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
                  >
                    <FileText className="h-3 w-3" />
                    Emitir NFS
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6">
              Nenhuma transação encontrada.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
