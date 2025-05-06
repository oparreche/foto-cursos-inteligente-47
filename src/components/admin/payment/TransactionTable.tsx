
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, XCircle, FileText, Send, Download, Printer, Server } from "lucide-react";
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
import { StoredInvoice } from "../PaymentGateway";

interface TransactionTableProps {
  transactions: PaymentTransaction[];
  searchTerm: string;
  storedInvoices: StoredInvoice[];
  storeInvoice: (invoice: Omit<StoredInvoice, 'id' | 'createdAt'>) => Promise<StoredInvoice>;
  updateInvoiceStatus: (invoiceId: string, status: StoredInvoice['status']) => Promise<StoredInvoice>;
}

export const TransactionTable = ({ 
  transactions, 
  storedInvoices, 
  storeInvoice, 
  updateInvoiceStatus 
}: TransactionTableProps) => {
  const [isEmitting, setIsEmitting] = useState<{[key: number]: boolean}>({});
  const [invoiceData, setInvoiceData] = useState<{[key: number]: {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    serverId?: string; // ID do servidor para a nota fiscal armazenada
  }}>({});

  // Função para gerar um número de nota fiscal único
  const generateInvoiceNumber = () => {
    const prefix = "NFS-";
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}${year}-${randomDigits}`;
  };

  // Verifica se uma transação já tem nota fiscal emitida
  const getTransactionInvoice = (transactionId: number) => {
    return storedInvoices.find(invoice => invoice.transactionId === transactionId);
  };

  const handleInvoiceGeneration = async (transaction: PaymentTransaction) => {
    if (transaction.status !== "completed") {
      toast.error("Somente transações completadas podem ter notas fiscais emitidas");
      return;
    }
    
    // Verifica se já existe uma nota fiscal para esta transação
    const existingInvoice = getTransactionInvoice(transaction.id);
    
    if (existingInvoice) {
      toast.info(`Nota fiscal ${existingInvoice.invoiceNumber} já foi emitida para esta transação`);
      return;
    }
    
    // Setando estado de emissão para mostrar loading
    setIsEmitting(prev => ({
      ...prev,
      [transaction.id]: true
    }));
    
    try {
      // Gerando dados da nota fiscal
      const today = new Date();
      const invoiceNumber = generateInvoiceNumber();
      const issueDate = today.toLocaleDateString('pt-BR');
      
      // Data de vencimento: 30 dias após emissão
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + 30);
      
      // Armazenando os dados da nota fiscal temporariamente
      const tempInvoiceData = {
        invoiceNumber,
        issueDate,
        dueDate: dueDate.toLocaleDateString('pt-BR')
      };
      
      // Armazenando a nota fiscal no servidor
      const storedInvoice = await storeInvoice({
        transactionId: transaction.id,
        invoiceNumber,
        issueDate,
        amount: transaction.amount,
        clientName: transaction.userName,
        clientId: transaction.userId,
        description: transaction.description,
        status: "processed"
      });
      
      // Atualizando o estado local com a referência do servidor
      setInvoiceData(prev => ({
        ...prev,
        [transaction.id]: {
          ...tempInvoiceData,
          serverId: storedInvoice.id
        }
      }));
      
      toast.success(`Nota fiscal ${invoiceNumber} emitida e armazenada no servidor com sucesso`);
    } catch (error) {
      toast.error("Falha ao emitir e armazenar nota fiscal. Tente novamente.");
    } finally {
      setIsEmitting(prev => ({
        ...prev,
        [transaction.id]: false
      }));
    }
  };

  const handlePrintInvoice = async (transaction: PaymentTransaction) => {
    const transactionId = transaction.id;
    const invoiceInfo = invoiceData[transactionId];
    const existingInvoice = getTransactionInvoice(transaction.id);
    
    if (!invoiceInfo && !existingInvoice) {
      toast.error("Informações da nota fiscal não encontradas");
      return;
    }

    let invoiceId = invoiceInfo?.serverId || existingInvoice?.id;
    if (!invoiceId) {
      toast.error("ID da nota fiscal não encontrado");
      return;
    }
    
    try {
      // Atualiza o status da nota fiscal no servidor
      await updateInvoiceStatus(invoiceId, "printed");
      toast.success("Status da nota fiscal atualizado para 'impresso' no servidor");
      
      // Obter dados da nota fiscal
      const invoiceNumber = invoiceInfo?.invoiceNumber || existingInvoice?.invoiceNumber;
      const issueDate = invoiceInfo?.issueDate || existingInvoice?.issueDate;
      
      // Abrindo uma nova janela para impressão
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.");
        return;
      }
      
      // Formata a data atual no formato DD/MM/YYYY
      const formattedDate = new Date().toLocaleDateString('pt-BR');
      
      // Conteúdo HTML da nota fiscal
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Nota Fiscal de Serviço - ${invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              .invoice-container { width: 100%; max-width: 800px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .logo { max-height: 80px; margin-bottom: 10px; }
              .title { font-size: 18px; font-weight: bold; margin: 10px 0; }
              .invoice-number { font-size: 16px; margin-bottom: 20px; }
              .info-box { border: 1px solid #ddd; padding: 10px; margin-bottom: 15px; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              table, th, td { border: 1px solid #ddd; }
              th, td { padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .footer { font-size: 12px; text-align: center; margin-top: 30px; }
              .controls { margin-bottom: 20px; }
              @media print {
                .controls { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="controls">
              <button onclick="window.print()">Imprimir</button>
              <button onclick="window.close()">Fechar</button>
            </div>
            
            <div class="invoice-container">
              <div class="header">
                <img src="/lovable-uploads/d580b9f4-ed3f-44c5-baa5-e0a42dfcb768.png" alt="Logo da Escola Pernambucana de Fotografia" class="logo">
                <div class="title">NOTA FISCAL DE SERVIÇO ELETRÔNICA</div>
                <div class="invoice-number">${invoiceNumber}</div>
              </div>
              
              <div class="info-box">
                <div><strong>Data de Emissão:</strong> ${formattedDate}</div>
                <div><strong>Data de Vencimento:</strong> ${formattedDate}</div>
                <div><strong>Status:</strong> Emitida</div>
              </div>
              
              <div>
                <div class="title">PRESTADOR DE SERVIÇOS</div>
                <div><strong>Razão Social:</strong> Escola Pernambucana de Fotografia LTDA</div>
                <div><strong>CNPJ:</strong> XX.XXX.XXX/0001-XX</div>
                <div><strong>Endereço:</strong> Rua da Fotografia, 123 - Recife/PE</div>
              </div>
              
              <div style="margin-top: 20px;">
                <div class="title">TOMADOR DE SERVIÇOS</div>
                <div><strong>Nome/Razão Social:</strong> ${transaction.userName}</div>
                <div><strong>ID do Cliente:</strong> ${transaction.userId}</div>
              </div>
              
              <div style="margin-top: 20px;" class="title">DESCRIÇÃO DOS SERVIÇOS</div>
              <table>
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
                    <td>R$ ${transaction.amount.toFixed(2).replace('.', ',')}</td>
                    <td>1</td>
                    <td>R$ ${transaction.amount.toFixed(2).replace('.', ',')}</td>
                  </tr>
                </tbody>
              </table>
              
              <div style="margin-left: auto; width: 300px;">
                <table>
                  <tr>
                    <td><strong>Subtotal:</strong></td>
                    <td>R$ ${transaction.amount.toFixed(2).replace('.', ',')}</td>
                  </tr>
                  <tr>
                    <td><strong>ISS (5%):</strong></td>
                    <td>R$ ${(transaction.amount * 0.05).toFixed(2).replace('.', ',')}</td>
                  </tr>
                  <tr>
                    <td><strong>Valor Total:</strong></td>
                    <td><strong>R$ ${transaction.amount.toFixed(2).replace('.', ',')}</strong></td>
                  </tr>
                </table>
              </div>
              
              <div class="footer">
                <p>Esta é uma Nota Fiscal de Serviço Eletrônica emitida de acordo com a Lei Complementar nº 116/2003.</p>
                <p>Documento gerado eletronicamente. Emitido em ${formattedDate}.</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      toast.success("Nota fiscal pronta para impressão");
    } catch (error) {
      toast.error("Erro ao atualizar o status da nota fiscal");
    }
  };

  const handleDownloadInvoice = async (transaction: PaymentTransaction) => {
    const transactionId = transaction.id;
    const invoiceInfo = invoiceData[transactionId];
    const existingInvoice = getTransactionInvoice(transaction.id);
    
    if (!invoiceInfo && !existingInvoice) {
      toast.error("Informações da nota fiscal não encontradas");
      return;
    }
    
    let invoiceId = invoiceInfo?.serverId || existingInvoice?.id;
    if (!invoiceId) {
      toast.error("ID da nota fiscal não encontrado");
      return;
    }
    
    try {
      // Atualiza o status da nota fiscal no servidor
      await updateInvoiceStatus(invoiceId, "downloaded");
      toast.success("Status da nota fiscal atualizado para 'baixado' no servidor");
      
      // Obter dados da nota fiscal
      const invoiceNumber = invoiceInfo?.invoiceNumber || existingInvoice?.invoiceNumber;
      
      // Criando conteúdo da nota fiscal em formato texto
      const formattedDate = new Date().toLocaleDateString('pt-BR');
      const invoiceContent = `
NOTA FISCAL DE SERVIÇO ELETRÔNICA
${invoiceNumber}

Data de Emissão: ${formattedDate}
Data de Vencimento: ${formattedDate}
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
Valor: R$ ${transaction.amount.toFixed(2).replace('.', ',')}
Quantidade: 1
Valor Total: R$ ${transaction.amount.toFixed(2).replace('.', ',')}

Subtotal: R$ ${transaction.amount.toFixed(2).replace('.', ',')}
ISS (5%): R$ ${(transaction.amount * 0.05).toFixed(2).replace('.', ',')}
Valor Total: R$ ${transaction.amount.toFixed(2).replace('.', ',')}

Esta é uma Nota Fiscal de Serviço Eletrônica emitida de acordo com a Lei Complementar nº 116/2003.
Documento gerado eletronicamente. Emitido em ${formattedDate}.
      `;
      
      // Criando o arquivo para download
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Nota_Fiscal_${invoiceNumber}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Nota fiscal baixada com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar o status da nota fiscal");
    }
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
          transactions.map(transaction => {
            const transactionInvoice = getTransactionInvoice(transaction.id);
            return (
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
                  {transactionInvoice || invoiceData[transaction.id]?.serverId ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">
                          Emitida #{transactionInvoice?.invoiceNumber || invoiceData[transaction.id]?.invoiceNumber}
                        </span>
                        <Server className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => handlePrintInvoice(transaction)}
                        >
                          <Printer className="h-3 w-3" />
                          <span>Imprimir</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => handleDownloadInvoice(transaction)}
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
                          <AlertDialogTitle>Emitir e Armazenar Nota Fiscal</AlertDialogTitle>
                          <AlertDialogDescription>
                            Você está prestes a emitir e armazenar uma nota fiscal para a transação #{transaction.id} no valor de 
                            R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
                            A nota será armazenada no servidor. Deseja prosseguir?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleInvoiceGeneration(transaction)}>
                            <Send className="h-4 w-4 mr-2" />
                            Emitir e Armazenar
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
            );
          })
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
