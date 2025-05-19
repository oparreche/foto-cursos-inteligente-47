
import { useState } from "react";
import { User } from "../types";
import { UserFormValues } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useUserActions(users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>, isAuthenticated: boolean) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleUserSubmit = async (values: UserFormValues) => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para gerenciar usuários");
      return;
    }
    
    try {
      if (isEditingUser && currentUser) {
        // Atualizar o perfil no Supabase
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: values.name.split(' ')[0],
            last_name: values.name.split(' ').slice(1).join(' '),
            is_active: true
          })
          .eq('id', currentUser.email);
        
        if (profileError) throw profileError;
        
        // Atualizar a função do usuário se necessário
        const { data: existingRole, error: roleCheckError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', currentUser.email)
          .single();
          
        if (roleCheckError && roleCheckError.code !== 'PGRST116') {
          throw roleCheckError;
        }
        
        if (!existingRole) {
          // Inserir nova função
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert({
              user_id: currentUser.email, 
              role: values.role 
            } as unknown as any);
            
          if (insertError) throw insertError;
        } else if (existingRole.role !== values.role) {
          // Atualizar função existente
          const { error: updateError } = await supabase
            .from('user_roles')
            .update({ role: values.role } as unknown as any)
            .eq('user_id', currentUser.email);
            
          if (updateError) throw updateError;
        }
        
        // Atualizar o estado local
        setUsers(
          users.map((user) =>
            user.id === currentUser.id
              ? { ...user, name: values.name, role: values.role }
              : user
          )
        );
        toast.success("Usuário atualizado com sucesso!");
      } else {
        // Criar um perfil no Supabase
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            id: values.email, // Usando email como ID por simplicidade
            first_name: values.name.split(' ')[0],
            last_name: values.name.split(' ').slice(1).join(' '),
            is_active: true
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Adicionar papel/função
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: values.email, 
            role: values.role 
          } as unknown as any);
          
        if (roleError) throw roleError;
        
        // Adicionar ao estado local
        const newUser: User = {
          id: Math.max(0, ...users.map((user) => user.id)) + 1,
          name: values.name,
          email: values.email,
          role: values.role,
          status: "active",
          createdAt: new Date(),
          lastLogin: new Date()
        };
        setUsers([...users, newUser]);
        toast.success("Usuário adicionado com sucesso!");
      }
    } catch (error: any) {
      console.error("Erro ao gerenciar usuário:", error);
      toast.error(`Erro: ${error.message}`);
    }
    
    handleDialogClose();
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsEditingUser(true);
    setIsAddDialogOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para excluir um usuário");
      return;
    }
    
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        const userToDelete = users.find(u => u.id === userId);
        if (!userToDelete) {
          throw new Error("Usuário não encontrado");
        }
        
        // Excluir a função do usuário primeiro
        const { error: roleError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userToDelete.email);
          
        if (roleError) throw roleError;
        
        // Excluir o usuário do Supabase
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userToDelete.email);
        
        if (profileError) throw profileError;
        
        // Atualizar o estado local
        setUsers(users.filter((user) => user.id !== userId));
        toast.success("Usuário excluído com sucesso!");
      } catch (error: any) {
        console.error("Erro ao excluir usuário:", error);
        toast.error(`Erro: ${error.message}`);
      }
    }
  };

  const handleDialogClose = () => {
    setCurrentUser(null);
    setIsEditingUser(false);
    setIsAddDialogOpen(false);
  };

  const handleAddUser = () => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para adicionar usuários");
      return;
    }
    
    setIsEditingUser(false);
    setCurrentUser(null);
    setIsAddDialogOpen(true);
  };

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditingUser,
    currentUser,
    handleUserSubmit,
    handleEditUser,
    handleDeleteUser,
    handleDialogClose,
    handleAddUser
  };
}
