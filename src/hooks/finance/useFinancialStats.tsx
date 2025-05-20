
import { useReceivables } from './useReceivables';
import { usePayables } from './usePayables';
import { useTransactions } from './useTransactions';
import { FinancialStats } from '@/types/finance';

// Hook for financial calculations
export const useFinancialStats = () => {
  const { data: receivables = [], isLoading: isLoadingReceivables } = useReceivables();
  const { data: payables = [], isLoading: isLoadingPayables } = usePayables();
  const { data: transactions = [], isLoading: isLoadingTransactions } = useTransactions();
  
  const isLoading = isLoadingReceivables || isLoadingPayables || isLoadingTransactions;
  
  // Calculate financial statistics
  const stats: FinancialStats = {
    totalReceivables: receivables.reduce((sum, item) => sum + parseFloat(String(item.amount)), 0),
    totalPayables: payables.reduce((sum, item) => sum + parseFloat(String(item.amount)), 0),
    pendingReceivables: receivables
      .filter(item => item.status === 'pending')
      .reduce((sum, item) => sum + parseFloat(String(item.amount)), 0),
    pendingPayables: payables
      .filter(item => item.status === 'pending')
      .reduce((sum, item) => sum + parseFloat(String(item.amount)), 0),
    currentBalance: transactions.reduce((sum, item) => {
      const amount = parseFloat(String(item.amount));
      if (item.type === 'income') return sum + amount;
      if (item.type === 'expense') return sum - amount;
      if (item.type === 'refund') return sum - amount; // Refund is also negative
      return sum;
    }, 0)
  };
  
  return { stats, isLoading };
};
