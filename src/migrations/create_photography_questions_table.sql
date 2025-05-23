-- Tabela para perguntas de fotografia
CREATE TABLE IF NOT EXISTS public.photography_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.photography_questions ENABLE ROW LEVEL SECURITY;

-- Permitir que administradores gerenciem todas as perguntas
CREATE POLICY "Administradores podem gerenciar todas as perguntas"
  ON public.photography_questions
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Permitir que todos os usuários visualizem as perguntas
CREATE POLICY "Todos os usuários podem visualizar as perguntas"
  ON public.photography_questions
  FOR SELECT
  USING (true);

-- Índices para melhorar performance
CREATE INDEX idx_photography_questions_category ON photography_questions(category);
CREATE INDEX idx_photography_questions_difficulty ON photography_questions(difficulty);
