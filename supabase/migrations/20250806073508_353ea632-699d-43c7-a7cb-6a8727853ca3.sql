-- Add columns for dietary restrictions and special notes to guests table
ALTER TABLE public.guests 
ADD COLUMN dietary_restrictions TEXT,
ADD COLUMN special_notes TEXT;