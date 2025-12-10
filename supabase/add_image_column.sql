-- Add image_url column to links table
ALTER TABLE links ADD COLUMN IF NOT EXISTS image_url TEXT;

-- (Optional) If you want to backfill or default, you can do it here, but usually null is fine.
