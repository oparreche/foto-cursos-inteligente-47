-- Tabela para cursos
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Permitir que administradores gerenciem todos os cursos
CREATE POLICY "Administradores podem gerenciar todos os cursos"
  ON public.courses
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Permitir que todos os usuários visualizem cursos ativos
CREATE POLICY "Todos os usuários podem visualizar cursos ativos"
  ON public.courses
  FOR SELECT
  USING (is_active = true);

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_course_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp
CREATE TRIGGER set_course_timestamp
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE PROCEDURE update_course_timestamp();

-- Índices para melhorar performance
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_is_active ON courses(is_active);
