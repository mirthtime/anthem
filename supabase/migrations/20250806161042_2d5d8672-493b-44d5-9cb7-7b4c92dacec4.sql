-- Add artwork URLs to songs and trips
ALTER TABLE public.songs 
ADD COLUMN artwork_url TEXT,
ADD COLUMN artwork_generating BOOLEAN DEFAULT FALSE;

ALTER TABLE public.trips 
ADD COLUMN artwork_url TEXT,
ADD COLUMN artwork_generating BOOLEAN DEFAULT FALSE;