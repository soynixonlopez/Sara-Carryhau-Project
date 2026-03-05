-- Rol de cada asistente: colaborador (solo sus reservas) o administrador (ve todo, puede crear asistentes)
ALTER TABLE public.attendants
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'collaborator'
  CHECK (role IN ('collaborator', 'administrator'));

COMMENT ON COLUMN public.attendants.role IS 'collaborator: solo dashboard/reservar/día/perfil, reservas bajo su nombre. administrator: acceso completo como admin.';
