
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogPost } from "@/hooks/useBlogPosts";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

// Form schema for validation
const formSchema = z.object({
  title: z.string().min(3, "Título é obrigatório"),
  slug: z.string().min(3, "Slug é obrigatório"),
  author: z.string().min(3, "Autor é obrigatório"),
  categories: z.string().min(3, "Categorias são obrigatórias"),
  status: z.string().min(1, "Status é obrigatório"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  read_time: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const BlogManagement = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Form setup with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      author: "",
      categories: "",
      status: "draft",
      excerpt: "",
      content: "",
      read_time: "5 min",
    },
  });

  // Image state
  const [currentImage, setCurrentImage] = useState("");
  
  // Fetch blog posts
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['adminBlogPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching posts:", error);
        throw new Error(error.message);
      }
      
      return data || [];
    },
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (post: Omit<BlogPost, 'id'>) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([post])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success("Post criado com sucesso!");
      resetAndCloseDialog();
    },
    onError: (error) => {
      toast.error(`Erro ao criar post: ${error.message}`);
    }
  });

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, post }: { id: string, post: Partial<BlogPost> }) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(post)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost'] });
      toast.success("Post atualizado com sucesso!");
      resetAndCloseDialog();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar post: ${error.message}`);
    }
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success("Post excluído com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir post: ${error.message}`);
    }
  });

  // Filter posts based on search term
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.author?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  // Handle form submission (add or edit)
  const handleSubmit = (values: FormValues) => {
    const categories = values.categories.split(',').map(cat => cat.trim());
    const now = new Date().toISOString();
    
    if (isEditing && currentPost) {
      // Update existing post
      const updatedPost: Partial<BlogPost> = {
        title: values.title,
        slug: values.slug,
        author: values.author,
        categories: categories,
        status: values.status,
        content: values.content,
        excerpt: values.excerpt,
        image_url: currentImage || currentPost.image_url,
        read_time: values.read_time,
        updated_at: now,
      };
      
      // If status changed from draft to published, add published_at date
      if (currentPost.status === 'draft' && values.status === 'published') {
        updatedPost.published_at = now;
      }
      
      updatePostMutation.mutate({ id: currentPost.id, post: updatedPost });
    } else {
      // Add new post
      const newPost: Omit<BlogPost, 'id'> = {
        title: values.title,
        slug: values.slug,
        author: values.author,
        categories: categories,
        content: values.content,
        excerpt: values.excerpt,
        image_url: currentImage,
        status: values.status,
        created_at: now,
        updated_at: now,
        published_at: values.status === 'published' ? now : null,
        read_time: values.read_time,
      } as Omit<BlogPost, 'id'>;
      
      createPostMutation.mutate(newPost);
    }
  };

  // Handler for deleting a post
  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este artigo?")) {
      deletePostMutation.mutate(id);
    }
  };

  // Handler for editing a post
  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
    setCurrentImage(post.image_url || "");
    
    form.reset({
      title: post.title,
      slug: post.slug,
      author: post.author || "",
      categories: post.categories?.join(", ") || "",
      status: post.status || "draft",
      excerpt: post.excerpt || "",
      content: post.content || "",
      read_time: post.read_time || "5 min",
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
      excerpt: "",
      content: "",
      read_time: "5 min",
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
  
  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/\s+/g, '-');
  };
  
  // Auto-generate slug when title changes (only when creating a new post)
  useEffect(() => {
    if (!isEditing) {
      const titleValue = form.watch('title');
      if (titleValue) {
        form.setValue('slug', generateSlug(titleValue));
      }
    }
  }, [form.watch('title'), isEditing, form]);

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
                  
                  <FormField
                    control={form.control}
                    name="read_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempo de Leitura</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="5 min" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resumo</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                  <Button 
                    type="submit"
                    disabled={createPostMutation.isPending || updatePostMutation.isPending}
                  >
                    {(createPostMutation.isPending || updatePostMutation.isPending) ? 
                      "Salvando..." : 
                      (isEditing ? "Atualizar" : "Criar") + " Artigo"}
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
            {isLoading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-12 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-red-500 mb-2">Erro ao carregar posts</p>
                  <Button 
                    variant="outline" 
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] })}
                  >
                    Tentar novamente
                  </Button>
                </TableCell>
              </TableRow>
            ) : filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  {searchTerm ? 
                    "Nenhum post encontrado com esses termos de pesquisa" : 
                    "Nenhum post cadastrado ainda"}
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-mono text-xs">{post.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    <div className="h-12 w-16 overflow-hidden rounded-md">
                      <img 
                        src={post.image_url || "https://via.placeholder.com/150"} 
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
                      {post.categories?.map((category, idx) => (
                        <Badge key={idx} variant="outline">{category}</Badge>
                      )) || "—"}
                    </div>
                  </TableCell>
                  <TableCell>{post.author || "—"}</TableCell>
                  <TableCell>
                    {post.published_at 
                      ? new Date(post.published_at).toLocaleDateString('pt-BR') 
                      : "Não publicado"}
                  </TableCell>
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
                        asChild
                      >
                        <Link to={`/blog/${post.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
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
                        disabled={deletePostMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BlogManagement;
