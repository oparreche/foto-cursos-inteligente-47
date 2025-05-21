
import React from 'react';
import { Control } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DiscountCouponFormValues } from '@/types/enrollment';
import { supabase } from '@/integrations/supabase/client';

interface CouponFormCourseSelectorProps {
  control: Control<DiscountCouponFormValues>;
}

const CouponFormCourseSelector: React.FC<CouponFormCourseSelectorProps> = ({ control }) => {
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
    <FormField
      control={control}
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
  );
};

export default CouponFormCourseSelector;
