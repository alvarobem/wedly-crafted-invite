-- Create guests table
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  attending BOOLEAN DEFAULT NULL,
  group_name TEXT NOT NULL,
  bus_departure TEXT,
  bus_return TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Create policies - only authenticated users (novios) can access
CREATE POLICY "Only authenticated users can view guests" 
ON public.guests 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only authenticated users can insert guests" 
ON public.guests 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update guests" 
ON public.guests 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Only authenticated users can delete guests" 
ON public.guests 
FOR DELETE 
TO authenticated 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_guests_updated_at
BEFORE UPDATE ON public.guests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();