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
