
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function findUserByEmail(email: string): Promise<string | undefined> {
  try {
    // Use explicit type annotation and maybeSingle() instead of generic response type
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking for existing user:', error);
      return undefined;
    }
    
    return data?.id;
  } catch (error) {
    console.error('Error in findUserByEmail:', error);
    return undefined;
  }
}

// Define a type for additional user data
export type UserAdditionalData = {
  cpf: string;
  birthDate: string;
  phone: string;
  address: string;
  addressNumber: string;
  addressComplement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
};

export async function createUser(
  email: string, 
  firstName: string, 
  lastName: string, 
  additionalData: UserAdditionalData
): Promise<string | undefined> {
  try {
    // Create new user account with auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: Math.random().toString(36).slice(2, 10) + 'X1!', // Random secure password
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });
    
    if (authError) {
      throw new Error(`Authentication error: ${authError.message}`);
    }
    
    const userId = authData.user?.id;
    
    if (!userId) {
      throw new Error('Failed to create user account');
    }
    
    // Update complete profile information
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        cpf: additionalData.cpf,
        birth_date: additionalData.birthDate,
        phone: additionalData.phone,
        address: additionalData.address,
        address_number: additionalData.addressNumber,
        address_complement: additionalData.addressComplement || null,
        neighborhood: additionalData.neighborhood,
        city: additionalData.city,
        state: additionalData.state,
        postal_code: additionalData.postalCode
      })
      .eq('id', userId);
      
    if (profileError) {
      throw new Error(`Profile update error: ${profileError.message}`);
    }
    
    return userId;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error creating user';
    console.error('Error in createUser:', errorMessage);
    toast.error(errorMessage);
    return undefined;
  }
}
