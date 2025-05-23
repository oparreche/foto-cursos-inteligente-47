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
