
-- Function to get published blog posts with pagination
CREATE OR REPLACE FUNCTION public.get_published_blog_posts(
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0,
  p_category TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  excerpt TEXT,
  slug TEXT,
  image_url TEXT,
  categories TEXT[],
  author TEXT,
  read_time TEXT,
  published_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.title,
    b.excerpt,
    b.slug,
    b.image_url,
    b.categories,
    b.author,
    b.read_time,
    b.published_at
  FROM public.blog_posts b
  WHERE 
    b.status = 'published'
    AND b.published_at <= now()
    AND (p_category IS NULL OR p_category = ANY(b.categories))
  ORDER BY b.published_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Function to get blog post by slug
CREATE OR REPLACE FUNCTION public.get_blog_post_by_slug(p_slug TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  excerpt TEXT,
  slug TEXT,
  image_url TEXT,
  categories TEXT[],
  author TEXT,
  author_id UUID,
  read_time TEXT,
  published_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.title,
    b.content,
    b.excerpt,
    b.slug,
    b.image_url,
    b.categories,
    b.author,
    b.author_id,
    b.read_time,
    b.published_at
  FROM public.blog_posts b
  WHERE 
    b.slug = p_slug
    AND b.status = 'published'
    AND b.published_at <= now();
END;
$$;

-- Function to get distinct blog categories
CREATE OR REPLACE FUNCTION public.get_blog_categories()
RETURNS TABLE (
  category TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT unnest(categories)
  FROM public.blog_posts
  WHERE status = 'published'
  ORDER BY 1;
END;
$$;
