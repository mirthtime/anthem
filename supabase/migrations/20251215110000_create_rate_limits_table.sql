-- Create rate limits table for tracking API usage
CREATE TABLE public.rate_limits (
  key TEXT PRIMARY KEY,
  requests JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can access rate limits
CREATE POLICY "Service role only" ON public.rate_limits
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Create index for faster lookups
CREATE INDEX idx_rate_limits_key ON public.rate_limits(key);

-- Add cleanup function to remove old rate limit entries
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rate_limits
  WHERE updated_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule cleanup (if pg_cron is available)
-- Note: This requires pg_cron extension to be enabled in Supabase
-- You can also run this cleanup manually or via a scheduled Edge Function