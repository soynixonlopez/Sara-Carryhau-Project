-- Correo del asistente (para mostrar en lista y editar)
ALTER TABLE public.attendants
  ADD COLUMN IF NOT EXISTS email TEXT;

-- Quitar UNIQUE de nombre para permitir mismo nombre con distinto apellido
ALTER TABLE public.attendants DROP CONSTRAINT IF EXISTS attendants_nombre_key;
