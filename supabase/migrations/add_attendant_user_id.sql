-- Añadir user_id y apellido a attendants para vincular cuentas de Auth y crear asistentes
ALTER TABLE public.attendants
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS apellido TEXT;

-- Quitar UNIQUE de nombre para permitir mismo nombre con distinto apellido (opcional)
-- Si prefieres mantener UNIQUE en (nombre, apellido), descomenta:
-- ALTER TABLE public.attendants DROP CONSTRAINT IF EXISTS attendants_nombre_key;
-- CREATE UNIQUE INDEX IF NOT EXISTS attendants_nombre_apellido_key ON public.attendants (nombre, COALESCE(apellido, ''));

-- Índice para buscar attendant por user_id
CREATE INDEX IF NOT EXISTS idx_attendants_user_id ON public.attendants(user_id);
