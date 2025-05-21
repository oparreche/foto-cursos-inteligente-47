
import React from 'react';
import { Control } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ManualEnrollmentFormValues } from '@/types/enrollment';
import { supabase } from '@/integrations/supabase/client';

interface EnrollmentFormClassSelectorProps {
  control: Control<ManualEnrollmentFormValues>;
  disabled?: boolean;
}

const EnrollmentFormClassSelector: React.FC<EnrollmentFormClassSelectorProps> = ({ control, disabled }) => {
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

  return (
    <FormField
      control={control}
      name="class_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Turma*</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isLoadingClasses || disabled}
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
  );
};

export default EnrollmentFormClassSelector;
