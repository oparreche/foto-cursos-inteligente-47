
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import ClassForm from "./ClassForm";
import ClassesTable from "./ClassesTable";
import { initialClasses } from "./mockData";
import { ClassItem, FormValues } from "./types";

const ClassManagement = () => {
  const [classes, setClasses] = useState<ClassItem[]>(initialClasses);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClass, setCurrentClass] = useState<ClassItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Handler for adding/editing a class
  const handleSubmit = (values: FormValues) => {
    if (isEditing && currentClass) {
      // Update existing class - ensure all required fields are present
      const updatedClass: ClassItem = {
        ...currentClass,
        ...values
      };
      
      setClasses(
        classes.map((c) => (c.id === currentClass.id ? updatedClass : c))
      );
      toast.success("Turma atualizada com sucesso!");
    } else {
      // Add new class - ensure all required fields are present
      const newClass: ClassItem = {
        ...values as ClassItem,
        id: classes.length > 0 ? Math.max(...classes.map((c) => c.id)) + 1 : 1,
      };
      setClasses([...classes, newClass]);
      toast.success("Nova turma criada com sucesso!");
    }
    
    resetAndCloseDialog();
  };

  // Handler for deleting a class
  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta turma?")) {
      setClasses(classes.filter((c) => c.id !== id));
      toast.success("Turma excluída com sucesso!");
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

      {/* Classes Table */}
      <ClassesTable 
        classes={filteredClasses} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ClassManagement;
