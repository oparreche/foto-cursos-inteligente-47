
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
