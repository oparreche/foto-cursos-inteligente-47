
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ManualEnrollment, ManualEnrollmentFormValues } from '@/types/enrollment';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDiscountCouponActions } from '@/hooks/useDiscountCoupons';

const enrollmentSchema = z.object({
  student_id: z.string().uuid('ID do estudante inválido'),
  class_id: z.string().uuid('ID da turma inválido'),
  payment_status: z.enum(['pending', 'paid', 'overdue', 'canceled']),
  coupon_id: z.string().optional(),
  payment_amount: z.union([z.string(), z.number()])
    .transform(val => typeof val === 'string' ? parseFloat(val) : val)
    .refine(val => val >= 0, 'O valor deve ser maior ou igual a zero'),
  original_amount: z.union([z.string(), z.number()])
    .transform(val => typeof val === 'string' ? parseFloat(val) : val)
    .refine(val => val > 0, 'O valor deve ser maior que zero'),
  discount_amount: z.union([z.string(), z.number()]).optional()
    .transform(val => typeof val === 'string' && val ? parseFloat(val) : val)
    .refine(val => val === undefined || val === null || val >= 0, 'O valor do desconto deve ser maior ou igual a zero'),
  notes: z.string().optional(),
});

interface EnrollmentFormProps {
  initialData?: ManualEnrollment;
  onSubmit: (values: ManualEnrollmentFormValues) => void;
  isSubmitting: boolean;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ 
  initialData, 
  onSubmit, 
  isSubmitting 
}) => {
  const [couponCode, setCouponCode] = useState("");
  
  const form = useForm<ManualEnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: initialData || {
      student_id: '',
      class_id: '',
      payment_status: 'pending',
      payment_amount: '',
      original_amount: '',
      discount_amount: 0,
      notes: ''
    }
  });

  // Buscar alunos (usuários)
  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name');
      
      // Buscar emails dos usuários
      if (profiles && !error) {
        const userIds = profiles.map((profile: any) => profile.id);
        const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
        
        if (!usersError && users) {
          return profiles.map((profile: any) => {
            const user = users.users.find((u: any) => u.id === profile.id);
            return {
              id: profile.id,
              email: user?.email || '',
              name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user?.email || ''
            };
          });
        }
      }
      
      if (error) throw new Error(error.message);
      return [];
    }
  });

  // Buscar turmas disponíveis
  const { data: classes, isLoading: isLoadingClasses } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          id, 
          course_name, 
          period, 
          days,
          spots_available,
          total_spots,
          price
        `)
        .eq('is_active', true)
        .gt('spots_available', 0);
      
      if (error) throw new Error(error.message);
      return data;
    }
  });

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

  // Quando a turma é selecionada, atualizar o valor original
  useEffect(() => {
    const selectedClassId = form.watch('class_id');
    if (selectedClassId && classes) {
      const selectedClass = classes.find(c => c.id === selectedClassId);
      if (selectedClass) {
        const originalAmount = parseFloat(selectedClass.price);
        form.setValue('original_amount', originalAmount);
        form.setValue('payment_amount', originalAmount);
        form.setValue('discount_amount', 0);
        
        // Se houver cupom aplicado, recalcular o desconto
        const couponId = form.watch('coupon_id');
        if (couponId && coupons) {
          const selectedCoupon = coupons.find(c => c.id === couponId);
          if (selectedCoupon) {
            calculateDiscount(originalAmount, selectedCoupon);
          }
        }
      }
    }
  }, [form.watch('class_id'), classes]);

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
      if (selectedClassId && classes) {
        const selectedClass = classes.find(c => c.id === selectedClassId);
        if (selectedClass) {
          // Precisamos buscar o course_id baseado no nome do curso
          const { data, error } = await supabase
            .from('courses')
            .select('id')
            .eq('name', selectedClass.course_name)
            .single();
          
          if (!error && data) {
            courseId = data.id;
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="student_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aluno*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingStudents || !!initialData}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um aluno" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {students?.map((student: any) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="class_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turma*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingClasses || !!initialData}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma turma" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classes?.map((classItem: any) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.course_name} - {classItem.period} ({classItem.days}) - R$ {parseFloat(classItem.price).toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="original_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Original*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value}
                    type="number"
                    step="0.01"
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do Desconto</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || 0}
                    type="number"
                    step="0.01"
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Final*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value}
                    type="number"
                    step="0.01"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="payment_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status do Pagamento*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="overdue">Vencido</SelectItem>
                  <SelectItem value="canceled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Observações adicionais" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : (initialData ? 'Atualizar Matrícula' : 'Realizar Matrícula')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EnrollmentForm;
