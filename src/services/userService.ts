
import { supabase } from '@/integrations/supabase/client';

export async function findUserByEmail(email: string): Promise<string | undefined> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (error) throw error;
    return data?.id;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return undefined;
  }
}
