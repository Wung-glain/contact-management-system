
-- Add is_favorite column to contacts table
ALTER TABLE public.contacts ADD COLUMN is_favorite BOOLEAN DEFAULT false;
