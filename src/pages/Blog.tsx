import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, User, Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBlogPosts, useAllBlogCategories } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const { data: posts = [], isLoading: isLoadingPosts, error: postsError } = useBlogPosts();
  const { data: allCategories = [], isLoading: isLoadingCategories } = useAllBlogCategories();
  
  // Format the date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredPosts = posts.filter((post) => {
    // Filter by search term
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    // Filter by category
    const matchesCategory = selectedCategory === "" || 
                           (post.categories?.includes(selectedCategory) || false);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      {/* Blog Hero */}
      <section className="bg-photo-dark py-16 md:py-24 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="heading-lg md:heading-xl mb-6">Blog de Fotografia</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Dicas, tutoriais e inspiração para aprimorar suas habilidades fotográficas
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              {/* Search and filter */}
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar no blog..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 py-6 text-lg"
                  />
                </div>
              </div>

              {/* Blog Posts */}
              {isLoadingPosts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-6">
                        <div className="flex gap-2 mb-3">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-8 w-full mb-2" />
                        <Skeleton className="h-20 w-full mb-4" />
                        <div className="pt-4 border-t border-gray-100 flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : postsError ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                  <h3 className="text-xl font-medium mb-2">Erro ao carregar os posts</h3>
                  <p className="text-gray-500 mb-6">
                    Ocorreu um erro ao tentar buscar os posts do blog
                  </p>
                  <Button onClick={() => window.location.reload()}>
                    Tentar novamente
                  </Button>
                </div>
              ) : filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={post.image_url || "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3"}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.categories?.map((category, idx) => (
                            <Badge key={idx} variant="outline">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold mb-2 hover:text-amber-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 flex-grow">
                          {post.excerpt}
                        </p>
                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.read_time}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                  <h3 className="text-xl font-medium mb-2">Nenhum artigo encontrado</h3>
                  <p className="text-gray-500 mb-6">
                    Tente ajustar seus termos de busca ou categoria
                  </p>
                  <Button onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                  }}>
                    Limpar filtros
                  </Button>
                </div>
              )}

              {/* Pagination - static for now, would be dynamic in real implementation */}
              {filteredPosts.length > 0 && (
                <div className="flex justify-center mt-12">
                  <nav className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Anterior
                    </Button>
                    <Button variant="outline" size="sm" className="bg-amber-50 border-amber-200">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      3
                    </Button>
                    <Button variant="outline" size="sm">
                      Próxima
                    </Button>
                  </nav>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/4">
              {/* Categories */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Tag className="h-5 w-5 mr-2" /> Categorias
                </h3>
                {isLoadingCategories ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map(i => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={selectedCategory === "" ? "default" : "outline"}
                      size="sm"
                      className="mb-2"
                      onClick={() => setSelectedCategory("")}
                    >
                      Todas
                    </Button>
                    {allCategories.map((category, idx) => (
                      <Button
                        key={idx}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        className="mb-2"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Featured Post */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold mb-4">Artigo em Destaque</h3>
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3"
                    alt="Artigo em Destaque"
                    className="w-full h-36 object-cover"
                  />
                </div>
                <h4 className="font-bold mb-2">Os segredos da fotografia em preto e branco</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Descubra como transformar suas fotografias com técnicas de preto e branco...
                </p>
                <Link
                  to="/blog/segredos-preto-e-branco"
                  className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                  Ler artigo completo →
                </Link>
              </div>

              {/* Newsletter */}
              <div className="bg-amber-50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Receba Novidades</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Inscreva-se para receber dicas, tutoriais e novidades do mundo da fotografia.
                </p>
                <div className="space-y-3">
                  <Input placeholder="Seu melhor e-mail" />
                  <Button className="w-full">Inscrever-se</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Blog;
