-- Tabela para categorias financeiras
CREATE TABLE IF NOT EXISTS public.financial_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  description TEXT,
  color TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.financial_categories ENABLE ROW LEVEL SECURITY;

-- Permitir que administradores gerenciem todas as categorias
CREATE POLICY "Administradores podem gerenciar todas as categorias"
  ON public.financial_categories
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_financial_category_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp
CREATE TRIGGER set_financial_category_timestamp
  BEFORE UPDATE ON financial_categories
  FOR EACH ROW
  EXECUTE PROCEDURE update_financial_category_timestamp();

-- Inserir categorias padrão
INSERT INTO public.financial_categories (name, type, description, color, icon)
VALUES 
  ('Mensalidades', 'income', 'Receitas de mensalidades de cursos', '#4CAF50', 'school'),
  ('Vendas de Cursos', 'income', 'Receitas de vendas de cursos individuais', '#2196F3', 'book'),
  ('Workshops', 'income', 'Receitas de workshops e eventos especiais', '#9C27B0', 'event'),
  ('Consultorias', 'income', 'Receitas de serviços de consultoria', '#FF9800', 'work'),
  ('Outros Recebimentos', 'income', 'Outras fontes de receita', '#607D8B', 'payments'),
  ('Salários', 'expense', 'Pagamentos de salários e benefícios', '#F44336', 'payments'),
  ('Marketing', 'expense', 'Despesas com publicidade e marketing', '#E91E63', 'campaign'),
  ('Infraestrutura', 'expense', 'Despesas com infraestrutura e equipamentos', '#673AB7', 'computer'),
  ('Serviços', 'expense', 'Despesas com serviços terceirizados', '#3F51B5', 'handyman'),
  ('Impostos', 'expense', 'Pagamentos de impostos e taxas', '#795548', 'receipt'),
  ('Outros Pagamentos', 'expense', 'Outras despesas diversas', '#9E9E9E', 'payments')
ON CONFLICT DO NOTHING;
