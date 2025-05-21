
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDiscountCouponActions } from '@/hooks/useDiscountCoupons';
import { ManualEnrollmentFormValues } from '@/types/enrollment';

const EnrollmentFormCouponApplier: React.FC = () => {
  const [couponCode, setCouponCode] = useState("");
  const form = useFormContext<ManualEnrollmentFormValues>();
  
  // Buscar cupons de desconto disponíveis
  const { data: coupons } = useQuery({
    queryKey: ['active_coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discount_coupons')
        .select('*')
        .eq('is_active', true)
        .lte('valid_from', new Date().toISOString())
        .or(`valid_until.is.null,valid_until.gte.${new Date().toISOString()}`)
        .order('code');
      
      if (error) throw new Error(error.message);
      return data;
    }
  });

  // Usar a mutation de verificação de cupom
  const { verifyCoupon } = useDiscountCouponActions();
  
  // Função para calcular o desconto baseado no cupom
  const calculateDiscount = (originalAmount: number, coupon: any) => {
    let discountValue = 0;
    
    if (coupon.discount_type === 'percentage') {
      discountValue = (originalAmount * coupon.discount_value) / 100;
    } else {
      discountValue = coupon.discount_value;
    }
    
    // Garantir que o desconto não seja maior que o valor original
    discountValue = Math.min(discountValue, originalAmount);
    
    form.setValue('discount_amount', discountValue);
    form.setValue('payment_amount', originalAmount - discountValue);
    form.setValue('coupon_id', coupon.id);
  };

  // Função para verificar e aplicar um cupom
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      const originalAmount = parseFloat(form.getValues('original_amount')?.toString() || '0');
      const selectedClassId = form.getValues('class_id');
      
      if (!originalAmount || !selectedClassId) {
        alert('Selecione uma turma antes de aplicar um cupom');
        return;
      }
      
      // Encontrar o curso associado à turma
      let courseId = '';
      if (selectedClassId) {
        const { data, error } = await supabase
          .from('classes')
          .select('course_name')
          .eq('id', selectedClassId)
          .single();
          
        if (!error && data) {
          // Precisamos buscar o course_id baseado no nome do curso
          const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('id')
            .eq('name', data.course_name)
            .single();
          
          if (!courseError && courseData) {
            courseId = courseData.id;
          }
        }
      }
      
      // Verificar o cupom
      const couponResult = await verifyCoupon.mutateAsync({
        code: couponCode,
        courseId: courseId || undefined,
        amount: originalAmount
      });
      
      // Aplicar o desconto
      if (couponResult) {
        calculateDiscount(originalAmount, couponResult);
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao aplicar o cupom');
    }
  };

  return (
    <div className="border p-4 rounded-md">
      <h3 className="font-medium mb-3">Aplicar Cupom de Desconto</h3>
      
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Código do cupom"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          disabled={!form.watch('class_id') || !form.watch('original_amount')}
        />
        <Button 
          type="button" 
          onClick={handleApplyCoupon}
          variant="secondary"
          disabled={!couponCode.trim() || !form.watch('class_id') || !form.watch('original_amount')}
        >
          Aplicar
        </Button>
      </div>

      {/* Exibir cupom aplicado */}
      {form.watch('coupon_id') && (
        <div className="text-sm">
          <p className="font-medium">Cupom aplicado: {coupons?.find(c => c.id === form.watch('coupon_id'))?.code}</p>
        </div>
      )}
    </div>
  );
};

export default EnrollmentFormCouponApplier;
