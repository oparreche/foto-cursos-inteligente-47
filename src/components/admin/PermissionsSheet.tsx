
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Permission } from "./users/types";

interface PermissionsSheetProps {
  userRole: string;
}

const PermissionsSheet = ({ userRole }: PermissionsSheetProps) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userRole === 'admin' || userRole === 'super_admin') {
      fetchPermissions();
    }
  }, [userRole]);

  const fetchPermissions = async () => {
    try {
      // @ts-ignore - precisamos ignorar essa tipagem, pois a tabela role_permissions foi adicionada depois
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*')
        .order('role', { ascending: true })
        .order('module', { ascending: true });

      if (error) throw error;
      // @ts-ignore - precisamos ignorar essa tipagem, pois os dados retornados são do tipo Permission
      setPermissions(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar permissões:", err);
      toast.error("Erro ao carregar permissões");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePermission = async (permission: Permission) => {
    try {
      // @ts-ignore - precisamos ignorar essa tipagem, pois a tabela role_permissions foi adicionada depois
      const { error } = await supabase
        .from('role_permissions')
        .update({
          can_view: permission.can_view,
          can_create: permission.can_create,
          can_edit: permission.can_edit,
          can_delete: permission.can_delete
        })
        .eq('role', permission.role)
        .eq('module', permission.module);

      if (error) throw error;
      toast.success("Permissão atualizada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao atualizar permissão:", err);
      toast.error("Erro ao atualizar permissão");
    }
  };

  const togglePermission = (role: string, module: string, permission: 'can_view' | 'can_create' | 'can_edit' | 'can_delete') => {
    const updatedPermissions = permissions.map(p => {
      if (p.role === role && p.module === module) {
        const updatedPermission = { ...p, [permission]: !p[permission] };
        updatePermission(updatedPermission);
        return updatedPermission;
      }
      return p;
    });
    setPermissions(updatedPermissions);
  };

  if (userRole !== 'admin' && userRole !== 'super_admin') {
    return null;
  }

  // Agrupa permissões por função (role)
  const roleGroups = permissions.reduce((groups: Record<string, Permission[]>, permission) => {
    if (!groups[permission.role]) {
      groups[permission.role] = [];
    }
    groups[permission.role].push(permission);
    return groups;
  }, {});

  const roleLabels: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Administrador",
    coordinator: "Coordenador",
    professor: "Professor",
    student: "Estudante",
    viewer: "Visualizador"
  };

  return (
    <div className="mt-6 flex justify-end">
      <Sheet>
        <SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Configurações de Permissões
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Configurações de Permissões</SheetTitle>
            <SheetDescription>
              Configure os níveis de acesso para diferentes funções de usuário.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3"></div>
                <div className="h-40 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : (
              <Tabs defaultValue={Object.keys(roleGroups)[0] || "super_admin"}>
                <TabsList className="mb-4 flex flex-wrap">
                  {Object.keys(roleGroups).map(role => (
                    <TabsTrigger key={role} value={role}>
                      {roleLabels[role] || role}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(roleGroups).map(([role, perms]) => (
                  <TabsContent key={role} value={role} className="space-y-4">
                    <div className="grid grid-cols-5 gap-4 text-sm font-medium mb-3">
                      <div>Módulo</div>
                      <div className="text-center">Visualizar</div>
                      <div className="text-center">Criar</div>
                      <div className="text-center">Alterar</div>
                      <div className="text-center">Excluir</div>
                    </div>

                    {perms.map((permission) => (
                      <div key={`${permission.role}-${permission.module}`} className="grid grid-cols-5 gap-4 text-sm py-2 border-t items-center">
                        <div className="font-medium">{permission.module}</div>
                        <div className="text-center">
                          <Button
                            variant={permission.can_view ? "default" : "outline"}
                            size="sm"
                            onClick={() => togglePermission(permission.role, permission.module, 'can_view')}
                            className="min-w-[80px]"
                          >
                            {permission.can_view ? "Sim" : "Não"}
                          </Button>
                        </div>
                        <div className="text-center">
                          <Button
                            variant={permission.can_create ? "default" : "outline"}
                            size="sm"
                            onClick={() => togglePermission(permission.role, permission.module, 'can_create')}
                            className="min-w-[80px]"
                          >
                            {permission.can_create ? "Sim" : "Não"}
                          </Button>
                        </div>
                        <div className="text-center">
                          <Button
                            variant={permission.can_edit ? "default" : "outline"}
                            size="sm"
                            onClick={() => togglePermission(permission.role, permission.module, 'can_edit')}
                            className="min-w-[80px]"
                          >
                            {permission.can_edit ? "Sim" : "Não"}
                          </Button>
                        </div>
                        <div className="text-center">
                          <Button
                            variant={permission.can_delete ? "default" : "outline"}
                            size="sm"
                            onClick={() => togglePermission(permission.role, permission.module, 'can_delete')}
                            className="min-w-[80px]"
                          >
                            {permission.can_delete ? "Sim" : "Não"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PermissionsSheet;
