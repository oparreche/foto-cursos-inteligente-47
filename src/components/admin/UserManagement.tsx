
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { User } from "./types";
import UserSearchBar from "./users/UserSearchBar";
import UserTable from "./users/UserTable";
import UserDialog from "./users/UserDialog";
import { useUserManagement } from "./users/useUserManagement";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const UserManagement = () => {
  // Dados iniciais de exemplo - em um app real, estes viriam de uma API
  const initialUsers: User[] = [
    {
      id: 1,
      name: "Admin Principal",
      email: "admin@escola.com",
      role: "admin",
      status: "active",
      createdAt: new Date("2025-01-15"),
      lastLogin: new Date("2025-05-05")
    },
    {
      id: 2,
      name: "João Instrutor",
      email: "joao@escola.com",
      role: "instructor",
      status: "active",
      createdAt: new Date("2025-02-10"),
      lastLogin: new Date("2025-05-04")
    },
    {
      id: 3,
      name: "Maria Visualizadora",
      email: "maria@escola.com",
      role: "viewer",
      status: "active",
      createdAt: new Date("2025-03-21"),
      lastLogin: new Date("2025-05-01")
    }
  ];

  const {
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
    handleAddUser
  } = useUserManagement(initialUsers);

  return (
    <div className="space-y-6">
      {!isAuthenticated && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Autenticação necessária</AlertTitle>
          <AlertDescription>
            Você precisa estar logado para gerenciar usuários.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <UserSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddUser} className="gap-2">
              <Plus className="h-4 w-4" /> Novo Usuário
            </Button>
          </DialogTrigger>
          
          <UserDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSubmit={handleUserSubmit}
            currentUser={currentUser}
            isEditing={isEditingUser}
          />
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-16" />
          ))}
        </div>
      ) : (
        <UserTable
          users={filteredUsers}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default UserManagement;
