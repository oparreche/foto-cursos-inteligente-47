
import { Clock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const posts = [
  {
    id: 1,
    title: "Como Tirar Fotos Profissionais com Celular",
    slug: "fotos-profissionais-com-celular",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3",
    excerpt: "Dicas práticas para usar o celular como uma câmera de alta performance.",
    author: "Ana Mendes",
    date: "12 Jun 2023",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "Os 5 Erros Mais Comuns de Iniciantes na Fotografia",
    slug: "erros-iniciantes-fotografia",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3",
    excerpt: "Evite estes erros e acelere seu aprendizado na fotografia.",
    author: "Carlos Silva",
    date: "5 Jun 2023",
    readTime: "4 min",
  },
  {
    id: 3,
    title: "Fotografia Noturna: Técnicas e Equipamentos",
    slug: "fotografia-noturna-tecnicas",
    image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?ixlib=rb-4.0.3",
    excerpt: "Aprenda como fotografar com pouca luz de forma nítida e criativa.",
    author: "Fernanda Costa",
    date: "28 Mai 2023",
    readTime: "7 min",
  },
];

const BlogPreviewSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title">Blog de Fotografia</h2>
          <p className="text-lg text-gray-600 mt-6">
            Dicas, tutoriais e novidades do mundo da fotografia para inspirar sua jornada
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 hover:text-amber-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="text-lg group" asChild>
            <Link to="/blog">
              Ver todos os artigos
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
