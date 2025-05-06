
import React from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface TransactionStatusIndicatorProps {
  status: 'pending' | 'completed' | 'failed';
}

export const TransactionStatusIndicator: React.FC<TransactionStatusIndicatorProps> = ({ status }) => {
  return (
    <div className="flex items-center gap-2">
      {status === "completed" ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-green-600">Completado</span>
        </>
      ) : status === "pending" ? (
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
  );
};
