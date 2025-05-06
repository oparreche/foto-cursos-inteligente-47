
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "./types";
import { Plus, Search, Trash, Edit, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UserManagement = () => {
  // Dados iniciais de exemplo - em um app real, estes viriam de uma API
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Admin Principal",
      email: "admin@escola.com",
      role: "admin",
      createdAt: new Date("2025-01-15"),
      lastLogin: new Date("2025-05-05")
    },
    {
      id: 2,
      name: "João Editor",
      email: "joao@escola.com",
      role: "editor",
      createdAt: new Date("2025-02-10"),
      lastLogin: new Date("2025-05-04")
    },
    {
      id: 3,
      name: "Maria Visualizadora",
      email: "maria@escola.com",
      role: "viewer",
      createdAt: new Date("2025-03-21"),
      lastLogin: new Date("2025-05-01")
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Formulário usando react-hook-form
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "viewer" as "admin" | "editor" | "viewer"
    }
  });

  // Filtrar usuários baseado no termo de busca
  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lidar com a adição ou edição de um usuário
  const handleUserSubmit = (values: { name: string; email: string; role: "admin" | "editor" | "viewer" }) => {
    if (isEditingUser && currentUser) {
      // Atualizar usuário existente
      setUsers(
        users.map(user =>
          user.id === currentUser.id
            ? { ...user, name: values.name, email: values.email, role: values.role }
            : user
        )
      );
      toast.success("Usuário atualizado com sucesso!");
    } else {
      // Adicionar novo usuário
      const newUser: User = {
        id: Math.max(...users.map(user => user.id)) + 1,
        name: values.name,
        email: values.email,
        role: values.role,
        createdAt: new Date(),
        lastLogin: new Date()
      };
      setUsers([...users, newUser]);
      toast.success("Usuário adicionado com sucesso!");
    }
    handleDialogClose();
  };

  // Lidar com a edição de um usuário
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsEditingUser(true);
    setIsAddDialogOpen(true);
  };

  // Lidar com a exclusão de um usuário
  const handleDeleteUser = (userId: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      setUsers(users.filter(user => user.id !== userId));
      toast.success("Usuário excluído com sucesso!");
    }
  };

  // Resetar e fechar o modal
  const handleDialogClose = () => {
    form.reset({
      name: "",
      email: "",
      role: "viewer"
    });
    setCurrentUser(null);
    setIsEditingUser(false);
    setIsAddDialogOpen(false);
  };

  // Abrir o diálogo para adicionar um novo usuário
  const handleAddUser = () => {
    setIsEditingUser(false);
    setCurrentUser(null);
    form.reset({
      name: "",
      email: "",
      role: "viewer"
    });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            className="pl-8 w-[300px]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddUser} className="gap-2">
              <Plus className="h-4 w-4" /> Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditingUser ? "Editar Usuário" : "Adicionar Novo Usuário"}
              </DialogTitle>
              <DialogDescription>
                {isEditingUser
                  ? "Altere os detalhes do usuário e clique em salvar."
                  : "Preencha os detalhes do novo usuário."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUserSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do usuário" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Função</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a função" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Visualizador</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {isEditingUser ? "Salvar" : "Adicionar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Último login</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "editor"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role === "admin" ? "Administrador" : user.role === "editor" ? "Editor" : "Visualizador"}
                  </span>
                </TableCell>
                <TableCell>{user.createdAt.toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{user.lastLogin.toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Lock className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.role === "admin" && users.filter(u => u.role === "admin").length === 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserManagement;
