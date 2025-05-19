
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import ClassForm from "./ClassForm";
import ClassesTable from "./ClassesTable";
import { ClassItem, FormValues, convertFormToSupabase, convertSupabaseToClassItem } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ClassManagement = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentClass, setCurrentClass] = useState<ClassItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const queryClient = useQueryClient();

  // Fetch classes from Supabase
  const { data: classes = [], isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('classes')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Convert Supabase format to our ClassItem format
        return data.map(convertSupabaseToClassItem);
      } catch (error: any) {
        toast.error(`Erro ao carregar turmas: ${error.message}`);
        return [];
      }
    }
  });

  // Mutation to create/update a class
  const mutation = useMutation({
    mutationFn: async ({ values, isEditing, currentId }: { values: FormValues, isEditing: boolean, currentId?: string }) => {
      const supabaseData = convertFormToSupabase(values);
      
      if (isEditing && currentId) {
        const { error } = await supabase
          .from('classes')
          .update(supabaseData)
          .eq('id', currentId);
        
        if (error) throw error;
        return { success: true, message: "Turma atualizada com sucesso!" };
      } else {
        // Corrigido: tratamento do objeto para inserção
        const { error } = await supabase
          .from('classes')
          .insert(supabaseData); // Corrigido para passar um objeto único, não um array
        
        if (error) throw error;
        return { success: true, message: "Nova turma criada com sucesso!" };
      }
    },
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      resetAndCloseDialog();
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    }
  });

  // Mutation to delete a class
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      // Find the UUID from the numeric ID
      const classToDelete = classes.find(c => c.id === id);
      if (!classToDelete) throw new Error("Turma não encontrada");
      
      // Get the actual UUID from Supabase by searching
      const { data, error: findError } = await supabase
        .from('classes')
        .select('id')
        .eq('course_name', classToDelete.courseName)
        .eq('month', classToDelete.month)
        .eq('year', classToDelete.year)
        .eq('period', classToDelete.period)
        .single();
      
      if (findError || !data) throw new Error("Turma não encontrada no banco de dados");
      
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', data.id);
      
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Turma excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir turma: ${error.message}`);
    }
  });

  // Handler for adding/editing a class
  const handleSubmit = (values: FormValues) => {
    // Get the actual UUID if editing
    let currentId: string | undefined;
    
    if (isEditing && currentClass) {
      // We need to find the actual UUID in Supabase
      // Corrigido para uso correto de Promise
      supabase
        .from('classes')
        .select('id')
        .eq('course_name', currentClass.courseName)
        .eq('month', currentClass.month)
        .eq('year', currentClass.year)
        .eq('period', currentClass.period)
        .single()
        .then(({ data, error }) => {
          if (error) {
            toast.error(`Erro ao buscar turma: ${error.message}`);
            return;
          }
          
          if (data) {
            mutation.mutate({ values, isEditing, currentId: data.id });
          } else {
            toast.error("Não foi possível encontrar a turma para edição");
          }
        })
        .catch((error: Error) => {
          toast.error(`Erro ao buscar turma: ${error.message}`);
        });
    } else {
      mutation.mutate({ values, isEditing });
    }
  };

  // Handler for deleting a class
  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta turma?")) {
      deleteMutation.mutate(id);
    }
  };

  // Handler for editing a class
  const handleEdit = (classItem: ClassItem) => {
    setCurrentClass(classItem);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  // Handler for opening the dialog for a new class
  const handleNewClass = () => {
    setCurrentClass(null);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  // Reset form and close dialog
  const resetAndCloseDialog = () => {
    setIsEditing(false);
    setCurrentClass(null);
    setIsDialogOpen(false);
  };

  // Filter classes based on search term
  const filteredClasses = classes.filter((c) => 
    c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Buscar turmas..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewClass} className="gap-2">
              <Plus className="h-4 w-4" /> Nova Turma
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Turma" : "Nova Turma"}</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para {isEditing ? "atualizar a" : "criar uma nova"} turma.
              </DialogDescription>
            </DialogHeader>
            
            <ClassForm 
              isEditing={isEditing} 
              currentClass={currentClass}
              onSubmit={handleSubmit}
              onCancel={resetAndCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="w-full flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ClassesTable 
          classes={filteredClasses} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ClassManagement;
