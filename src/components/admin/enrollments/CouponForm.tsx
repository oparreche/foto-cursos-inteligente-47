
import React from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { DiscountCoupon, DiscountCouponFormValues } from '@/types/enrollment';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const couponSchema = z.object({
  code: z.string().min(3, 'O código deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  discount_type: z.enum(['percentage', 'fixed_amount']),
  discount_value: z.union([z.string(), z.number()])
    .transform(val => typeof val === 'string' ? parseFloat(val) : val)
    .refine(val => val > 0, 'O valor deve ser maior que zero'),
  max_uses: z.union([z.string(), z.number()]).optional()
    .transform(val => typeof val === 'string' && val ? parseInt(val) : val)
    .refine(val => !val || val > 0, 'O número máximo de usos deve ser maior que zero'),
  valid_from: z.string(),
  valid_until: z.string().optional(),
  is_active: z.boolean().default(true),
  course_id: z.string().optional(),
  minimum_purchase: z.union([z.string(), z.number()]).optional()
    .transform(val => typeof val === 'string' && val ? parseFloat(val) : val)
    .refine(val => !val || val >= 0, 'O valor mínimo de compra deve ser maior ou igual a zero')
});

interface CouponFormProps {
  initialData?: DiscountCoupon;
  onSubmit: (values: DiscountCouponFormValues) => void;
  isSubmitting: boolean;
}

const CouponForm: React.FC<CouponFormProps> = ({ 
  initialData, 
  onSubmit, 
  isSubmitting 
}) => {
  const form = useForm<DiscountCouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: initialData || {
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      max_uses: '',
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: '',
      is_active: true,
      course_id: '',
      minimum_purchase: ''
    }
  });

  // Buscar cursos disponíveis
  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, name')
        .eq('is_active', true);
      
      if (error) throw new Error(error.message);
      return data;
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código do Cupom*</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: DESCONTO20" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Ativo</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Descrição do cupom" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="discount_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Desconto*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de desconto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                    <SelectItem value="fixed_amount">Valor Fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do Desconto*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={form.watch('discount_type') === 'percentage' ? "Ex: 20" : "Ex: 50.00"}
                    type="number"
                    step={form.watch('discount_type') === 'percentage' ? "1" : "0.01"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="valid_from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Válido a partir de*</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valid_until"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Válido até</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="max_uses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Limite de Usos</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
                    placeholder="Ex: 100"
                    type="number"
                    min="1"
                    step="1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minimum_purchase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Mínimo de Compra</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
                    placeholder="Ex: 100.00"
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
          name="course_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curso Específico (opcional)</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Aplicável a todos os cursos" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Todos os cursos</SelectItem>
                  {courses?.map((course: any) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : (initialData ? 'Atualizar Cupom' : 'Criar Cupom')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CouponForm;
