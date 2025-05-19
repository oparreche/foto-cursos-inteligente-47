import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useState, useEffect } from "react";
import { User, Clock, Calendar, ArrowLeft, Facebook, Twitter, Linkedin, Mail, ChevronRight, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { useBlogPost, useBlogPosts, BlogPost } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    data: post, 
    isLoading,
    error 
  } = useBlogPost(slug);
  
  // Para posts relacionados, pegamos todos os posts e filtramos
  const { data: allPosts = [] } = useBlogPosts();
  
  // Calcula posts relacionados baseado nas categorias
  const relatedPosts = post ? 
    allPosts
      .filter(p => 
        p.id !== post.id && 
        p.categories?.some(cat => post.categories?.includes(cat))
      )
      .slice(0, 3) : 
    [];

  // Format the date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      toast({
        title: "Comentário enviado",
        description: "Seu comentário foi enviado para moderação e será publicado em breve.",
      });
      setComment("");
      setName("");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-12 w-2/3 mb-6" />
            <Skeleton className="h-6 w-full mb-4" />
            <div className="flex items-center gap-4 mb-8">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-64 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Post não encontrado</h2>
            <p className="text-gray-600 mb-6">O post que você está tentando acessar não existe ou foi removido.</p>
            <Button asChild>
              <Link to="/blog">Voltar para o Blog</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // FAQ mock data - would come from post.content in a real implementation
  const faq = [
    {
      question: "Qual o melhor horário para fotografar com celular?",
      answer: "O início da manhã e o final da tarde oferecem a melhor luz natural, com tons quentes e sombras suaves. Evite o meio-dia, quando a luz é mais dura e cria sombras pronunciadas."
    },
    {
      question: "Devo usar o flash do celular?",
      answer: "Em geral, o flash do celular deve ser evitado sempre que possível, pois produz uma luz dura e pouco natural. Prefira usar fontes de luz alternativas ou aproveitar os modos noturnos dos smartphones modernos."
    },
    {
      question: "Como posso melhorar a nitidez das minhas fotos?",
      answer: "Mantenha o celular estável (use um tripé se possível), limpe a lente regularmente, use o modo HDR para cenas com grande contraste e evite usar o zoom digital que reduz a qualidade da imagem."
    }
  ];

  return (
    <MainLayout>
      <article className="bg-white">
        {/* Hero Section */}
        <header className="bg-photo-dark text-white relative">
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${post.image_url || "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3"})` }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50"></div>
          <div className="container mx-auto px-4 py-20 md:py-28 relative">
            <div className="max-w-3xl mx-auto">
              <Link to="/blog" className="inline-flex items-center text-amber-300 hover:text-amber-200 mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Blog
              </Link>
              <div className="space-y-2 mb-4">
                {post.categories?.map((category, idx) => (
                  <Badge key={idx} variant="outline" className="border-amber-400 text-amber-200 mr-2">
                    {category}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6">{post.title}</h1>
              <p className="text-xl text-gray-300 mb-8">{post.excerpt}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <div className="font-semibold">{post.author || "Autor"}</div>
                  <div className="text-sm text-gray-300">Fotógrafo Profissional</div>
                </div>
                <Separator orientation="vertical" className="h-8 bg-gray-500" />
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span className="text-sm">{formatDate(post.published_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span className="text-sm">{post.read_time || "5 min"} de leitura</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Post Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="max-w-3xl">
                {/* Rich Content */}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content || "" }}
                ></div>

                {/* Social Share */}
                <div className="mt-12 bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-lg mb-4">Compartilhar este artigo</h3>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600">
                      <Facebook className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-sky-50 hover:text-sky-500">
                      <Twitter className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-700">
                      <Linkedin className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-amber-50 hover:text-amber-600">
                      <Mail className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-12">
                  <h3 className="font-bold text-2xl mb-6">Perguntas Frequentes</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {faq.map((item, idx) => (
                      <AccordionItem key={idx} value={`item-${idx}`}>
                        <AccordionTrigger className="text-left text-lg font-medium">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {/* Author Bio */}
                <div className="mt-12 bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                      <User className="w-10 h-10 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Sobre {post.author || "Autor"}</h3>
                      <div className="text-amber-600 mb-2">Fotógrafo Profissional</div>
                      <p className="text-gray-600">
                        Fotógrafo profissional com mais de 10 anos de experiência em fotografia de retratos e eventos. 
                        Especialista em edição de imagens e técnicas de iluminação criativa.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="mt-12">
                  <h3 className="font-bold text-2xl mb-6 flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" /> Comentários (3)
                  </h3>
                  
                  {/* Sample Comments */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h4 className="font-bold">Roberto Almeida</h4>
                            <span className="text-sm text-gray-500">2 dias atrás</span>
                          </div>
                          <p className="mt-2 text-gray-600">
                            Excelentes dicas! Comecei a aplicar a técnica de iluminação mencionada e já notei uma grande diferença nas minhas fotos.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h4 className="font-bold">Carla Souza</h4>
                            <span className="text-sm text-gray-500">1 semana atrás</span>
                          </div>
                          <p className="mt-2 text-gray-600">
                            Quais aplicativos vocês recomendam para edição de fotos em iPhone? Tenho usado o Snapseed mas estou pensando em migrar para o Lightroom.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h4 className="font-bold">Marcos Oliveira</h4>
                            <span className="text-sm text-gray-500">2 semanas atrás</span>
                          </div>
                          <p className="mt-2 text-gray-600">
                            Adorei o post! Vocês poderiam fazer um tutorial específico sobre fotografia de alimentos com smartphone? É um nicho que está crescendo muito.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="mt-8 bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-bold text-lg mb-4">Deixe seu comentário</h3>
                    
                    <div className="mb-4">
                      <Textarea
                        placeholder="Escreva seu comentário..."
                        className="min-h-[100px]"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Input
                          placeholder="Nome"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Enviando..." : "Publicar comentário"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Related Posts */}
              <div className="bg-gray-50 p-6 rounded-xl mb-6">
                <h3 className="font-bold text-lg mb-4">Posts Relacionados</h3>
                <div className="space-y-4">
                  {relatedPosts.length > 0 ? (
                    relatedPosts.map((related) => (
                      <Link 
                        key={related.id} 
                        to={`/blog/${related.slug}`}
                        className="flex items-start gap-3 group"
                      >
                        <div className="w-20 h-20 overflow-hidden rounded flex-shrink-0">
                          <img 
                            src={related.image_url || "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3"} 
                            alt={related.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium group-hover:text-amber-600 transition-colors">
                            {related.title}
                          </h4>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhum post relacionado disponível</p>
                  )}
                </div>
              </div>
              
              {/* Categories */}
              <div className="bg-gray-50 p-6 rounded-xl mb-6">
                <h3 className="font-bold text-lg mb-4">Categorias</h3>
                <div className="space-y-2">
                  {post.categories?.map((category, idx) => (
                    <Link 
                      key={idx} 
                      to={`/blog?category=${category}`} 
                      className="flex justify-between items-center hover:text-amber-600 transition-colors py-2 border-b"
                    >
                      <span>{category}</span>
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="bg-amber-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2">Newsletter</h3>
                <p className="text-gray-600 mb-4">
                  Receba as melhores dicas de fotografia diretamente no seu email.
                </p>
                <div className="space-y-3">
                  <Input placeholder="Seu email" type="email" />
                  <Button className="w-full">Inscrever-se</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </MainLayout>
  );
};

export default BlogPost;
