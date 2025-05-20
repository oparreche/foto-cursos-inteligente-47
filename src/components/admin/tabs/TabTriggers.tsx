
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  Pencil, 
  Sparkles,
  DollarSign
} from "lucide-react";

interface TabTriggersProps {
  userRole?: string;
}

export const TabTriggers = ({ userRole }: TabTriggersProps) => {
  return (
    <TabsList className="mb-4">
      <TabsTrigger value="dashboard" className="flex items-center gap-2">
        <Home className="h-4 w-4" /> Dashboard
      </TabsTrigger>

      <TabsTrigger value="users" className="flex items-center gap-2">
        <Users className="h-4 w-4" /> Usuários
      </TabsTrigger>

      <TabsTrigger value="courses" className="flex items-center gap-2">
        <BookOpen className="h-4 w-4" /> Cursos
      </TabsTrigger>

      <TabsTrigger value="classes" className="flex items-center gap-2">
        <Calendar className="h-4 w-4" /> Turmas
      </TabsTrigger>

      <TabsTrigger value="blog" className="flex items-center gap-2">
        <Pencil className="h-4 w-4" /> Blog
      </TabsTrigger>

      <TabsTrigger value="ai" className="flex items-center gap-2">
        <Sparkles className="h-4 w-4" /> IA
      </TabsTrigger>
      
      <TabsTrigger value="finance" className="flex items-center gap-2">
        <DollarSign className="h-4 w-4" /> Financeiro
      </TabsTrigger>
    </TabsList>
  );
};

export default TabTriggers;
