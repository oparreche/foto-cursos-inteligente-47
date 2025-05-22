
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
