-- Add type column to links table
alter table links 
add column type text default 'link' check (type in ('link', 'text'));

-- Update existing rows to have type 'link' (default handles this, but good to be explicit if needed)
-- update links set type = 'link' where type is null;
