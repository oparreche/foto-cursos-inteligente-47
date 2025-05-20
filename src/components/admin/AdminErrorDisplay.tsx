
import React from "react";
import DiagnosticDisplay from "@/components/admin/DiagnosticDisplay";
import MainLayout from "@/components/layout/MainLayout";
import { AlertCircle } from "lucide-react";

interface AdminErrorDisplayProps {
  error: string;
}

const AdminErrorDisplay: React.FC<AdminErrorDisplayProps> = ({ error }) => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Erro no Painel de Administração</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            className="ml-4 bg-red-500 text-white px-4 py-2 rounded" 
            onClick={() => window.location.reload()}
          >
            Recarregar página
          </button>
        </div>
        <DiagnosticDisplay />
      </div>
    </MainLayout>
  );
};

export default AdminErrorDisplay;
