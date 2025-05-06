
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, XCircle, FileText } from "lucide-react";
import { PaymentTransaction } from "../types";
import { toast } from "sonner";

interface TransactionTableProps {
  transactions: PaymentTransaction[];
  searchTerm: string;
}

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const [invoiceStatus, setInvoiceStatus] = useState<{[key: number]: string}>({});

  const handleInvoiceGeneration = (transactionId: number, status: string) => {
    if (status !== "completed") {
      toast.error("Somente transações completadas podem ter notas fiscais emitidas");
      return;
    }
    
    // Em um sistema real, aqui teríamos a chamada para API de emissão de nota fiscal
    toast.success(`Nota fiscal emitida com sucesso para transação #${transactionId}`);
    
    // Atualiza o status da nota fiscal para esta transação
    setInvoiceStatus(prev => ({
      ...prev,
      [transactionId]: "emitida"
    }));
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
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Emitida</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleInvoiceGeneration(transaction.id, transaction.status)}
                    disabled={transaction.status !== "completed"}
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md ${
                      transaction.status === "completed" 
                        ? "bg-primary text-white hover:bg-primary/90" 
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
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
