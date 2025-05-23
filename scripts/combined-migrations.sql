-- Início da migração: ../src/migrations/create_has_role_function.sql
-- Definir o tipo de enum para funções de usuário (necessário para a função has_role)
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin', 'instructor', 'student');

-- Função para verificar se um usuário tem uma determinada função
-- Esta função precisa ser criada antes de qualquer política de segurança que a utilize
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role user_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = $1
    AND user_roles.role = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Fim da migração: ../src/migrations/create_has_role_function.sql

-- Início da migração: ../src/migrations/create_user_roles_table.sql
-- Tabela para funções de usuários (o tipo user_role já foi criado anteriormente)
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  PRIMARY KEY (user_id, role)
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Permitir que super_admin gerencie todas as funções
CREATE POLICY "Super administradores podem gerenciar todas as funções"
  ON public.user_roles
  USING (public.has_role(auth.uid(), 'super_admin'::user_role));

-- Permitir que administradores vejam todas as funções
CREATE POLICY "Administradores podem ver todas as funções"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Permitir que usuários vejam sua própria função
CREATE POLICY "Usuários podem ver sua própria função"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- A função has_role já foi criada anteriormente

-- Trigger para atribuir a função 'user' automaticamente a novos usuários
CREATE OR REPLACE FUNCTION assign_default_role_to_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::user_role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Adicionar o trigger para atribuir função automaticamente
CREATE TRIGGER assign_default_role_after_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE assign_default_role_to_new_user();


-- Fim da migração: ../src/migrations/create_user_roles_table.sql

-- Início da migração: ../src/migrations/create_role_permissions_table.sql
-- Tabela para permissões de funções
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role user_role NOT NULL,
  module TEXT NOT NULL,
  can_view BOOLEAN NOT NULL DEFAULT false,
  can_create BOOLEAN NOT NULL DEFAULT false,
  can_edit BOOLEAN NOT NULL DEFAULT false,
  can_delete BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (role, module)
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Permitir que super_admin gerencie todas as permissões
CREATE POLICY "Super administradores podem gerenciar todas as permissões"
  ON public.role_permissions
  USING (public.has_role(auth.uid(), 'super_admin'::user_role));

-- Permitir que administradores vejam todas as permissões
CREATE POLICY "Administradores podem ver todas as permissões"
  ON public.role_permissions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Inserir permissões padrão
INSERT INTO public.role_permissions (role, module, can_view, can_create, can_edit, can_delete)
VALUES
  -- Super Admin tem todas as permissões em todos os módulos
  ('super_admin', 'users', true, true, true, true),
  ('super_admin', 'courses', true, true, true, true),
  ('super_admin', 'classes', true, true, true, true),
  ('super_admin', 'enrollments', true, true, true, true),
  ('super_admin', 'finance', true, true, true, true),
  ('super_admin', 'blog', true, true, true, true),
  ('super_admin', 'settings', true, true, true, true),
  
  -- Admin tem permissões em quase todos os módulos
  ('admin', 'users', true, true, true, false),
  ('admin', 'courses', true, true, true, true),
  ('admin', 'classes', true, true, true, true),
  ('admin', 'enrollments', true, true, true, true),
  ('admin', 'finance', true, true, true, true),
  ('admin', 'blog', true, true, true, true),
  ('admin', 'settings', true, false, false, false),
  
  -- Instrutor tem permissões limitadas
  ('instructor', 'courses', true, false, false, false),
  ('instructor', 'classes', true, true, true, false),
  ('instructor', 'enrollments', true, false, false, false),
  
  -- Estudante tem permissões muito limitadas
  ('student', 'courses', true, false, false, false),
  ('student', 'classes', true, false, false, false),
  
  -- Usuário comum tem permissões básicas
  ('user', 'courses', true, false, false, false),
  ('user', 'classes', true, false, false, false)
ON CONFLICT (role, module) DO NOTHING;


-- Fim da migração: ../src/migrations/create_role_permissions_table.sql

-- Início da migração: ../src/migrations/create_profiles_table.sql
-- Tabela para perfis de usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  cpf TEXT,
  birth_date DATE,
  phone TEXT,
  address TEXT,
  address_number TEXT,
  address_complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Permitir que usuários vejam e editem apenas seu próprio perfil
CREATE POLICY "Usuários podem ver e editar seu próprio perfil"
  ON public.profiles
  USING (auth.uid() = id);

-- Permitir que administradores vejam todos os perfis
CREATE POLICY "Administradores podem ver todos os perfis"
  ON public.profiles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp
CREATE TRIGGER set_profile_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_profile_timestamp();

-- Trigger para criar perfil automaticamente quando um novo usuário é criado
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Adicionar o trigger para criar perfil automaticamente
CREATE TRIGGER create_profile_after_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE create_profile_for_new_user();


-- Fim da migração: ../src/migrations/create_profiles_table.sql

