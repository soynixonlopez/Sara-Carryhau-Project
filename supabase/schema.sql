-- ============================================
-- Sistema de reservas - Sara Carryhau Estética
-- Ejecuta este SQL en el SQL Editor de tu proyecto Supabase
-- ============================================

-- Tabla: quién atiende (Sara, asistente, etc.)
CREATE TABLE IF NOT EXISTS public.attendants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE
);

-- Insertar atendientes por defecto (ignorar si ya existen)
INSERT INTO public.attendants (nombre) VALUES
  ('Sara Carrillo'),
  ('Asistente')
ON CONFLICT (nombre) DO NOTHING;

-- Tabla: reservas
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  edad TEXT NOT NULL,
  servicio TEXT NOT NULL,
  comentario TEXT,
  fecha DATE NOT NULL,
  hora TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'atendido', 'cancelado')),
  attendant_id UUID REFERENCES public.attendants(id) ON DELETE SET NULL
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_reservations_fecha ON public.reservations(fecha);
CREATE INDEX IF NOT EXISTS idx_reservations_hora ON public.reservations(hora);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_fecha_hora ON public.reservations(fecha, hora);
CREATE INDEX IF NOT EXISTS idx_reservations_nombre ON public.reservations(nombre);
CREATE INDEX IF NOT EXISTS idx_reservations_apellido ON public.reservations(apellido);
CREATE INDEX IF NOT EXISTS idx_reservations_telefono ON public.reservations(telefono);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON public.reservations(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_reservation_slot_active
ON public.reservations(fecha, hora)
WHERE status IN ('pendiente', 'atendido');

-- Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reservations_updated_at ON public.reservations;
CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS (Row Level Security)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendants ENABLE ROW LEVEL SECURITY;

-- Cualquiera (rol anon desde la web/API) puede INSERTAR una reserva
DROP POLICY IF EXISTS "Permitir insertar reservas (público)" ON public.reservations;
CREATE POLICY "Permitir insertar reservas (público)"
  ON public.reservations FOR INSERT
  TO anon
  WITH CHECK (true);

-- Solo usuarios autenticados pueden leer/actualizar/eliminar reservas
CREATE POLICY "Admins pueden ver reservas"
  ON public.reservations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins pueden actualizar reservas"
  ON public.reservations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins pueden eliminar reservas"
  ON public.reservations FOR DELETE
  TO authenticated
  USING (true);

-- Attendants: solo lectura para autenticados
CREATE POLICY "Admins pueden ver attendants"
  ON public.attendants FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- IMPORTANTE: Crear usuarios administradores
-- ============================================
-- En Supabase Dashboard > Authentication > Users > Add user:
-- 1. Email y contraseña para Sara (ej: sarathc@gmail.com)
-- 2. Email y contraseña para el/la asistente
-- Esos usuarios (authenticated) podrán acceder al panel /admin

-- ============================================
-- Tiempo real (opcional)
-- ============================================
-- Para que el panel se actualice al instante al crear/editar reservas:
-- Dashboard > Database > Replication > activar para la tabla "reservations"
