
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminAccessProps {
  authenticated: boolean;
  children: React.ReactNode;
  isLoading?: boolean;
}

const AdminAccess = ({ authenticated, children, isLoading = false }: AdminAccessProps) => {
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso Restrito</AlertTitle>
          <AlertDescription>
            Você precisa estar logado para acessar o painel de administração.
          </AlertDescription>
        </Alert>
        
        <div className="mt-6 flex flex-col items-center">
          <p className="mb-4 text-center text-muted-foreground">
            Faça login para acessar as funcionalidades administrativas.
          </p>
          <Button asChild>
            <a href="/login">Login</a>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAccess;
