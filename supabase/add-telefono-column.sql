-- Ejecuta este SQL en Supabase SQL Editor para agregar celular
ALTER TABLE public.reservations
ADD COLUMN IF NOT EXISTS telefono TEXT;

CREATE INDEX IF NOT EXISTS idx_reservations_telefono
ON public.reservations(telefono);
