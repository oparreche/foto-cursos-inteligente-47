
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Payable, PayableFormValues } from '@/types/finance';

// Hook for managing payables
export const usePayableActions = () => {
  const queryClient = useQueryClient();
  
  // Add payable
  const addPayable = useMutation({
    mutationFn: async (values: PayableFormValues) => {
      // Ensure payment_date is null for pending accounts
      const dataToInsert = values.status === 'paid' 
        ? { ...values } 
        : { ...values, payment_date: null };
      
      // Ensure amount is a number
      const parsedValues = {
        ...dataToInsert,
        amount: typeof dataToInsert.amount === 'string' 
          ? parseFloat(dataToInsert.amount) 
          : dataToInsert.amount
      };
      
      const { data, error } = await supabase
        .from('payables')
        .insert(parsedValues)
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

  // Update payable
  const updatePayable = useMutation({
    mutationFn: async ({ id, values }: { id: string, values: Partial<Payable> }) => {
      // Ensure amount is a number if it's present in the values
      const parsedValues = values.amount !== undefined ? {
        ...values,
        amount: typeof values.amount === 'string' 
          ? parseFloat(values.amount) 
          : values.amount
      } : values;
      
      const { data, error } = await supabase
        .from('payables')
        .update(parsedValues)
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

  // Mark as paid
  const markAsPaid = useMutation({
    mutationFn: async ({ id, paymentDate = new Date() }: { id: string, paymentDate?: Date }) => {
      const formattedDate = paymentDate.toISOString().split('T')[0];
      
      const { data: payable, error: fetchError } = await supabase
        .from('payables')
        .select('amount, description')
        .eq('id', id)
        .single();
      
      if (fetchError) throw new Error(fetchError.message);
      
      // Update status to paid
      const { error: updateError } = await supabase
        .from('payables')
        .update({ 
          status: 'paid', 
          payment_date: formattedDate 
        })
        .eq('id', id);
      
      if (updateError) throw new Error(updateError.message);
      
      // Record transaction
      if (payable) {
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            description: `Pagamento: ${payable.description}`,
            type: 'expense',
            amount: payable.amount,
            transaction_date: formattedDate,
            reference_id: id,
            reference_type: 'payable'
          });
        
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

  // Delete payable
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
