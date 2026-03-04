-- Ejecuta este SQL en Supabase (SQL Editor) para corregir el error
-- "new row violates row-level security policy for table reservations"

-- Eliminar la política anterior
DROP POLICY IF EXISTS "Permitir insertar reservas (público)" ON public.reservations;

-- Crear la política permitiendo al rol anon (formulario público / API)
CREATE POLICY "Permitir insertar reservas (público)"
  ON public.reservations FOR INSERT
  TO anon
  WITH CHECK (true);
