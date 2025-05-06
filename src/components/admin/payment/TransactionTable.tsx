
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { PaymentTransaction } from "../types";

interface TransactionTableProps {
  transactions: PaymentTransaction[];
  searchTerm: string;
}

export const TransactionTable = ({ transactions, searchTerm }: TransactionTableProps) => {
  const filteredTransactions = transactions.filter(
    tx =>
      tx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
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
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6">
              Nenhuma transação encontrada.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
