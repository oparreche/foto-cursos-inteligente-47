
import { useState, useEffect } from "react";
import { User } from "../types";
import { toast } from "sonner";
import { UserFormValues } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const useUserManagement = (initialUsers: User[]) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
      if (session?.user) {
        setCurrentUserId(session.user.id);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
      if (session?.user) {
        setCurrentUserId(session.user.id);
      } else {
        setCurrentUserId(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        // Carregar todos os perfis com suas funções
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profileError) throw profileError;

        // Buscar todas as funções de usuários
        const { data: userRoles, error: roleError } = await supabase
          .from('user_roles')
          .select('*');

        if (roleError) throw roleError;
        
        // Mapear os perfis e funções para o formato User
        const mappedUsers: User[] = profiles.map(profile => {
          // Encontrar a função do usuário
          const userRole = userRoles?.find(role => role.user_id === profile.id);
          
          return {
            id: parseInt(profile.id.toString().substring(0, 8), 16),
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Usuário sem nome',
            email: profile.id, // Usando ID como email por enquanto
            role: userRole?.role || "viewer",
            status: profile.is_active ? "active" : "inactive",
            createdAt: new Date(profile.created_at),
            lastLogin: new Date() // Placeholder
          };
        });
        
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        toast.error("Erro ao carregar usuários");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [isAuthenticated]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            .insert([{ user_id: currentUser.email, role: values.role }]);
            
          if (insertError) throw insertError;
        } else if (existingRole.role !== values.role) {
          // Atualizar função existente
          const { error: updateError } = await supabase
            .from('user_roles')
            .update({ role: values.role })
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
        // Em uma implementação real, você criaria um novo usuário em auth.users
        // e depois criaria um perfil para ele
        
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
          .insert([{ user_id: values.email, role: values.role }]);
          
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
    users,
    filteredUsers,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditingUser,
    currentUser,
    isLoading,
    isAuthenticated,
    currentUserId,
    handleUserSubmit,
    handleEditUser,
    handleDeleteUser,
    handleDialogClose,
    handleAddUser
  };
};
