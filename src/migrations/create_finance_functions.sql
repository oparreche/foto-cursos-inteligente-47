-- Função para calcular estatísticas financeiras
CREATE OR REPLACE FUNCTION get_financial_stats()
RETURNS JSON AS $$
DECLARE
  total_receivables NUMERIC;
  total_payables NUMERIC;
  pending_receivables NUMERIC;
  pending_payables NUMERIC;
  current_balance NUMERIC;
BEGIN
  -- Calcular total de recebíveis
  SELECT COALESCE(SUM(amount), 0) INTO total_receivables
  FROM public.receivables
  WHERE status != 'cancelled';
  
  -- Calcular total de pagamentos
  SELECT COALESCE(SUM(amount), 0) INTO total_payables
  FROM public.payables
  WHERE status != 'cancelled';
  
  -- Calcular recebíveis pendentes
  SELECT COALESCE(SUM(amount), 0) INTO pending_receivables
  FROM public.receivables
  WHERE status = 'pending';
  
  -- Calcular pagamentos pendentes
  SELECT COALESCE(SUM(amount), 0) INTO pending_payables
  FROM public.payables
  WHERE status = 'pending';
  
  -- Calcular saldo atual
  SELECT (
    (SELECT COALESCE(SUM(amount), 0) FROM public.receivables WHERE status = 'received') -
    (SELECT COALESCE(SUM(amount), 0) FROM public.payables WHERE status = 'paid')
  ) INTO current_balance;
  
  -- Retornar estatísticas como JSON
  RETURN json_build_object(
    'totalReceivables', total_receivables,
    'totalPayables', total_payables,
    'pendingReceivables', pending_receivables,
    'pendingPayables', pending_payables,
    'currentBalance', current_balance
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para registrar uma transação quando um recebível é marcado como recebido
CREATE OR REPLACE FUNCTION register_receivable_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o status mudou para 'received' e não havia uma transação anterior
  IF NEW.status = 'received' AND (OLD.status != 'received' OR OLD.status IS NULL) THEN
    -- Inserir uma transação de receita
    INSERT INTO public.transactions (
      description,
      amount,
      type,
      transaction_date,
      notes,
      reference_id,
      reference_type,
      created_by
    ) VALUES (
      'Recebimento: ' || NEW.description,
      NEW.amount,
      'income',
      NEW.payment_date,
      'Recebimento automático do recebível #' || NEW.id,
      NEW.id,
      'receivable',
      NEW.created_by
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para registrar transação quando um recebível é marcado como recebido
CREATE TRIGGER register_receivable_transaction_trigger
  AFTER UPDATE ON public.receivables
  FOR EACH ROW
  WHEN (NEW.status = 'received' AND (OLD.status != 'received' OR OLD.status IS NULL))
  EXECUTE PROCEDURE register_receivable_transaction();

-- Função para registrar uma transação quando um pagamento é marcado como pago
CREATE OR REPLACE FUNCTION register_payable_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o status mudou para 'paid' e não havia uma transação anterior
  IF NEW.status = 'paid' AND (OLD.status != 'paid' OR OLD.status IS NULL) THEN
    -- Inserir uma transação de despesa
    INSERT INTO public.transactions (
      description,
      amount,
      type,
      transaction_date,
      notes,
      reference_id,
      reference_type,
      created_by
    ) VALUES (
      'Pagamento: ' || NEW.description,
      NEW.amount,
      'expense',
      NEW.payment_date,
      'Pagamento automático do pagável #' || NEW.id,
      NEW.id,
      'payable',
      NEW.created_by
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para registrar transação quando um pagamento é marcado como pago
CREATE TRIGGER register_payable_transaction_trigger
  AFTER UPDATE ON public.payables
  FOR EACH ROW
  WHEN (NEW.status = 'paid' AND (OLD.status != 'paid' OR OLD.status IS NULL))
  EXECUTE PROCEDURE register_payable_transaction();
