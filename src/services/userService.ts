
import { supabase } from '@/integrations/supabase/client';

// Define custom types for our Supabase responses to avoid deep type inference
type ProfileResponse = {
  data: { id: string } | null;
  error: any;
};

/**
 * Finds a user by their email address
 */
export async function findUserByEmail(email: string): Promise<string | undefined> {
  try {
    // Use explicit type assertion to avoid deep type inference
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle() as ProfileResponse;
      
    if (error) {
      console.error('Error finding user by email:', error);
      return undefined;
    }
    
    return data?.id;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return undefined;
  }
}

// Define a type for insert response
type InsertResponse = {
  error: any;
};

/**
 * Creates a new user profile or returns existing user ID if found
 */
export async function createUser(
  email: string,
  firstName: string,
  lastName: string,
  profileData: {
    cpf?: string;
    birthDate?: string;
    phone?: string;
    address?: string;
    addressNumber?: string;
    addressComplement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  }
): Promise<string | undefined> {
  try {
    // First check if user already exists
    const existingUserId = await findUserByEmail(email);
    if (existingUserId) return existingUserId;
    
    // Generate a UUID for the new profile
    const profileId = crypto.randomUUID();
    
    // Use explicit type assertion to avoid deep type inference
    const { error } = await supabase
      .from('profiles')
      .insert([{
        id: profileId,
        email,
        first_name: firstName,
        last_name: lastName,
        cpf: profileData.cpf,
        birth_date: profileData.birthDate,
        phone: profileData.phone,
        address: profileData.address,
        address_number: profileData.addressNumber,
        address_complement: profileData.addressComplement,
        neighborhood: profileData.neighborhood,
        city: profileData.city,
        state: profileData.state,
        postal_code: profileData.postalCode
      }]) as InsertResponse;
    
    if (error) {
      console.error('Error creating user profile:', error);
      return undefined;
    }
    
    return profileId;
  } catch (error) {
    console.error('Error creating user:', error);
    return undefined;
  }
}
