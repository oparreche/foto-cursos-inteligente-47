
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BlogFormValues } from "./blog/BlogForm";
import { useBlogManagement } from "@/hooks/useBlogManagement";
import BlogTable from "./blog/BlogTable";
import BlogForm from "./blog/BlogForm";

const BlogManagement = () => {
  const {
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
  } = useBlogManagement();

  // Handle form submission (add or edit)
  const handleSubmit = (values: BlogFormValues) => {
    const categories = values.categories.split(',').map(cat => cat.trim());
    const now = new Date().toISOString();
    
    if (isEditing && currentPost) {
      // Update existing post
      const updatedPost = {
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
        published_at: undefined as string | null | undefined, // Adding the missing property with proper type
      };
      
      // If status changed from draft to published, add published_at date
      if (currentPost.status === 'draft' && values.status === 'published') {
        updatedPost.published_at = now;
      }
      
      updatePostMutation.mutate({ id: currentPost.id, post: updatedPost });
    } else {
      // Add new post
      const newPost = {
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
      };
      
      createPostMutation.mutate(newPost);
    }
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
            
            <BlogForm
              currentPost={currentPost}
              isEditing={isEditing}
              currentImage={currentImage}
              setCurrentImage={setCurrentImage}
              onSubmit={handleSubmit}
              onCancel={resetAndCloseDialog}
              isSubmitting={createPostMutation.isPending || updatePostMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Blog Posts Table */}
      <BlogTable
        isLoading={isLoading}
        error={error}
        filteredPosts={filteredPosts}
        searchTerm={searchTerm}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleteIsLoading={deletePostMutation.isPending}
      />
    </div>
  );
};

export default BlogManagement;
