
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

// Mock post data
const post = {
  title: "Como Tirar Fotos Profissionais com Celular",
  slug: "fotos-profissionais-com-celular",
  image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3",
  excerpt: "Dicas práticas para usar o celular como uma câmera de alta performance.",
  author: {
    name: "Ana Mendes",
    role: "Fotógrafa Profissional",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3",
  },
  date: "12 Jun 2023",
  readTime: "5 min",
  categories: ["Dicas", "Mobile"],
  content: `
    <p>A fotografia com smartphone evoluiu incrivelmente nos últimos anos. Com os avanços tecnológicos dos celulares modernos, é possível capturar imagens de qualidade profissional sem a necessidade de equipamentos caros e volumosos.</p>
    
    <h2>1. Conheça bem a câmera do seu celular</h2>
    
    <p>Antes de mais nada, é essencial explorar todas as funcionalidades que a câmera do seu smartphone oferece. A maioria dos aparelhos modernos possui:</p>
    
    <ul>
      <li>Modo retrato (com desfoque de fundo)</li>
      <li>Modo noturno</li>
      <li>HDR (High Dynamic Range)</li>
      <li>Controles manuais (ISO, velocidade do obturador, balanço de branco)</li>
      <li>Diferentes lentes (grande angular, telefoto, etc.)</li>
    </ul>
    
    <p>Dedique tempo para entender cada função e como ela pode ser aplicada em diferentes situações.</p>
    
    <h2>2. Iluminação é tudo</h2>
    
    <p>A luz é o elemento mais importante na fotografia, independentemente da câmera utilizada. Para obter resultados profissionais:</p>
    
    <ul>
      <li>Prefira luz natural, especialmente durante a "hora dourada" (nascer e pôr do sol)</li>
      <li>Evite contraluz forte, a menos que queira criar silhuetas</li>
      <li>Em ambientes internos, posicione o objeto próximo a janelas</li>
      <li>Considere usar um pequeno rebatedor (pode ser uma folha de papel branco) para preencher sombras</li>
    </ul>
    
    <h2>3. Composição é a chave</h2>
    
    <p>Uma boa composição transforma uma foto comum em uma imagem memorável. Aplique estas técnicas:</p>
    
    <ul>
      <li>Regra dos terços: divida a imagem em uma grade 3x3 e posicione elementos de interesse nas intersecções</li>
      <li>Linhas guias: use linhas naturais para direcionar o olhar do espectador</li>
      <li>Enquadramento: use elementos do ambiente para emoldurar seu objeto principal</li>
      <li>Perspectiva: experimente fotografar de ângulos diferentes (de cima, de baixo, etc.)</li>
    </ul>
    
    <h2>4. Aplicativos de edição fazem a diferença</h2>
    
    <p>A edição é parte fundamental do processo fotográfico profissional. Alguns apps recomendados:</p>
    
    <ul>
      <li>Lightroom Mobile: o mais completo para ajustes profissionais</li>
      <li>Snapseed: versátil e gratuito, com ferramentas poderosas</li>
      <li>VSCO: excelentes filtros para diferentes estilos fotográficos</li>
      <li>Photoshop Express: versão simplificada do famoso editor</li>
    </ul>
    
    <h2>5. Acessórios que elevam suas fotos</h2>
    
    <p>Alguns acessórios acessíveis podem transformar completamente suas fotografias:</p>
    
    <ul>
      <li>Mini tripé: essencial para fotos noturnas e de longa exposição</li>
      <li>Lentes clip-on: macro, grande angular ou olho de peixe</li>
      <li>Luz LED portátil: para iluminar cenas em ambientes escuros</li>
      <li>Gimbal: estabilizador para vídeos sem tremidos</li>
    </ul>
  `,
  faq: [
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
  ],
  relatedPosts: [
    {
      id: 2,
      title: "Os 5 Erros Mais Comuns de Iniciantes na Fotografia",
      slug: "erros-iniciantes-fotografia",
      image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3"
    },
    {
      id: 4,
      title: "Qual a Melhor Câmera para Começar?",
      slug: "melhor-camera-para-iniciantes",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3"
    },
    {
      id: 9,
      title: "Como Editar Suas Fotos Gratuitamente",
      slug: "editar-fotos-gratis",
      image: "https://images.unsplash.com/photo-1505238680356-667803448bb6?ixlib=rb-4.0.3"
    }
  ]
};

const BlogPost = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In a real application, we would fetch the post data based on the slug
  useEffect(() => {
    // Simulating data fetching
    console.log(`Fetching post with slug: ${slug}`);
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

  return (
    <MainLayout>
      <article className="bg-white">
        {/* Hero Section */}
        <header className="bg-photo-dark text-white relative">
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${post.image})` }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50"></div>
          <div className="container mx-auto px-4 py-20 md:py-28 relative">
            <div className="max-w-3xl mx-auto">
              <Link to="/blog" className="inline-flex items-center text-amber-300 hover:text-amber-200 mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Blog
              </Link>
              <div className="space-y-2 mb-4">
                {post.categories.map((category, idx) => (
                  <Badge key={idx} variant="outline" className="border-amber-400 text-amber-200 mr-2">
                    {category}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6">{post.title}</h1>
              <p className="text-xl text-gray-300 mb-8">{post.excerpt}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold">{post.author.name}</div>
                  <div className="text-sm text-gray-300">{post.author.role}</div>
                </div>
                <Separator orientation="vertical" className="h-8 bg-gray-500" />
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span className="text-sm">{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span className="text-sm">{post.readTime} de leitura</span>
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
                  dangerouslySetInnerHTML={{ __html: post.content }}
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
                    {post.faq.map((item, idx) => (
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
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Sobre {post.author.name}</h3>
                      <div className="text-amber-600 mb-2">{post.author.role}</div>
                      <p className="text-gray-600">
                        Fotógrafa profissional com mais de 10 anos de experiência em fotografia de retratos e eventos. 
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
                  {post.relatedPosts.map((related) => (
                    <Link 
                      key={related.id} 
                      to={`/blog/${related.slug}`}
                      className="flex items-start gap-3 group"
                    >
                      <div className="w-20 h-20 overflow-hidden rounded flex-shrink-0">
                        <img 
                          src={related.image} 
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
                  ))}
                </div>
              </div>
              
              {/* Categories */}
              <div className="bg-gray-50 p-6 rounded-xl mb-6">
                <h3 className="font-bold text-lg mb-4">Categorias</h3>
                <div className="space-y-2">
                  <Link to="/blog?category=dicas" className="flex justify-between items-center hover:text-amber-600 transition-colors py-2 border-b">
                    <span>Dicas</span>
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                  <Link to="/blog?category=mobile" className="flex justify-between items-center hover:text-amber-600 transition-colors py-2 border-b">
                    <span>Mobile</span>
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                  <Link to="/blog?category=equipamentos" className="flex justify-between items-center hover:text-amber-600 transition-colors py-2 border-b">
                    <span>Equipamentos</span>
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                  <Link to="/blog?category=composicao" className="flex justify-between items-center hover:text-amber-600 transition-colors py-2 border-b">
                    <span>Composição</span>
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                  <Link to="/blog?category=carreira" className="flex justify-between items-center hover:text-amber-600 transition-colors py-2 border-b">
                    <span>Carreira</span>
                    <ChevronRight className="h-5 w-5" />
                  </Link>
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
