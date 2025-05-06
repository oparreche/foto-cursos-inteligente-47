
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";

// Mock courses data
const initialCourses = [
  {
    id: 1,
    title: "Fotografia Básica",
    slug: "fotografia-basica",
    category: "Fotografia",
    duration: "20 horas",
    level: "Iniciante",
  },
  {
    id: 2,
    title: "Fotografia de Retrato",
    slug: "fotografia-retrato",
    category: "Fotografia",
    duration: "25 horas",
    level: "Intermediário",
  },
  {
    id: 3,
    title: "Pós-produção e Edição",
    slug: "pos-producao-edicao",
    category: "Edição",
    duration: "30 horas",
    level: "Avançado",
  },
];

const CourseManagement = () => {
  const [courses] = useState(initialCourses);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Buscar cursos..."
          className="max-w-sm"
        />
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Novo Curso
        </Button>
      </div>

      {/* Courses Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.id}</TableCell>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{course.category}</Badge>
                </TableCell>
                <TableCell>{course.duration}</TableCell>
                <TableCell>{course.level}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => console.log("Edit course:", course.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => console.log("Delete course:", course.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CourseManagement;
