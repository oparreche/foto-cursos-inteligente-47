
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogPost } from "@/hooks/useBlogPosts";

export const useBlogManagement = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const queryClient = useQueryClient();

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
      // Get the current user's ID for author_id
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        throw new Error("User must be logged in to create a post");
      }
      
      // Add author_id to the post
      const postWithAuthorId = {
        ...post,
        author_id: userId
      };
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([postWithAuthorId])
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

  // Reset form and close dialog
  const resetAndCloseDialog = () => {
    setIsEditing(false);
    setCurrentPost(null);
    setCurrentImage("");
    setIsDialogOpen(false);
  };

  // Handler for editing a post
  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
    setCurrentImage(post.image_url || "");
    setIsDialogOpen(true);
  };

  // Handler for opening the dialog for a new post
  const handleNewPost = () => {
    setCurrentPost(null);
    setIsEditing(false);
    setCurrentImage("");
    setIsDialogOpen(true);
  };

  // Handler for deleting a post
  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este artigo?")) {
      deletePostMutation.mutate(id);
    }
  };

  return {
    posts,
    filteredPosts,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    currentPost,
    isEditing,
    currentImage,
    setCurrentImage,
    createPostMutation,
    updatePostMutation,
    deletePostMutation,
    handleEdit,
    handleNewPost,
    handleDelete,
    resetAndCloseDialog
  };
};
