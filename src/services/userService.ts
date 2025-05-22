
import { supabase } from '@/integrations/supabase/client';

/**
 * Finds a user by their email address
 */
export async function findUserByEmail(email: string): Promise<string | undefined> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
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
      }]);
    
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

/**
 * Retrieves a user profile by ID
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Updates a user profile
 */
export async function updateUserProfile(
  userId: string,
  profileData: {
    firstName?: string;
    lastName?: string;
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
) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        cpf: profileData.cpf,
        birth_date: profileData.birthDate,
        phone: profileData.phone,
        address: profileData.address,
        address_number: profileData.addressNumber,
        address_complement: profileData.addressComplement,
        neighborhood: profileData.neighborhood,
        city: profileData.city,
        state: profileData.state,
        postal_code: profileData.postalCode,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

/**
 * Checks if a user has a specific role
 */
export async function checkUserRole(userId: string, role: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', role)
      .maybeSingle();
      
    if (error) {
      console.error('Error checking user role:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}

/**
 * Assigns a role to a user
 */
export async function assignUserRole(userId: string, role: string): Promise<boolean> {
  try {
    // Check if the user already has this role
    const hasRole = await checkUserRole(userId, role);
    if (hasRole) return true;
    
    const { error } = await supabase
      .from('user_roles')
      .insert([{
        user_id: userId,
        role
      }]);
      
    if (error) {
      console.error('Error assigning role to user:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error assigning role to user:', error);
    return false;
  }
}
