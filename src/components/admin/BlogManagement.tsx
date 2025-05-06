
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";

// Mock blog posts data
const initialPosts = [
  {
    id: 1,
    title: "Como Tirar Fotos Profissionais com Celular",
    slug: "fotos-profissionais-com-celular",
    author: "Ana Mendes",
    date: "12 Jun 2023",
    status: "published",
    categories: ["Dicas", "Mobile"],
  },
  {
    id: 2,
    title: "Os 5 Erros Mais Comuns de Iniciantes na Fotografia",
    slug: "erros-iniciantes-fotografia",
    author: "Carlos Silva",
    date: "5 Jun 2023",
    status: "published",
    categories: ["Dicas", "Iniciantes"],
  },
  {
    id: 3,
    title: "Comparativo: Canon vs Nikon em 2023",
    slug: "comparativo-canon-nikon-2023",
    author: "Ricardo Moura",
    date: "Draft",
    status: "draft",
    categories: ["Equipamentos"],
  },
];

const BlogManagement = () => {
  const [posts] = useState(initialPosts);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Buscar artigos..."
          className="max-w-sm"
        />
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Novo Artigo
        </Button>
      </div>

      {/* Blog Posts Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categorias</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {post.categories.map((category, idx) => (
                      <Badge key={idx} variant="outline">{category}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell>
                  <Badge 
                    variant={post.status === "published" ? "default" : "secondary"}
                  >
                    {post.status === "published" ? "Publicado" : "Rascunho"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => console.log("View post:", post.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => console.log("Edit post:", post.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => console.log("Delete post:", post.id)}
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

export default BlogManagement;
