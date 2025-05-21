
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DiscountCouponFormValues } from '@/types/enrollment';

// Hook for managing coupon operations (add, update, delete)
export const useCouponActions = () => {
  const queryClient = useQueryClient();

  // Add coupon
  const addCoupon = useMutation({
    mutationFn: async (values: DiscountCouponFormValues) => {
      // Ensure numeric values are properly parsed
      const parsedValues = {
        code: values.code,
        description: values.description,
        discount_type: values.discount_type,
        discount_value: typeof values.discount_value === 'string' 
          ? parseFloat(values.discount_value) 
          : values.discount_value,
        max_uses: values.max_uses !== undefined 
          ? (typeof values.max_uses === 'string' && values.max_uses !== '' 
              ? parseInt(values.max_uses) 
              : values.max_uses as number | null)
          : null,
        valid_from: values.valid_from,
        valid_until: values.valid_until || null,
        is_active: values.is_active ?? true,
        course_id: values.course_id || null,
        minimum_purchase: values.minimum_purchase !== undefined 
          ? (typeof values.minimum_purchase === 'string' && values.minimum_purchase !== '' 
              ? parseFloat(values.minimum_purchase) 
              : values.minimum_purchase as number | null)
          : 0
      };

      console.log("Adding coupon with values:", parsedValues);

      const { data, error } = await supabase
        .from('discount_coupons')
        .insert(parsedValues)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discount_coupons'] });
      toast.success('Cupom de desconto criado com sucesso!');
    },
    onError: (error) => {
      console.error("Error creating coupon:", error);
      toast.error(`Erro ao criar cupom: ${error.message}`);
    }
  });

  // Update coupon
  const updateCoupon = useMutation({
    mutationFn: async ({ id, values }: { id: string, values: Partial<DiscountCouponFormValues> }) => {
      // Parse numeric values
      const parsedValues: any = { ...values };
      
      if (values.discount_value !== undefined) {
        parsedValues.discount_value = typeof values.discount_value === 'string' 
          ? parseFloat(values.discount_value) 
          : values.discount_value;
      }
      
      if (values.max_uses !== undefined) {
        parsedValues.max_uses = typeof values.max_uses === 'string' && values.max_uses !== ''
          ? parseInt(values.max_uses) 
          : values.max_uses;
        
        if (parsedValues.max_uses === '') {
          parsedValues.max_uses = null;
        }
      }
      
      if (values.minimum_purchase !== undefined) {
        parsedValues.minimum_purchase = typeof values.minimum_purchase === 'string' && values.minimum_purchase !== ''
          ? parseFloat(values.minimum_purchase) 
          : values.minimum_purchase;
          
        if (parsedValues.minimum_purchase === '') {
          parsedValues.minimum_purchase = null;
        }
      }

      // Ensure course_id is handled properly
      if (values.course_id === '' || values.course_id === 'all_courses') {
        parsedValues.course_id = null;
      }

      console.log("Updating coupon with values:", parsedValues);

      const { data, error } = await supabase
        .from('discount_coupons')
        .update(parsedValues)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discount_coupons'] });
      toast.success('Cupom de desconto atualizado com sucesso!');
    },
    onError: (error) => {
      console.error("Error updating coupon:", error);
      toast.error(`Erro ao atualizar cupom: ${error.message}`);
    }
  });

  // Delete coupon
  const deleteCoupon = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('discount_coupons')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discount_coupons'] });
      toast.success('Cupom de desconto excluído com sucesso!');
    },
    onError: (error) => {
      console.error("Error deleting coupon:", error);
      toast.error(`Erro ao excluir cupom: ${error.message}`);
    }
  });

  return {
    addCoupon,
    updateCoupon,
    deleteCoupon
  };
};
