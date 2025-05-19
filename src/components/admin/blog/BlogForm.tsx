
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogPost } from "@/hooks/useBlogPosts";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageUpload from "../ImageUpload";
import { DialogFooter } from "@/components/ui/dialog";

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

export type BlogFormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  currentPost: BlogPost | null;
  isEditing: boolean;
  currentImage: string;
  setCurrentImage: (url: string) => void;
  onSubmit: (values: BlogFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const BlogForm = ({
  currentPost,
  isEditing,
  currentImage,
  setCurrentImage,
  onSubmit,
  onCancel,
  isSubmitting
}: BlogFormProps) => {
  const form = useForm<BlogFormValues>({
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

  // Reset form when currentPost changes
  useEffect(() => {
    if (currentPost) {
      form.reset({
        title: currentPost.title,
        slug: currentPost.slug,
        author: currentPost.author || "",
        categories: currentPost.categories?.join(", ") || "",
        status: currentPost.status || "draft",
        excerpt: currentPost.excerpt || "",
        content: currentPost.content || "",
        read_time: currentPost.read_time || "5 min",
      });
    } else {
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
    }
  }, [currentPost, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 
              "Salvando..." : 
              (isEditing ? "Atualizar" : "Criar") + " Artigo"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default BlogForm;
