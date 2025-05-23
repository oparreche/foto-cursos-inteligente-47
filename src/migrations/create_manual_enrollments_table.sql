-- Tabela para matrículas manuais
CREATE TABLE IF NOT EXISTS public.manual_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'overdue', 'canceled')),
  enrollment_date DATE DEFAULT CURRENT_DATE,
  payment_amount NUMERIC(10, 2) NOT NULL,
  original_amount NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2),
  coupon_id UUID REFERENCES public.discount_coupons(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.manual_enrollments ENABLE ROW LEVEL SECURITY;

-- Permitir que administradores gerenciem todas as matrículas
CREATE POLICY "Administradores podem gerenciar todas as matrículas"
  ON public.manual_enrollments
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Permitir que estudantes vejam suas próprias matrículas
CREATE POLICY "Estudantes podem ver suas próprias matrículas"
  ON public.manual_enrollments
  FOR SELECT
  USING (auth.uid() = student_id);

-- Função para atualizar vagas disponíveis na turma quando uma matrícula é criada
CREATE OR REPLACE FUNCTION update_class_spots_after_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  -- Reduzir o número de vagas disponíveis na turma
  UPDATE public.classes
  SET spots_available = spots_available - 1
  WHERE id = NEW.class_id AND spots_available > 0;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar vagas disponíveis
CREATE TRIGGER update_spots_after_enrollment
  AFTER INSERT ON public.manual_enrollments
  FOR EACH ROW
  EXECUTE PROCEDURE update_class_spots_after_enrollment();

-- Função para atualizar o uso do cupom quando uma matrícula é criada
CREATE OR REPLACE FUNCTION update_coupon_usage_after_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  -- Se um cupom foi usado, incrementar o contador de usos
  IF NEW.coupon_id IS NOT NULL THEN
    UPDATE public.discount_coupons
    SET current_uses = current_uses + 1
    WHERE id = NEW.coupon_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar uso do cupom
CREATE TRIGGER update_coupon_after_enrollment
  AFTER INSERT ON public.manual_enrollments
  FOR EACH ROW
  WHEN (NEW.coupon_id IS NOT NULL)
  EXECUTE PROCEDURE update_coupon_usage_after_enrollment();