-- Início da migração: ../src/migrations/create_courses_table.sql
-- Tabela para cursos
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Permitir que administradores gerenciem todos os cursos
CREATE POLICY "Administradores podem gerenciar todos os cursos"
  ON public.courses
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Permitir que todos os usuários visualizem cursos ativos
CREATE POLICY "Todos os usuários podem visualizar cursos ativos"
  ON public.courses
  FOR SELECT
  USING (is_active = true);

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_course_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp
CREATE TRIGGER set_course_timestamp
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE PROCEDURE update_course_timestamp();

-- Índices para melhorar performance
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_is_active ON courses(is_active);


-- Fim da migração: ../src/migrations/create_courses_table.sql

-- Início da migração: ../src/migrations/create_classes_table.sql
-- Tabela para turmas
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  course_name TEXT NOT NULL,
  period TEXT NOT NULL,
  days TEXT NOT NULL,
  total_spots INTEGER NOT NULL DEFAULT 20,
  spots_available INTEGER NOT NULL DEFAULT 20,
  price NUMERIC(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Permitir que administradores gerenciem todas as turmas
CREATE POLICY "Administradores podem gerenciar todas as turmas"
  ON public.classes
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Permitir que todos os usuários visualizem turmas ativas
CREATE POLICY "Todos os usuários podem visualizar turmas ativas"
  ON public.classes
  FOR SELECT
  USING (is_active = true);

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_class_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp
CREATE TRIGGER set_class_timestamp
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE PROCEDURE update_class_timestamp();

-- Índices para melhorar performance
CREATE INDEX idx_classes_course_id ON classes(course_id);
CREATE INDEX idx_classes_is_active ON classes(is_active);


-- Fim da migração: ../src/migrations/create_classes_table.sql

-- Início da migração: ../src/migrations/create_discount_coupons_table.sql
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


-- Fim da migração: ../src/migrations/create_discount_coupons_table.sql

-- Início da migração: ../src/migrations/create_manual_enrollments_table.sql
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


-- Fim da migração: ../src/migrations/create_manual_enrollments_table.sql

-- Início da migração: ../src/migrations/create_financial_categories_table.sql
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


-- Fim da migração: ../src/migrations/create_financial_categories_table.sql

-- Início da migração: ../src/migrations/create_receivables_table.sql
-- Tabela para recebíveis
CREATE TABLE IF NOT EXISTS public.receivables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  customer TEXT NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'received', 'cancelled')),
  category_id UUID REFERENCES public.financial_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.receivables ENABLE ROW LEVEL SECURITY;

-- Permitir que administradores gerenciem todos os recebíveis
CREATE POLICY "Administradores podem gerenciar todos os recebíveis"
  ON public.receivables
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_receivable_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp
CREATE TRIGGER set_receivable_timestamp
  BEFORE UPDATE ON receivables
  FOR EACH ROW
  EXECUTE PROCEDURE update_receivable_timestamp();

-- Índices para melhorar performance
CREATE INDEX idx_receivables_status ON receivables(status);
CREATE INDEX idx_receivables_due_date ON receivables(due_date);
CREATE INDEX idx_receivables_category_id ON receivables(category_id);


-- Fim da migração: ../src/migrations/create_receivables_table.sql

-- Início da migração: ../src/migrations/create_payables_table.sql
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


-- Fim da migração: ../src/migrations/create_payables_table.sql

-- Início da migração: ../src/migrations/create_transactions_table.sql
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


-- Fim da migração: ../src/migrations/create_transactions_table.sql

-- Início da migração: ../src/migrations/create_finance_functions.sql
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


-- Fim da migração: ../src/migrations/create_finance_functions.sql

-- Início da migração: ../src/migrations/create_blog_posts_table.sql
-- Tabela para posts do blog
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Permitir que administradores gerenciem todos os posts
CREATE POLICY "Administradores podem gerenciar todos os posts"
  ON public.blog_posts
  USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
         public.has_role(auth.uid(), 'super_admin'::user_role));

-- Permitir que autores gerenciem seus próprios posts
CREATE POLICY "Autores podem gerenciar seus próprios posts"
  ON public.blog_posts
  USING (auth.uid() = author_id);

-- Permitir que todos os usuários visualizem posts publicados
CREATE POLICY "Todos os usuários podem visualizar posts publicados"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'published');

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_blog_post_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp
CREATE TRIGGER set_blog_post_timestamp
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE PROCEDURE update_blog_post_timestamp();

-- Índices para melhorar performance
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);


-- Fim da migração: ../src/migrations/create_blog_posts_table.sql

-- Início da migração: ../src/migrations/create_newsletter_subscribers_table.sql

-- Table for newsletter subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT TRUE,
  source TEXT -- To track where the subscription came from
);

