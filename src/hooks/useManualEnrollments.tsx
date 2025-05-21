
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EnrollmentWithDetails, ManualEnrollment, ManualEnrollmentFormValues } from '@/types/enrollment';

// Hook para buscar todas as matrículas manuais
export const useManualEnrollments = () => {
  return useQuery({
    queryKey: ['manual_enrollments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manual_enrollments')
        .select(`
          *,
          student:student_id(id, email),
          class:class_id(id, course_name, period, days),
          coupon:coupon_id(id, code, discount_value, discount_type)
        `)
        .order('enrollment_date', { ascending: false });

      if (error) throw new Error(error.message);
      
      // Formatar os dados para a interface EnrollmentWithDetails
      const formattedData = data.map((item: any) => ({
        ...item,
        student_name: item.student?.email || 'Usuário não encontrado',
        class_name: item.class ? `${item.class.course_name} - ${item.class.period} (${item.class.days})` : 'Turma não encontrada',
        course_name: item.class?.course_name || 'Curso não encontrado',
        coupon_code: item.coupon?.code || ''
      }));
      
      return formattedData as EnrollmentWithDetails[];
    },
  });
};

// Hook para buscar uma matrícula específica pelo ID
export const useManualEnrollment = (id: string | undefined) => {
  return useQuery({
    queryKey: ['manual_enrollment', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('manual_enrollments')
        .select(`
          *,
          student:student_id(id, email),
          class:class_id(id, course_name, period, days),
          coupon:coupon_id(id, code, discount_value, discount_type)
        `)
        .eq('id', id)
        .single();

      if (error) throw new Error(error.message);
      
      // Tratamento seguro para acessar student.email com verificação de tipos
      const studentData = data.student as { email?: string } | null;
      const student_name = studentData && studentData.email ? studentData.email : 'Usuário não encontrado';
      
      return {
        ...data,
        student_name,
        class_name: data.class ? `${data.class.course_name} - ${data.class.period} (${data.class.days})` : '',
        course_name: data.class?.course_name,
        coupon_code: data.coupon?.code
      } as EnrollmentWithDetails;
    },
    enabled: !!id,
  });
};

// Hook para gerenciar ações de matrículas manuais
export const useManualEnrollmentActions = () => {
  const queryClient = useQueryClient();

  // Adicionar matrícula
  const addEnrollment = useMutation({
    mutationFn: async (values: ManualEnrollmentFormValues) => {
      // Obter o ID do usuário autenticado para usar como created_by
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Usuário não autenticado');
      
      // Garantir que valores numéricos sejam convertidos corretamente
      const parsedValues = {
        student_id: values.student_id,
        class_id: values.class_id,
        payment_status: values.payment_status,
        coupon_id: values.coupon_id || null,
        payment_amount: typeof values.payment_amount === 'string' 
          ? parseFloat(values.payment_amount) 
          : values.payment_amount,
        original_amount: typeof values.original_amount === 'string' 
          ? parseFloat(values.original_amount) 
          : values.original_amount,
        discount_amount: values.discount_amount === undefined ? 0 : (
          typeof values.discount_amount === 'string' && values.discount_amount !== '' 
            ? parseFloat(values.discount_amount) 
            : (typeof values.discount_amount === 'number' ? values.discount_amount : 0)
        ),
        notes: values.notes || '',
        created_by: user.id
      };

      const { data, error } = await supabase
        .from('manual_enrollments')
        .insert(parsedValues)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manual_enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] }); // Atualizar também as turmas (spots_available)
      toast.success('Matrícula realizada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao realizar matrícula: ${error.message}`);
    }
  });

  // Atualizar matrícula
  const updateEnrollment = useMutation({
    mutationFn: async ({ id, values }: { id: string, values: Partial<ManualEnrollmentFormValues> }) => {
      // Garantir que valores numéricos sejam convertidos
      const parsedValues: any = { ...values };
      
      if (values.payment_amount !== undefined) {
        parsedValues.payment_amount = typeof values.payment_amount === 'string' 
          ? parseFloat(values.payment_amount) 
          : values.payment_amount;
      }
      
      if (values.original_amount !== undefined) {
        parsedValues.original_amount = typeof values.original_amount === 'string' 
          ? parseFloat(values.original_amount) 
          : values.original_amount;
      }
      
      if (values.discount_amount !== undefined) {
        parsedValues.discount_amount = typeof values.discount_amount === 'string' && values.discount_amount !== ''
          ? parseFloat(values.discount_amount) 
          : (typeof values.discount_amount === 'number' ? values.discount_amount : 0);
      }

      const { data, error } = await supabase
        .from('manual_enrollments')
        .update(parsedValues)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manual_enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] }); // Atualizar também as turmas (spots_available)
      toast.success('Matrícula atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar matrícula: ${error.message}`);
    }
  });

  // Cancelar matrícula
  const cancelEnrollment = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('manual_enrollments')
        .update({ payment_status: 'canceled' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manual_enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] }); // Atualizar também as turmas (spots_available)
      toast.success('Matrícula cancelada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao cancelar matrícula: ${error.message}`);
    }
  });

  return {
    addEnrollment,
    updateEnrollment,
    cancelEnrollment
  };
};
