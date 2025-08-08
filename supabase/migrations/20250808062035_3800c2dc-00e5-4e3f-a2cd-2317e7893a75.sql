-- Allow anonymous users to search for guests in the RSVP form
-- This enables the public RSVP functionality without requiring authentication

-- Drop the existing SELECT policy that only allows authenticated users
DROP POLICY IF EXISTS "Only authenticated users can view guests" ON public.guests;

-- Create a new policy that allows anonymous users to read guests
-- This is needed for the RSVP search functionality
CREATE POLICY "Allow public access to view guests for RSVP" 
ON public.guests 
FOR SELECT 
USING (true);

-- Keep the existing policies for INSERT, UPDATE, DELETE that require authentication
-- These remain unchanged to protect against unauthorized modifications