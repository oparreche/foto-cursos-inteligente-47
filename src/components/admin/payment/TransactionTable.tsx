
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaymentTransaction } from "../types";
import { toast } from "sonner";
import { StoredInvoice } from "../PaymentGateway";
import { TransactionTableRow } from "./TransactionTableRow";
import { generateInvoiceNumber } from "./invoice/InvoiceUtils";
import { printInvoice, generateInvoiceText } from "./invoice/InvoicePrinter";

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
      
      // Imprime a nota fiscal
      printInvoice({ 
        transaction,
        invoiceNumber: invoiceNumber || ''
      });
      
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
      
      // Criando conteúdo da nota fiscal
      const invoiceContent = generateInvoiceText(transaction, invoiceNumber || '');
      
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
          transactions.map(transaction => (
            <TransactionTableRow
              key={transaction.id}
              transaction={transaction}
              getTransactionInvoice={getTransactionInvoice}
              invoiceData={invoiceData}
              isEmitting={isEmitting}
              onInvoiceGeneration={handleInvoiceGeneration}
              onPrintInvoice={handlePrintInvoice}
              onDownloadInvoice={handleDownloadInvoice}
            />
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
