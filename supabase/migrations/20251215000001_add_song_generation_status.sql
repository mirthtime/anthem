-- Add status and error_message columns to songs table for tracking generation progress
ALTER TABLE public.songs 
ADD COLUMN status TEXT DEFAULT 'completed' CHECK (status IN ('generating', 'completed', 'failed')),
ADD COLUMN error_message TEXT;

-- Update existing songs to have completed status
UPDATE public.songs SET status = 'completed' WHERE status IS NULL;