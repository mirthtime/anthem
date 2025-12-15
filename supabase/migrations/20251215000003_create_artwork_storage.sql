-- Create storage bucket for artwork if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('artwork', 'artwork', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to artwork
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'artwork');

-- Allow authenticated users to upload artwork
CREATE POLICY "Authenticated users can upload artwork" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'artwork' 
  AND auth.role() = 'authenticated'
);

-- Allow service role to manage artwork
CREATE POLICY "Service role can manage artwork" ON storage.objects
FOR ALL USING (
  bucket_id = 'artwork' 
  AND auth.role() = 'service_role'
);