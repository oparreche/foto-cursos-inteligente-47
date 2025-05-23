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
