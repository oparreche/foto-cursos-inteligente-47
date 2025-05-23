-- Tabela para pontuações de quiz
CREATE TABLE IF NOT EXISTS public.quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  date_played TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;

-- Permitir que usuários vejam suas próprias pontuações
CREATE POLICY "Usuários podem ver suas próprias pontuações"
  ON public.quiz_scores
  USING (auth.uid() = user_id);

-- Permitir que administradores vejam todas as pontuações
CREATE POLICY "Administradores podem ver todas as pontuações"
  ON public.quiz_scores
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Índices para melhorar performance
CREATE INDEX idx_quiz_scores_user_id ON quiz_scores(user_id);
CREATE INDEX idx_quiz_scores_date_played ON quiz_scores(date_played);
