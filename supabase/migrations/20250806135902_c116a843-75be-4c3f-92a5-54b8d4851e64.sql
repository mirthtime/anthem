-- Create trips table
CREATE TABLE public.trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  stops JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create songs table
CREATE TABLE public.songs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID,
  title TEXT NOT NULL,
  stop_name TEXT NOT NULL,
  genre TEXT NOT NULL,
  prompt TEXT NOT NULL,
  audio_url TEXT,
  lyrics TEXT,
  duration INTEGER DEFAULT 30,
  stories TEXT,
  people TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Create policies for trips
CREATE POLICY "Users can view their own trips" 
ON public.trips 
FOR SELECT 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can create trips" 
ON public.trips 
FOR INSERT 
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can update their own trips" 
ON public.trips 
FOR UPDATE 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can delete their own trips" 
ON public.trips 
FOR DELETE 
USING (user_id = auth.uid() OR user_id IS NULL);

-- Create policies for songs
CREATE POLICY "Users can view their own songs" 
ON public.songs 
FOR SELECT 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can create songs" 
ON public.songs 
FOR INSERT 
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can update their own songs" 
ON public.songs 
FOR UPDATE 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can delete their own songs" 
ON public.songs 
FOR DELETE 
USING (user_id = auth.uid() OR user_id IS NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_trips_updated_at
BEFORE UPDATE ON public.trips
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();