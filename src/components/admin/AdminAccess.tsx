
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface AdminAccessProps {
  authenticated: boolean;
  children: React.ReactNode;
}

const AdminAccess = ({ authenticated, children }: AdminAccessProps) => {
  if (!authenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Acesso Restrito</AlertTitle>
          <AlertDescription>
            Você precisa estar autenticado como administrador para acessar esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAccess;
