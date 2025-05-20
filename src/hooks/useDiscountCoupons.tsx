
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DiscountCoupon, DiscountCouponFormValues } from '@/types/enrollment';

// Hook para buscar todos os cupons de desconto
export const useDiscountCoupons = () => {
  return useQuery({
    queryKey: ['discount_coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discount_coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data as DiscountCoupon[];
    },
  });
};

// Hook para gerenciar ações de cupons de desconto (adicionar, atualizar, excluir)
export const useDiscountCouponActions = () => {
  const queryClient = useQueryClient();

  // Adicionar cupom
  const addCoupon = useMutation({
    mutationFn: async (values: DiscountCouponFormValues) => {
      // Garantir que valores numéricos sejam convertidos
      const parsedValues = {
        ...values,
        discount_value: typeof values.discount_value === 'string' 
          ? parseFloat(values.discount_value) 
          : values.discount_value,
        max_uses: values.max_uses && typeof values.max_uses === 'string' 
          ? parseInt(values.max_uses) 
          : values.max_uses,
        minimum_purchase: values.minimum_purchase && typeof values.minimum_purchase === 'string' 
          ? parseFloat(values.minimum_purchase) 
          : values.minimum_purchase
      };

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
      toast.error(`Erro ao criar cupom: ${error.message}`);
    }
  });

  // Atualizar cupom
  const updateCoupon = useMutation({
    mutationFn: async ({ id, values }: { id: string, values: Partial<DiscountCouponFormValues> }) => {
      // Garantir que valores numéricos sejam convertidos
      const parsedValues: any = { ...values };
      
      if (values.discount_value !== undefined) {
        parsedValues.discount_value = typeof values.discount_value === 'string' 
          ? parseFloat(values.discount_value) 
          : values.discount_value;
      }
      
      if (values.max_uses !== undefined) {
        parsedValues.max_uses = typeof values.max_uses === 'string' 
          ? parseInt(values.max_uses) 
          : values.max_uses;
      }
      
      if (values.minimum_purchase !== undefined) {
        parsedValues.minimum_purchase = typeof values.minimum_purchase === 'string' 
          ? parseFloat(values.minimum_purchase) 
          : values.minimum_purchase;
      }

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
      toast.error(`Erro ao atualizar cupom: ${error.message}`);
    }
  });

  // Excluir cupom
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
      toast.error(`Erro ao excluir cupom: ${error.message}`);
    }
  });

  // Verificar cupom
  const verifyCoupon = useMutation({
    mutationFn: async ({ code, courseId, amount }: { code: string, courseId?: string, amount?: number }) => {
      const { data, error } = await supabase
        .from('discount_coupons')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .lte('valid_from', new Date().toISOString())
        .or(`valid_until.is.null,valid_until.gte.${new Date().toISOString()}`)
        .single();

      if (error) throw new Error('Cupom inválido ou expirado');
      
      const coupon = data as DiscountCoupon;
      
      // Verificar se o cupom atingiu o limite de usos
      if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
        throw new Error('Este cupom já atingiu o limite de usos');
      }
      
      // Verificar se o cupom é para um curso específico
      if (coupon.course_id && courseId && coupon.course_id !== courseId) {
        throw new Error('Este cupom não é válido para este curso');
      }
      
      // Verificar se atinge o valor mínimo
      if (coupon.minimum_purchase && amount && amount < coupon.minimum_purchase) {
        throw new Error(`O valor mínimo para este cupom é de R$ ${coupon.minimum_purchase.toFixed(2)}`);
      }
      
      return coupon;
    },
    onError: (error) => {
      toast.error(`Erro ao verificar cupom: ${error.message}`);
    }
  });

  return {
    addCoupon,
    updateCoupon,
    deleteCoupon,
    verifyCoupon
  };
};
