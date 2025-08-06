
-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio-files',
  'audio-files',
  true,
  52428800, -- 50MB limit
  ARRAY['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg']
);

-- Create storage bucket for artwork/images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'artwork',
  'artwork', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- RLS policy for audio files - users can upload their own files
CREATE POLICY "Users can upload their own audio files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'audio-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policy for audio files - users can view all public audio files
CREATE POLICY "Anyone can view audio files"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio-files');

-- RLS policy for audio files - users can update their own files
CREATE POLICY "Users can update their own audio files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'audio-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policy for audio files - users can delete their own files
CREATE POLICY "Users can delete their own audio files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'audio-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policy for artwork - users can upload their own artwork
CREATE POLICY "Users can upload their own artwork"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'artwork' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policy for artwork - anyone can view artwork
CREATE POLICY "Anyone can view artwork"
ON storage.objects FOR SELECT
USING (bucket_id = 'artwork');

-- RLS policy for artwork - users can update their own artwork
CREATE POLICY "Users can update their own artwork"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'artwork' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policy for artwork - users can delete their own artwork
CREATE POLICY "Users can delete their own artwork"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'artwork' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
