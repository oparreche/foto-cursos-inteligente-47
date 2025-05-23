-- Tabela para transações financeiras
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer', 'refund')),
  transaction_date DATE NOT NULL,
  notes TEXT,
  reference_id UUID,
  reference_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Permitir que administradores gerenciem todas as transações
CREATE POLICY "Administradores podem gerenciar todas as transações"
  ON public.transactions
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_transaction_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp
CREATE TRIGGER set_transaction_timestamp
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE PROCEDURE update_transaction_timestamp();

-- Índices para melhorar performance
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_reference ON transactions(reference_id, reference_type);
