
import { useState } from "react";
import { User } from "../types";
import { toast } from "sonner";
import { UserFormValues } from "./types";

export const useUserManagement = (initialUsers: User[]) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSubmit = (values: UserFormValues) => {
    if (isEditingUser && currentUser) {
      // Atualizar usuário existente
      setUsers(
        users.map((user) =>
          user.id === currentUser.id
            ? { ...user, name: values.name, email: values.email, role: values.role }
            : user
        )
      );
      toast.success("Usuário atualizado com sucesso!");
    } else {
      // Adicionar novo usuário
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
    handleDialogClose();
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsEditingUser(true);
    setIsAddDialogOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("Usuário excluído com sucesso!");
    }
  };

  const handleDialogClose = () => {
    setCurrentUser(null);
    setIsEditingUser(false);
    setIsAddDialogOpen(false);
  };

  const handleAddUser = () => {
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
    handleUserSubmit,
    handleEditUser,
    handleDeleteUser,
    handleDialogClose,
    handleAddUser
  };
};
