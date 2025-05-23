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
