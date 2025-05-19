
import { useState, useEffect } from "react";
import { User } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useUserData(isAuthenticated: boolean, initialUsers: User[] = []) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar usuários do Supabase
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

  // Filtrar usuários com base no termo de pesquisa
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { users, setUsers, filteredUsers, searchTerm, setSearchTerm, isLoading };
}
