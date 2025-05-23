-- Tabela para turmas
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  course_name TEXT NOT NULL,
  period TEXT NOT NULL,
  days TEXT NOT NULL,
  total_spots INTEGER NOT NULL DEFAULT 20,
  spots_available INTEGER NOT NULL DEFAULT 20,
  price NUMERIC(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Permitir que administradores gerenciem todas as turmas
CREATE POLICY "Administradores podem gerenciar todas as turmas"
  ON public.classes
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Permitir que todos os usuários visualizem turmas ativas
CREATE POLICY "Todos os usuários podem visualizar turmas ativas"
  ON public.classes
  FOR SELECT
  USING (is_active = true);

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_class_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp
CREATE TRIGGER set_class_timestamp
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE PROCEDURE update_class_timestamp();

-- Índices para melhorar performance
CREATE INDEX idx_classes_course_id ON classes(course_id);
CREATE INDEX idx_classes_is_active ON classes(is_active);
