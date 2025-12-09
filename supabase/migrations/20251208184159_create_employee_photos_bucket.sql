/*
  # Create Storage Bucket for Employee Photos

  1. New Storage Bucket
    - `employee-photos` - Public bucket for storing employee profile photos
  
  2. Storage Policies
    - Allow public read access to all photos
    - Allow public upload of photos
    - Allow public update of photos
    - Allow public delete of photos
*/

-- Create storage bucket for employee photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('employee-photos', 'employee-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow public read access to employee photos" ON storage.objects;
  DROP POLICY IF EXISTS "Allow public upload to employee photos" ON storage.objects;
  DROP POLICY IF EXISTS "Allow public update to employee photos" ON storage.objects;
  DROP POLICY IF EXISTS "Allow public delete from employee photos" ON storage.objects;
END $$;

-- Create policy for public read access
CREATE POLICY "Allow public read access to employee photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'employee-photos');

-- Create policy for public upload
CREATE POLICY "Allow public upload to employee photos"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'employee-photos');

-- Create policy for public update
CREATE POLICY "Allow public update to employee photos"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'employee-photos')
  WITH CHECK (bucket_id = 'employee-photos');

-- Create policy for public delete
CREATE POLICY "Allow public delete from employee photos"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'employee-photos');