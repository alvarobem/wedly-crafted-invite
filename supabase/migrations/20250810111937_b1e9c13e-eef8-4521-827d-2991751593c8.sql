-- Permitir que la columna group_name sea nullable
ALTER TABLE public.guests 
ALTER COLUMN group_name DROP NOT NULL;