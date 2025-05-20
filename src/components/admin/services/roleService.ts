
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Role, UserRole, RolePermission } from "../users/types";

// Assign admin role to a user
export async function assignDefaultAdminRole(userId: string) {
  try {
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: 'admin' });
    
    if (error) {
      throw error;
    }
    
    toast.success("Função de administrador atribuída com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao atribuir função de administrador:", error);
    toast.error("Erro ao atribuir função de administrador");
    return false;
  }
}

// Assign highest admin role (super_admin) to a user
export async function assignHighestAdminRole(userId: string) {
  try {
    const { error } = await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role: 'admin' });
    
    if (error) {
      throw error;
    }
    
    toast.success("Função de Administrador Máximo atribuída com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao atribuir função de administrador máximo:", error);
    toast.error("Erro ao atribuir função de administrador máximo");
    return false;
  }
}

// Get all available roles
export async function getRoles(): Promise<Role[]> {
  try {
    // Use type casting as a workaround for TypeScript limitations with Supabase client
    const { data, error } = await supabase
      .from('roles' as any)
      .select('*')
      .order('name');
    
    if (error) throw error;
    return (data as unknown as Role[]) || [];
  } catch (error) {
    console.error("Erro ao buscar funções:", error);
    toast.error("Erro ao carregar funções");
    return [];
  }
}

// Get user's roles
export async function getUserRoles(userId: string): Promise<UserRole[]> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar funções do usuário:", error);
    toast.error("Erro ao carregar funções do usuário");
    return [];
  }
}

// Assign role to user
export async function assignRoleToUser(userId: string, role: string): Promise<boolean> {
  try {
    // Use type casting as a workaround for TypeScript limitations
    const { error } = await supabase
      .from('user_roles')
      .upsert({ 
        user_id: userId, 
        role: role 
      } as any);
    
    if (error) throw error;
    toast.success("Função atribuída com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao atribuir função:", error);
    toast.error("Erro ao atribuir função");
    return false;
  }
}

// Remove role from user
export async function removeRoleFromUser(userRoleId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', userRoleId);
    
    if (error) throw error;
    toast.success("Função removida com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao remover função:", error);
    toast.error("Erro ao remover função");
    return false;
  }
}

// Get role permissions
export async function getRolePermissions(role: string): Promise<RolePermission[]> {
  try {
    // Use type casting as a workaround for TypeScript limitations
    const { data, error } = await supabase
      .from('role_permissions' as any)
      .select('*')
      .eq('role', role)
      .order('module');
    
    if (error) throw error;
    return (data as unknown as RolePermission[]) || [];
  } catch (error) {
    console.error("Erro ao buscar permissões:", error);
    toast.error("Erro ao carregar permissões");
    return [];
  }
}

// Update role permission
export async function updateRolePermission(
  role: string, 
  module: string, 
  permissionType: 'can_view' | 'can_create' | 'can_edit' | 'can_delete', 
  value: boolean
): Promise<boolean> {
  try {
    // Use type casting as a workaround for TypeScript limitations
    const { error } = await supabase
      .from('role_permissions' as any)
      .update({ [permissionType]: value })
      .eq('role', role)
      .eq('module', module);
    
    if (error) throw error;
    toast.success("Permissão atualizada com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar permissão:", error);
    toast.error("Erro ao atualizar permissão");
    return false;
  }
}
