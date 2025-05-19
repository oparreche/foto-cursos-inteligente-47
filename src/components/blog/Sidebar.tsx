
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type BlogPostType } from "@/hooks/useBlogPosts";

interface SidebarProps {
  post: BlogPostType;
  relatedPosts: BlogPostType[];
}

const Sidebar = ({ post, relatedPosts }: SidebarProps) => {
  return (
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
  );
};

export default Sidebar;
