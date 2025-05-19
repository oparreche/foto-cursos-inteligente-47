
-- Tabela para armazenar transações de pagamento
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  pagarme_transaction_id TEXT UNIQUE,
  status TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  method TEXT NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  card_brand TEXT,
  installments INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Permitir que usuários vejam apenas suas próprias transações
CREATE POLICY "Usuários podem ver suas próprias transações"
  ON public.payment_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

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
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW
  EXECUTE PROCEDURE update_transaction_timestamp();

-- Índices para melhorar performance
CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
