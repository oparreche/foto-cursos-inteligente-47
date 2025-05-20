
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Assigns the highest admin role to the first user
 * Fixed to handle user_role as an enum type instead of text
 */
export const assignHighestAdminRole = async (userId: string): Promise<boolean> => {
  try {
    console.log("Nenhum papel existe, atribuindo papel de admin ao primeiro usuário");
    
    // Primeiro criar uma entrada na tabela de roles
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'super_admin' // Ensure this is cast properly to the enum type
      });
    
    if (roleError) {
      console.error("Erro ao atribuir função de administrador:", roleError);
      toast.error("Não foi possível definir papel de administrador");
      return false;
    }
    
    toast.success("Função de administrador atribuída com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao atribuir função de administrador máximo:", error);
    toast.error("Erro ao definir papel de administrador");
    return false;
  }
};

/**
 * Assigns the default admin role to a user
 */
export const assignDefaultAdminRole = async (userId: string): Promise<boolean> => {
  try {
    console.log("Atribuindo papel de administrador padrão ao usuário");
    
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'admin' // Regular admin role
      });
    
    if (roleError) {
      console.error("Erro ao atribuir função de administrador padrão:", roleError);
      toast.error("Não foi possível definir papel de administrador");
      return false;
    }
    
    toast.success("Função de administrador atribuída com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao atribuir função de administrador padrão:", error);
    toast.error("Erro ao definir papel de administrador");
    return false;
  }
};

/**
 * Check if a user has a specific role
 */
export const hasRole = async (userId: string, role: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error("Erro ao verificar papel do usuário:", error);
      return false;
    }
    
    return data?.role === role;
  } catch (error) {
    console.error("Erro ao verificar papel do usuário:", error);
    return false;
  }
};
