
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

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
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
        // Fetch user profiles from the profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Map the data to match our User type
          const mappedUsers: User[] = data.map(profile => ({
            id: parseInt(profile.id.toString().replace(/-/g, "").substring(0, 9), 16),
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
            email: profile.id, // Using ID as a placeholder since email might not be in profiles table
            role: "viewer", // Default role
            status: profile.is_active ? "active" : "inactive",
            createdAt: new Date(profile.created_at),
            lastLogin: new Date() // Placeholder
          }));
          
          setUsers(mappedUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
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
        // Update user in Supabase
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: values.name.split(' ')[0],
            last_name: values.name.split(' ').slice(1).join(' '),
            is_active: true
          })
          .eq('id', currentUser.email); // Using email field to store the UUID
        
        if (error) throw error;
        
        // Update role if needed
        // Note: In a real implementation, you would update the user_roles table
        
        // Update local state
        setUsers(
          users.map((user) =>
            user.id === currentUser.id
              ? { ...user, name: values.name, email: values.email, role: values.role }
              : user
          )
        );
        toast.success("Usuário atualizado com sucesso!");
      } else {
        // In a real implementation, you would create a new user in auth.users
        // and then create a profile for them
        
        // Create a profile in Supabase
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            id: values.email, // Using email as the ID for simplicity
            first_name: values.name.split(' ')[0],
            last_name: values.name.split(' ').slice(1).join(' '),
            is_active: true
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Add role if needed
        // Note: In a real implementation, you would insert into the user_roles table
        
        // Add to local state
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
      console.error("Error handling user:", error);
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
        
        // Delete user from Supabase
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userToDelete.email); // Using email field to store the UUID
        
        if (error) throw error;
        
        // Update local state
        setUsers(users.filter((user) => user.id !== userId));
        toast.success("Usuário excluído com sucesso!");
      } catch (error: any) {
        console.error("Error deleting user:", error);
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
    handleUserSubmit,
    handleEditUser,
    handleDeleteUser,
    handleDialogClose,
    handleAddUser
  };
};
