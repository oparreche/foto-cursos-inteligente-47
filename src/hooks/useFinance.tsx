import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  FinancialCategory, 
  Receivable, 
  Payable, 
  Transaction,
  ReceivableFormValues,
  PayableFormValues,
  TransactionFormValues,
  CategoryFormValues
} from '@/types/finance';

// Hook para buscar categorias financeiras
export const useCategories = () => {
  const fetchCategories = async (): Promise<FinancialCategory[]> => {
    const { data, error } = await supabase
      .from('financial_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Erro ao buscar categorias:', error);
      toast.error('Erro ao carregar categorias financeiras');
      throw error;
    }
    
    return data || [];
  };
  
  return useQuery({
    queryKey: ['financialCategories'],
    queryFn: fetchCategories,
  });
};

// Hook para buscar contas a receber
export const useReceivables = () => {
  const fetchReceivables = async (): Promise<Receivable[]> => {
    const { data, error } = await supabase
      .from('receivables')
      .select('*, financial_categories(name, type)')
      .order('due_date');
    
    if (error) {
      console.error('Erro ao buscar contas a receber:', error);
      toast.error('Erro ao carregar contas a receber');
      throw error;
    }
    
    return data || [];
  };
  
  return useQuery({
    queryKey: ['receivables'],
    queryFn: fetchReceivables,
  });
};

// Hook para buscar contas a pagar
export const usePayables = () => {
  const fetchPayables = async (): Promise<Payable[]> => {
    const { data, error } = await supabase
      .from('payables')
      .select('*, financial_categories(name, type)')
      .order('due_date');
    
    if (error) {
      console.error('Erro ao buscar contas a pagar:', error);
      toast.error('Erro ao carregar contas a pagar');
      throw error;
    }
    
    return data || [];
  };
  
  return useQuery({
    queryKey: ['payables'],
    queryFn: fetchPayables,
  });
};

// Hook para buscar transações (fluxo de caixa)
export const useTransactions = () => {
  const fetchTransactions = async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('transaction_date', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar transações:', error);
      toast.error('Erro ao carregar transações');
      throw error;
    }
    
    return data || [];
  };
  
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });
};

