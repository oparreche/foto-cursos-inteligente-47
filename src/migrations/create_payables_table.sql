-- Tabela para pagamentos
CREATE TABLE IF NOT EXISTS public.payables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  supplier TEXT NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled')),
  category_id UUID REFERENCES public.financial_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.payables ENABLE ROW LEVEL SECURITY;

-- Permitir que administradores gerenciem todos os pagamentos
CREATE POLICY "Administradores podem gerenciar todos os pagamentos"
  ON public.payables
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_payable_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp
CREATE TRIGGER set_payable_timestamp
  BEFORE UPDATE ON payables
  FOR EACH ROW
  EXECUTE PROCEDURE update_payable_timestamp();

-- Índices para melhorar performance
CREATE INDEX idx_payables_status ON payables(status);
CREATE INDEX idx_payables_due_date ON payables(due_date);
CREATE INDEX idx_payables_category_id ON payables(category_id);
