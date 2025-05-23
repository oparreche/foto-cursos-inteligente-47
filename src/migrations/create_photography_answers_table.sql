-- Tabela para respostas de fotografia
CREATE TABLE IF NOT EXISTS public.photography_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.photography_questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.photography_answers ENABLE ROW LEVEL SECURITY;

-- Permitir que administradores gerenciem todas as respostas
CREATE POLICY "Administradores podem gerenciar todas as respostas"
  ON public.photography_answers
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Permitir que todos os usuários visualizem as respostas
CREATE POLICY "Todos os usuários podem visualizar as respostas"
  ON public.photography_answers
  FOR SELECT
  USING (true);

-- Índices para melhorar performance
CREATE INDEX idx_photography_answers_question_id ON photography_answers(question_id);
