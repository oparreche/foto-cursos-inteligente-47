
import { Database } from "@/integrations/supabase/types";

// Tipos exportados do banco de dados
export type FinancialCategory = Database['public']['Tables']['financial_categories']['Row'];
export type Receivable = Database['public']['Tables']['receivables']['Row'];
export type Payable = Database['public']['Tables']['payables']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];

// Tipos para formulários
export type CategoryFormValues = Omit<FinancialCategory, 'id' | 'created_at' | 'updated_at'>;
export type ReceivableFormValues = Omit<Receivable, 'id' | 'created_at' | 'updated_at'>;
export type PayableFormValues = Omit<Payable, 'id' | 'created_at' | 'updated_at'>;
export type TransactionFormValues = Omit<Transaction, 'id' | 'created_at' | 'updated_at'>;

// Status de pagamento
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'canceled';

// Tipo de transação
export type TransactionType = 'income' | 'expense' | 'transfer' | 'refund';

// Estatísticas financeiras
export type FinancialStats = {
  totalReceivables: number;
  totalPayables: number;
  currentBalance: number;
  pendingReceivables: number;
  pendingPayables: number;
};
