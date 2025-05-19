
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
