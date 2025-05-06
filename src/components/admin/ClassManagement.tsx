
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Pencil, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Define proper interface for ClassItem
interface ClassItem {
  id: number;
  courseName: string;
  courseSlug: string;
  image: string;
  month: string;
  year: string;
  period: string;
  startDate: Date;
  endDate: Date;
  days: string;
  time: string;
  location: string;
  spotsAvailable: number;
  totalSpots: number;
  price: string;
  instructor: string;
  description: string;
}

// Mock class data - in a real application this would be fetched from a database or API
const initialClasses: ClassItem[] = [
  {
    id: 1,
    courseName: "Fotografia Básica",
    courseSlug: "fotografia-basica",
    image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
    month: "Agosto",
    year: "2023",
    period: "Noturno",
    startDate: new Date("2023-08-07"),
    endDate: new Date("2023-09-01"),
    days: "Segundas e Quartas",
    time: "19:00 - 22:00",
    location: "Centro, São Paulo",
    spotsAvailable: 5,
    totalSpots: 15,
    price: "R$ 1.200",
    instructor: "Carlos Mendes",
    description: "Um curso completo para iniciantes que desejam dominar os fundamentos da fotografia.",
  },
  {
    id: 2,
    courseName: "Fotografia Básica",
    courseSlug: "fotografia-basica",
    image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
    month: "Setembro",
    year: "2023",
    period: "Matutino",
    startDate: new Date("2023-09-11"),
    endDate: new Date("2023-10-06"),
    days: "Terças e Quintas",
    time: "09:00 - 12:00",
    location: "Centro, São Paulo",
    spotsAvailable: 10,
    totalSpots: 15,
    price: "R$ 1.200",
    instructor: "Ana Silva",
    description: "Um curso completo para iniciantes que desejam dominar os fundamentos da fotografia.",
  },
];

// Form schema
const formSchema = z.object({
  courseName: z.string().min(3, "Nome do curso é obrigatório"),
  courseSlug: z.string().min(3, "Slug é obrigatório"),
  image: z.string().url("URL de imagem inválida"),
  month: z.string().min(1, "Mês é obrigatório"),
  year: z.string().min(4, "Ano é obrigatório"),
  period: z.string().min(1, "Período é obrigatório"),
  startDate: z.date({ required_error: "Data de início é obrigatória" }),
  endDate: z.date({ required_error: "Data de término é obrigatória" }),
  days: z.string().min(1, "Dias da semana são obrigatórios"),
  time: z.string().min(1, "Horário é obrigatório"),
  location: z.string().min(1, "Local é obrigatório"),
  spotsAvailable: z.number().min(0, "Vagas disponíveis não podem ser negativas"),
  totalSpots: z.number().min(1, "Total de vagas deve ser pelo menos 1"),
  price: z.string().min(1, "Preço é obrigatório"),
  instructor: z.string().min(1, "Nome do instrutor é obrigatório"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

const ClassManagement = () => {
  const [classes, setClasses] = useState<ClassItem[]>(initialClasses);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClass, setCurrentClass] = useState<ClassItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: "",
      courseSlug: "",
      image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
      month: "",
      year: "",
      period: "",
      startDate: undefined,
      endDate: undefined,
      days: "",
      time: "",
      location: "",
      spotsAvailable: 15,
      totalSpots: 15,
      price: "",
      instructor: "",
      description: "",
    },
  });

  // Handler for adding/editing a class
  const handleSubmit = (values: FormValues) => {
    if (isEditing && currentClass) {
      // Update existing class - ensure all required fields are present
      setClasses(
        classes.map((c) => (c.id === currentClass.id ? { ...c, ...values } : c))
      );
      toast.success("Turma atualizada com sucesso!");
    } else {
      // Add new class - ensure all required fields are present
      const newClass: ClassItem = {
        ...values,
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
    
    form.reset({
      ...classItem,
      spotsAvailable: Number(classItem.spotsAvailable),
      totalSpots: Number(classItem.totalSpots),
    });
    
    setIsDialogOpen(true);
  };

  // Handler for opening the dialog for a new class
  const handleNewClass = () => {
    setCurrentClass(null);
    setIsEditing(false);
    form.reset({
      courseName: "",
      courseSlug: "",
      image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
      month: "",
      year: "",
      period: "",
      startDate: undefined,
      endDate: undefined,
      days: "",
      time: "",
      location: "",
      spotsAvailable: 15,
      totalSpots: 15,
      price: "",
      instructor: "",
      description: "",
    });
    setIsDialogOpen(true);
  };

  // Reset form and close dialog
  const resetAndCloseDialog = () => {
    setIsEditing(false);
    setCurrentClass(null);
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Buscar turmas..."
          className="max-w-sm"
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
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="courseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Curso</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="courseSlug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug do Curso</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Identificador único para URL (ex: fotografia-basica)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da Imagem</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mês</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o mês" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                              "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"].map((month) => (
                              <SelectItem key={month} value={month}>{month}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ano</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="period"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Período</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o período" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["Matutino", "Vespertino", "Noturno", "Final de Semana"].map((period) => (
                              <SelectItem key={period} value={period}>{period}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data de Início</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PP", { locale: ptBR })
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data de Término</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PP", { locale: ptBR })
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dias da Semana</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: Segundas e Quartas" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: 19:00 - 22:00" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="spotsAvailable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vagas Disponíveis</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="totalSpots"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total de Vagas</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: R$ 1.200" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="instructor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instrutor</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetAndCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {isEditing ? "Atualizar" : "Criar"} Turma
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Classes Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Vagas</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length > 0 ? (
              classes.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell>{classItem.id}</TableCell>
                  <TableCell className="font-medium">{classItem.courseName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{classItem.period}</Badge>
                  </TableCell>
                  <TableCell>
                    {classItem.month}/{classItem.year}
                  </TableCell>
                  <TableCell>
                    {classItem.spotsAvailable} / {classItem.totalSpots}
                  </TableCell>
                  <TableCell>{classItem.price}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(classItem)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(classItem.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Nenhuma turma encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClassManagement;
