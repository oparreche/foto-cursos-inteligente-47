
import React from 'react';
import { Control } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ManualEnrollmentFormValues } from '@/types/enrollment';
import { supabase } from '@/integrations/supabase/client';

interface EnrollmentFormStudentSelectorProps {
  control: Control<ManualEnrollmentFormValues>;
  disabled?: boolean;
}

const EnrollmentFormStudentSelector: React.FC<EnrollmentFormStudentSelectorProps> = ({ control, disabled }) => {
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

  return (
    <FormField
      control={control}
      name="student_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Aluno*</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isLoadingStudents || disabled}
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
  );
};

export default EnrollmentFormStudentSelector;
