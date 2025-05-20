
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Receivable, ReceivableFormValues } from '@/types/finance';

// Hook for managing receivables
export const useReceivableActions = () => {
  const queryClient = useQueryClient();
  
  // Add receivable
  const addReceivable = useMutation({
    mutationFn: async (values: ReceivableFormValues) => {
      // Ensure payment_date is null for pending accounts
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

  // Update receivable
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

  // Mark as paid
  const markAsPaid = useMutation({
    mutationFn: async ({ id, paymentDate = new Date() }: { id: string, paymentDate?: Date }) => {
      const formattedDate = paymentDate.toISOString().split('T')[0];
      
      const { data: receivable, error: fetchError } = await supabase
        .from('receivables')
        .select('amount, description')
        .eq('id', id)
        .single();
      
      if (fetchError) throw new Error(fetchError.message);
      
      // Update status to paid
      const { error: updateError } = await supabase
        .from('receivables')
        .update({ 
          status: 'paid', 
          payment_date: formattedDate 
        })
        .eq('id', id);
      
      if (updateError) throw new Error(updateError.message);
      
      // Record transaction
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

  // Delete receivable
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
