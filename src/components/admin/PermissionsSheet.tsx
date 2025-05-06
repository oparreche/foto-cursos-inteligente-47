
import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface PermissionsSheetProps {
  userRole: string;
}

const PermissionsSheet = ({ userRole }: PermissionsSheetProps) => {
  if (userRole !== 'admin') {
    return null;
  }

  return (
    <div className="mt-6 flex justify-end">
      <Sheet>
        <SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Configurações de Permissões
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Configurações de Permissões</SheetTitle>
            <SheetDescription>
              Configure os níveis de acesso para diferentes funções de usuário.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <div className="space-y-6">
              <RolePermissionSection 
                role="Administrador"
                modules={['Turmas', 'Cursos', 'Blog', 'Usuários', 'Pagamentos']}
                permissions={{ view: true, create: true, update: true, delete: true }}
              />
              
              <RolePermissionSection 
                role="Editor"
                modules={['Turmas', 'Cursos', 'Blog', 'Usuários', 'Pagamentos']}
                permissions={{ 
                  view: true, 
                  create: true, 
                  update: true, 
                  delete: (module) => module !== 'Usuários' && module !== 'Pagamentos'
                }}
              />
              
              <RolePermissionSection 
                role="Visualizador"
                modules={['Turmas', 'Cursos', 'Blog', 'Usuários', 'Pagamentos']}
                permissions={{ view: true, create: false, update: false, delete: false }}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

interface RolePermissionSectionProps {
  role: string;
  modules: string[];
  permissions: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean | ((module: string) => boolean);
  };
}

const RolePermissionSection = ({ role, modules, permissions }: RolePermissionSectionProps) => {
  const checkPermission = (permission: boolean | ((module: string) => boolean), module: string) => {
    if (typeof permission === 'function') {
      return permission(module);
    }
    return permission;
  };

  return (
    <div>
      <h3 className="font-medium mb-3">{role}</h3>
      <div className="grid grid-cols-5 gap-4 text-sm font-medium mb-3">
        <div>Módulo</div>
        <div className="text-center">Visualizar</div>
        <div className="text-center">Criar</div>
        <div className="text-center">Alterar</div>
        <div className="text-center">Excluir</div>
      </div>
      {modules.map((module) => (
        <div key={module} className="grid grid-cols-5 gap-4 text-sm py-2 border-t">
          <div>{module}</div>
          <div className="text-center">{checkPermission(permissions.view, module) ? '✓' : '✗'}</div>
          <div className="text-center">{checkPermission(permissions.create, module) ? '✓' : '✗'}</div>
          <div className="text-center">{checkPermission(permissions.update, module) ? '✓' : '✗'}</div>
          <div className="text-center">{checkPermission(permissions.delete, module) ? '✓' : '✗'}</div>
        </div>
      ))}
    </div>
  );
};

export default PermissionsSheet;
