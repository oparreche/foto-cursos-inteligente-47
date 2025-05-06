
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, XCircle, FileText, Send } from "lucide-react";
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
    
    // Simulando uma requisição para API de emissão de nota fiscal
    try {
      // Simulamos o tempo de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulamos o retorno da API
      toast.success(`Nota fiscal emitida com sucesso para transação #${transactionId}`);
      
      // Atualiza o status da nota fiscal para esta transação
      setInvoiceStatus(prev => ({
        ...prev,
        [transactionId]: "emitida"
      }));
    } catch (error) {
      // Simulação de erro
      toast.error("Falha ao emitir nota fiscal. Tente novamente.");
    } finally {
      // Remove o estado de loading
      setIsEmitting(prev => ({
        ...prev,
        [transactionId]: false
      }));
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