// Hook para gerenciar contas a receber
export const useReceivableActions = () => {
  const queryClient = useQueryClient();
  
  // Adicionar conta a receber
  const addReceivable = useMutation({
    mutationFn: async (values: ReceivableFormValues) => {
      // Garantir que payment_date seja null para contas pendentes
      const dataToInsert = values.status === 'paid' 
        ? { ...values } 
        : { ...values, payment_date: null };
      
      const { data, error } = await supabase
        .from('receivables')
        .insert([dataToInsert])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivables'] });
      toast.success('Conta a receber adicionada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar conta a receber: ${error.message}`);
    }
  });

  // Atualizar conta a receber
  const updateReceivable = useMutation({
    mutationFn: async ({ id, values }: { id: string, values: Partial<Receivable> }) => {
      const { data, error } = await supabase
        .from('receivables')
        .update(values)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivables'] });
      toast.success('Conta a receber atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar conta a receber: ${error.message}`);
    }
  });

  // Marcar como pago (registra o pagamento)
  const markAsPaid = useMutation({
    mutationFn: async ({ id, paymentDate = new Date() }: { id: string, paymentDate?: Date }) => {
      const formattedDate = paymentDate.toISOString().split('T')[0];
      
      const { data: receivable, error: fetchError } = await supabase
        .from('receivables')
        .select('amount, description')
        .eq('id', id)
        .single();
      
      if (fetchError) throw new Error(fetchError.message);
      
      // Atualizar o status para pago
      const { error: updateError } = await supabase
        .from('receivables')
        .update({ 
          status: 'paid', 
          payment_date: formattedDate 
        })
        .eq('id', id);
      
      if (updateError) throw new Error(updateError.message);
      
      // Registrar a transação
      if (receivable) {
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert([{
            description: `Recebimento: ${receivable.description}`,
            type: 'income',
            amount: receivable.amount,
            transaction_date: formattedDate,
            reference_id: id,
            reference_type: 'receivable'
          }]);
        
        if (transactionError) throw new Error(transactionError.message);
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivables'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Pagamento registrado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao registrar pagamento: ${error.message}`);
    }
  });

  // Excluir conta a receber
  const deleteReceivable = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('receivables')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivables'] });
      toast.success('Conta a receber excluída com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir conta a receber: ${error.message}`);
    }
  });
  
  return {
    addReceivable,
    updateReceivable,
    markAsPaid,
    deleteReceivable
  };
};

// Hook para gerenciar contas a pagar
export const usePayableActions = () => {
  const queryClient = useQueryClient();
  
  // Adicionar conta a pagar
  const addPayable = useMutation({
    mutationFn: async (values: PayableFormValues) => {
      // Garantir que payment_date seja null para contas pendentes
      const dataToInsert = values.status === 'paid' 
        ? { ...values } 
        : { ...values, payment_date: null };
      
      const { data, error } = await supabase
        .from('payables')
        .insert([dataToInsert])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payables'] });
      toast.success('Conta a pagar adicionada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar conta a pagar: ${error.message}`);
    }
  });

  // Atualizar conta a pagar
  const updatePayable = useMutation({
    mutationFn: async ({ id, values }: { id: string, values: Partial<Payable> }) => {
      const { data, error } = await supabase
        .from('payables')
        .update(values)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payables'] });
      toast.success('Conta a pagar atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar conta a pagar: ${error.message}`);
    }
  });

  // Marcar como pago (registra o pagamento)
  const markAsPaid = useMutation({
    mutationFn: async ({ id, paymentDate = new Date() }: { id: string, paymentDate?: Date }) => {
      const formattedDate = paymentDate.toISOString().split('T')[0];
      
      const { data: payable, error: fetchError } = await supabase
        .from('payables')
        .select('amount, description')
        .eq('id', id)
        .single();
      
      if (fetchError) throw new Error(fetchError.message);
      
      // Atualizar o status para pago
      const { error: updateError } = await supabase
        .from('payables')
        .update({ 
          status: 'paid', 
          payment_date: formattedDate 
        })
        .eq('id', id);
      
      if (updateError) throw new Error(updateError.message);
      
      // Registrar a transação
      if (payable) {
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert([{
            description: `Pagamento: ${payable.description}`,
            type: 'expense',
            amount: payable.amount,
            transaction_date: formattedDate,
            reference_id: id,
            reference_type: 'payable'
          }]);
        
        if (transactionError) throw new Error(transactionError.message);
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payables'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Pagamento registrado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao registrar pagamento: ${error.message}`);
    }
  });

  // Excluir conta a pagar
  const deletePayable = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('payables')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payables'] });
      toast.success('Conta a pagar excluída com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir conta a pagar: ${error.message}`);
    }
  });
  
  return {
    addPayable,
    updatePayable,
    markAsPaid,
    deletePayable
  };
};

// Hook para gerenciar transações
export const useTransactionActions = () => {
  const queryClient = useQueryClient();
  
  // Adicionar transação
  const addTransaction = useMutation({
    mutationFn: async (values: TransactionFormValues) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert([values])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transação registrada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao registrar transação: ${error.message}`);
    }
  });

  // Excluir/reverter transação
  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transação excluída com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir transação: ${error.message}`);
    }
  });

  // Registrar estorno
  const registerRefund = useMutation({
    mutationFn: async ({ transaction, description }: { transaction: Transaction, description: string }) => {
      const today = new Date().toISOString().split('T')[0];
      
      // Criar transação de estorno (com valor oposto)
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          description: description || `Estorno: ${transaction.description}`,
          type: 'refund',
          amount: transaction.amount,
          transaction_date: today,
          reference_id: transaction.id,
          reference_type: 'transaction'
        }])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Estorno registrado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao registrar estorno: ${error.message}`);
    }
  });
  
  return {
    addTransaction,
    deleteTransaction,
    registerRefund
  };
};

// Hook para gerenciar categorias
export const useCategoryActions = () => {
  const queryClient = useQueryClient();
  
  // Adicionar categoria
  const addCategory = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const { data, error } = await supabase
        .from('financial_categories')
        .insert([values])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialCategories'] });
      toast.success('Categoria adicionada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar categoria: ${error.message}`);
    }
  });

  // Atualizar categoria
  const updateCategory = useMutation({
    mutationFn: async ({ id, values }: { id: string, values: Partial<FinancialCategory> }) => {
      const { data, error } = await supabase
        .from('financial_categories')
        .update(values)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialCategories'] });
      toast.success('Categoria atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar categoria: ${error.message}`);
    }
  });

  // Excluir categoria
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('financial_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialCategories'] });
      toast.success('Categoria excluída com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir categoria: ${error.message}`);
    }
  });
  
  return {
    addCategory,
    updateCategory,
    deleteCategory
  };
};

// Hook para cálculos financeiros
export const useFinancialStats = () => {
  const { data: receivables = [], isLoading: isLoadingReceivables } = useReceivables();
  const { data: payables = [], isLoading: isLoadingPayables } = usePayables();
  const { data: transactions = [], isLoading: isLoadingTransactions } = useTransactions();
  
  const isLoading = isLoadingReceivables || isLoadingPayables || isLoadingTransactions;
  
  // Calcular estatísticas financeiras
  const stats = {
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
      if (item.type === 'refund') return sum - amount; // Estorno também é negativo
      return sum;
    }, 0)
  };
  
  return { stats, isLoading };
};
