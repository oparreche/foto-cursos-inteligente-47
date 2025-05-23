-- Tabela para cupons de desconto
CREATE TABLE IF NOT EXISTS public.discount_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value NUMERIC(10, 2) NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from DATE NOT NULL,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.discount_coupons ENABLE ROW LEVEL SECURITY;

-- Permitir que administradores gerenciem todos os cupons
CREATE POLICY "Administradores podem gerenciar todos os cupons"
  ON public.discount_coupons
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Função para verificar se um cupom é válido
CREATE OR REPLACE FUNCTION is_coupon_valid(coupon_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  coupon discount_coupons;
  current_date DATE := CURRENT_DATE;
BEGIN
  SELECT * INTO coupon FROM public.discount_coupons WHERE id = coupon_id;
  
  -- Verificar se o cupom existe
  IF coupon IS NULL THEN
    RETURN false;
  END IF;
  
  -- Verificar se o cupom está ativo
  IF NOT coupon.is_active THEN
    RETURN false;
  END IF;
  
  -- Verificar se o cupom está dentro do período de validade
  IF coupon.valid_from > current_date OR 
     (coupon.valid_until IS NOT NULL AND coupon.valid_until < current_date) THEN
    RETURN false;
  END IF;
  
  -- Verificar se o cupom atingiu o número máximo de usos
  IF coupon.max_uses IS NOT NULL AND coupon.current_uses >= coupon.max_uses THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;
