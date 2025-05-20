
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Layers, BookOpen, FileText, LayoutDashboard, 
  Users, CreditCard, BrainCircuit 
} from "lucide-react";

const TabTriggers: React.FC = () => {
  return (
    <TabsList className="grid grid-cols-7 mb-8">
      <TabsTrigger value="dashboard" className="flex items-center gap-2">
        <LayoutDashboard className="h-4 w-4" />
        <span>Dashboard</span>
      </TabsTrigger>
      <TabsTrigger value="classes" className="flex items-center gap-2">
        <Layers className="h-4 w-4" />
        <span>Turmas</span>
      </TabsTrigger>
      <TabsTrigger value="courses" className="flex items-center gap-2">
        <BookOpen className="h-4 w-4" />
        <span>Cursos</span>
      </TabsTrigger>
      <TabsTrigger value="blog" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        <span>Blog</span>
      </TabsTrigger>
      <TabsTrigger value="users" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span>Usuários</span>
      </TabsTrigger>
      <TabsTrigger value="payments" className="flex items-center gap-2">
        <CreditCard className="h-4 w-4" />
        <span>Pagamentos</span>
      </TabsTrigger>
      <TabsTrigger value="ai" className="flex items-center gap-2" data-value="ai">
        <BrainCircuit className="h-4 w-4" />
        <span>IA</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default TabTriggers;