-- Add row-level security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Only allow admins to view and modify
CREATE POLICY newsletter_admin_all ON public.newsletter_subscribers 
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create index for faster lookups
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_active ON newsletter_subscribers(active);


-- Fim da migração: ../src/migrations/create_newsletter_subscribers_table.sql

-- Início da migração: ../src/migrations/create_photography_questions_table.sql
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


-- Fim da migração: ../src/migrations/create_photography_questions_table.sql

-- Início da migração: ../src/migrations/create_photography_answers_table.sql
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


-- Fim da migração: ../src/migrations/create_photography_answers_table.sql

-- Início da migração: ../src/migrations/create_quiz_scores_table.sql
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


-- Fim da migração: ../src/migrations/create_quiz_scores_table.sql

-- Início da migração: ../src/migrations/create_ai_settings_table.sql

-- Create AI settings table
CREATE TABLE IF NOT EXISTS public.ai_settings (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    provider TEXT,
    model TEXT,
    api_key TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Add a row level security policy to restrict access
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;

-- Only allow super_admin role to update the settings
CREATE POLICY ai_settings_super_admin_all ON public.ai_settings
    USING (public.has_role(auth.uid(), 'super_admin'::user_role));

-- Allow admins to read settings
CREATE POLICY ai_settings_admin_read ON public.ai_settings 
    FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'::user_role) OR 
           public.has_role(auth.uid(), 'super_admin'::user_role));

-- Insert a default empty row
INSERT INTO public.ai_settings (id, provider, model, api_key)
VALUES (1, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;


-- Fim da migração: ../src/migrations/create_ai_settings_table.sql

-- Início da migração: ../src/migrations/create_ai_settings_functions.sql

-- Function to get AI settings
CREATE OR REPLACE FUNCTION public.get_ai_settings()
RETURNS TABLE (
  id BIGINT,
  provider TEXT,
  model TEXT,
  api_key TEXT,
  last_updated TIMESTAMP WITH TIME ZONE,
  updated_by UUID
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.provider,
    a.model,
    a.api_key,
    a.last_updated,
    a.updated_by
  FROM public.ai_settings a
  WHERE a.id = 1;
END;
$$;

-- Function to update AI settings
CREATE OR REPLACE FUNCTION public.update_ai_settings(
  p_provider TEXT,
  p_model TEXT,
  p_api_key TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.ai_settings
  SET 
    provider = p_provider,
    model = p_model,
    api_key = p_api_key,
    last_updated = now(),
    updated_by = auth.uid()
  WHERE id = 1;
END;
$$;


-- Fim da migração: ../src/migrations/create_ai_settings_functions.sql

-- Início da migração: ../src/migrations/create_profiles_functions.sql

-- Function to get a user profile by ID
CREATE OR REPLACE FUNCTION public.get_user_profile(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  cpf TEXT,
  birth_date DATE,
  phone TEXT,
  address TEXT,
  address_number TEXT,
  address_complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.first_name,
    p.last_name,
    p.cpf,
    p.birth_date::DATE,
    p.phone,
    p.address,
    p.address_number,
    p.address_complement,
    p.neighborhood,
    p.city,
    p.state,
    p.postal_code,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.id = p_user_id;
END;
$$;

-- Function to get a user's roles
CREATE OR REPLACE FUNCTION public.get_user_roles(p_user_id UUID)
RETURNS TABLE (
  role_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT ur.role
  FROM public.user_roles ur
  WHERE ur.user_id = p_user_id;
END;
$$;

-- Function to update a user profile
CREATE OR REPLACE FUNCTION public.update_user_profile(
  p_user_id UUID,
  p_first_name TEXT,
  p_last_name TEXT,
  p_cpf TEXT,
  p_birth_date DATE,
  p_phone TEXT,
  p_address TEXT,
  p_address_number TEXT,
  p_address_complement TEXT,
  p_neighborhood TEXT,
  p_city TEXT,
  p_state TEXT,
  p_postal_code TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result BOOLEAN;
BEGIN
  UPDATE public.profiles
  SET 
    first_name = COALESCE(p_first_name, first_name),
    last_name = COALESCE(p_last_name, last_name),
    cpf = COALESCE(p_cpf, cpf),
    birth_date = COALESCE(p_birth_date, birth_date),
    phone = COALESCE(p_phone, phone),
    address = COALESCE(p_address, address),
    address_number = COALESCE(p_address_number, address_number),
    address_complement = COALESCE(p_address_complement, address_complement),
    neighborhood = COALESCE(p_neighborhood, neighborhood),
    city = COALESCE(p_city, city),
    state = COALESCE(p_state, state),
    postal_code = COALESCE(p_postal_code, postal_code),
    updated_at = now()
  WHERE id = p_user_id;
  
  GET DIAGNOSTICS v_result = ROW_COUNT;
  RETURN v_result > 0;
END;
$$;


-- Fim da migração: ../src/migrations/create_profiles_functions.sql

