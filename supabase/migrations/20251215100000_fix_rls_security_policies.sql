-- Fix RLS policies to remove user_id IS NULL conditions that allow unauthenticated access

-- Drop existing insecure policies for trips
DROP POLICY IF EXISTS "Users can view their own trips" ON public.trips;
DROP POLICY IF EXISTS "Users can create trips" ON public.trips;
DROP POLICY IF EXISTS "Users can update their own trips" ON public.trips;
DROP POLICY IF EXISTS "Users can delete their own trips" ON public.trips;

-- Drop existing insecure policies for songs
DROP POLICY IF EXISTS "Users can view their own songs" ON public.songs;
DROP POLICY IF EXISTS "Users can create songs" ON public.songs;
DROP POLICY IF EXISTS "Users can update their own songs" ON public.songs;
DROP POLICY IF EXISTS "Users can delete their own songs" ON public.songs;

-- Create secure policies for trips (require authentication)
CREATE POLICY "Authenticated users can view their own trips" 
ON public.trips 
FOR SELECT 
USING (auth.role() = 'authenticated' AND user_id = auth.uid());

CREATE POLICY "Authenticated users can create trips" 
ON public.trips 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

CREATE POLICY "Authenticated users can update their own trips" 
ON public.trips 
FOR UPDATE 
USING (auth.role() = 'authenticated' AND user_id = auth.uid());

CREATE POLICY "Authenticated users can delete their own trips" 
ON public.trips 
FOR DELETE 
USING (auth.role() = 'authenticated' AND user_id = auth.uid());

-- Create secure policies for songs (require authentication)
CREATE POLICY "Authenticated users can view their own songs" 
ON public.songs 
FOR SELECT 
USING (auth.role() = 'authenticated' AND user_id = auth.uid());

CREATE POLICY "Authenticated users can create songs" 
ON public.songs 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

CREATE POLICY "Authenticated users can update their own songs" 
ON public.songs 
FOR UPDATE 
USING (auth.role() = 'authenticated' AND user_id = auth.uid());

CREATE POLICY "Authenticated users can delete their own songs" 
ON public.songs 
FOR DELETE 
USING (auth.role() = 'authenticated' AND user_id = auth.uid());

-- Also add foreign key constraints to ensure data integrity
ALTER TABLE public.trips 
  ALTER COLUMN user_id SET NOT NULL,
  ADD CONSTRAINT trips_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

ALTER TABLE public.songs 
  ALTER COLUMN user_id SET NOT NULL,
  ADD CONSTRAINT songs_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;