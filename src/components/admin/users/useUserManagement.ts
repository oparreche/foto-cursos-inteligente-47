
import { User } from "../types";
import { useUserAuth } from "./useUserAuth";
import { useUserData } from "./useUserData";
import { useUserActions } from "./useUserActions";

export const useUserManagement = (initialUsers: User[] = []) => {
  // Gerenciar autenticação
  const { isAuthenticated, currentUserId } = useUserAuth();
  
  // Gerenciar dados de usuário
  const { users, setUsers, filteredUsers, searchTerm, setSearchTerm, isLoading } = useUserData(isAuthenticated, initialUsers);
  
  // Gerenciar ações de usuário
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditingUser,
    currentUser,
    handleUserSubmit,
    handleEditUser,
    handleDeleteUser,
    handleDialogClose,
    handleAddUser
  } = useUserActions(users, setUsers, isAuthenticated);

  // Retornar todas as funcionalidades necessárias
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
