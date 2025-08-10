-- Crear tabla para playlist colaborativa
CREATE TABLE public.playlist_songs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  song_name TEXT NOT NULL,
  artist TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;

-- Política para permitir que cualquiera pueda ver las canciones
CREATE POLICY "Anyone can view playlist songs" 
ON public.playlist_songs 
FOR SELECT 
USING (true);

-- Política para permitir que cualquiera pueda añadir canciones
CREATE POLICY "Anyone can add playlist songs" 
ON public.playlist_songs 
FOR INSERT 
WITH CHECK (true);