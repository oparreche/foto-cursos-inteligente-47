
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";

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
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3",
  },
  {
    id: 2,
    title: "Os 5 Erros Mais Comuns de Iniciantes na Fotografia",
    slug: "erros-iniciantes-fotografia",
    author: "Carlos Silva",
    date: "5 Jun 2023",
    status: "published",
    categories: ["Dicas", "Iniciantes"],
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3",
  },
  {
    id: 3,
    title: "Comparativo: Canon vs Nikon em 2023",
    slug: "comparativo-canon-nikon-2023",
    author: "Ricardo Moura",
    date: "Draft",
    status: "draft",
    categories: ["Equipamentos"],
    image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?ixlib=rb-4.0.3",
  },
];

// Form schema for validation
const formSchema = z.object({
  title: z.string().min(3, "Título é obrigatório"),
  slug: z.string().min(3, "Slug é obrigatório"),
  author: z.string().min(3, "Autor é obrigatório"),
  categories: z.string().min(3, "Categorias são obrigatórias"),
  status: z.string().min(1, "Status é obrigatório"),
  content: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type BlogPost = typeof initialPosts[0] & { content?: string };

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form setup with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      author: "",
      categories: "",
      status: "draft",
      content: "",
    },
  });

  // Image state
  const [currentImage, setCurrentImage] = useState("");

  // Filter posts based on search term
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission (add or edit)
  const handleSubmit = (values: FormValues) => {
    const categories = values.categories.split(',').map(cat => cat.trim());
    
    if (isEditing && currentPost) {
      // Update existing post
      setPosts(
        posts.map(p => (p.id === currentPost.id ? {
          ...p,
          title: values.title,
          slug: values.slug,
          author: values.author,
          categories: categories,
          status: values.status,
          content: values.content,
          image: currentImage || p.image,
        } : p))
      );
      toast.success("Artigo atualizado com sucesso!");
    } else {
      // Add new post
      const newPost: BlogPost = {
        id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
        title: values.title,
        slug: values.slug,
        author: values.author,
        categories: categories,
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: values.status,
        content: values.content,
        image: currentImage || "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3", // Default image
      };
      setPosts([...posts, newPost]);
      toast.success("Novo artigo criado com sucesso!");
    }
    
    resetAndCloseDialog();
  };

  // Handler for deleting a post
  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este artigo?")) {
      setPosts(posts.filter(p => p.id !== id));
      toast.success("Artigo excluído com sucesso!");
    }
  };

  // Handler for editing a post
  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
    setCurrentImage(post.image);
    
    form.reset({
      title: post.title,
      slug: post.slug,
      author: post.author,
      categories: post.categories.join(", "),
      status: post.status,
      content: post.content || "",
    });
    
    setIsDialogOpen(true);
  };

  // Handler for opening the dialog for a new post
  const handleNewPost = () => {
    setCurrentPost(null);
    setIsEditing(false);
    setCurrentImage("");
    form.reset({
      title: "",
      slug: "",
      author: "",
      categories: "",
      status: "draft",
      content: "",
    });
    setIsDialogOpen(true);
  };

  // Reset form and close dialog
  const resetAndCloseDialog = () => {
    setIsEditing(false);
    setCurrentPost(null);
    setCurrentImage("");
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Buscar artigos..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewPost} className="gap-2">
              <Plus className="h-4 w-4" /> Novo Artigo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Artigo" : "Novo Artigo"}</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para {isEditing ? "atualizar o" : "criar um novo"} artigo.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="titulo-do-artigo" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Autor</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categorias</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Dicas, Mobile, Equipamentos" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="draft">Rascunho</option>
                            <option value="published">Publicado</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Image Upload Component */}
                <ImageUpload
                  currentImage={currentImage}
                  onImageChange={setCurrentImage}
                  label="Imagem do Artigo"
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={8} className="min-h-32" />
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
                    {isEditing ? "Atualizar" : "Criar"} Artigo
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Blog Posts Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Imagem</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categorias</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell>
                  <div className="h-12 w-16 overflow-hidden rounded-md">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                </TableCell>
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
                      onClick={() => handleEdit(post)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(post.id)}
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
