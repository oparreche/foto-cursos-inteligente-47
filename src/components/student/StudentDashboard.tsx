
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CoursesTab from "./tabs/CoursesTab";
import MaterialsTab from "./tabs/MaterialsTab";
import CertificatesTab from "./tabs/CertificatesTab";
import FinancesTab from "./tabs/FinancesTab";
import QuizTab from "./tabs/QuizTab";
import AccountTab from "./tabs/AccountTab";

interface StudentDashboardProps {
  onLogout: () => void;
}

const StudentDashboard = ({ onLogout }: StudentDashboardProps) => {
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Olá, Estudante!</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate('/admin')}>Área Admin</Button>
          <Button variant="outline" onClick={onLogout}>Sair</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Button 
          onClick={() => navigate('/financeiro')} 
          variant="outline" 
          className="py-6 h-auto flex flex-col items-center"
        >
          <span className="text-xl mb-1">Financeiro</span>
          <span className="text-sm text-gray-500">Gerencie suas finanças</span>
        </Button>
        
        <Button 
          onClick={() => navigate('/quiz')} 
          variant="outline" 
          className="py-6 h-auto flex flex-col items-center"
        >
          <span className="text-xl mb-1">Quiz</span>
          <span className="text-sm text-gray-500">Teste seus conhecimentos</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="py-6 h-auto flex flex-col items-center"
        >
          <span className="text-xl mb-1">Certificados</span>
          <span className="text-sm text-gray-500">Seus certificados</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="py-6 h-auto flex flex-col items-center"
        >
          <span className="text-xl mb-1">Materiais</span>
          <span className="text-sm text-gray-500">Materiais de estudo</span>
        </Button>
      </div>

      <Tabs defaultValue="courses">
        <TabsList className="mb-6">
          <TabsTrigger value="courses">Meus Cursos</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
          <TabsTrigger value="certificates">Certificados</TabsTrigger>
          <TabsTrigger value="account">Minha Conta</TabsTrigger>
          <TabsTrigger value="finances">Financeiro</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <CoursesTab />
        </TabsContent>
        
        <TabsContent value="materials">
          <MaterialsTab />
        </TabsContent>
        
        <TabsContent value="certificates">
          <CertificatesTab />
        </TabsContent>
        
        <TabsContent value="finances">
          <FinancesTab />
        </TabsContent>
        
        <TabsContent value="quiz">
          <QuizTab />
        </TabsContent>
        
        <TabsContent value="account">
          <AccountTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
