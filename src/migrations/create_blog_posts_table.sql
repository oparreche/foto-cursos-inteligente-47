-- Tabela para posts do blog
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Permitir que administradores gerenciem todos os posts
CREATE POLICY "Administradores podem gerenciar todos os posts"
  ON public.blog_posts
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Permitir que autores gerenciem seus próprios posts
CREATE POLICY "Autores podem gerenciar seus próprios posts"
  ON public.blog_posts
  USING (auth.uid() = author_id);

-- Permitir que todos os usuários visualizem posts publicados
CREATE POLICY "Todos os usuários podem visualizar posts publicados"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'published');

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_blog_post_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp
CREATE TRIGGER set_blog_post_timestamp
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE PROCEDURE update_blog_post_timestamp();

-- Índices para melhorar performance
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
