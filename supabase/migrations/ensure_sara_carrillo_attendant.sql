-- Asegurar que Sara Carrillo exista como asistente para poder asignarla en "Quién atiende"
-- Actualizar fila antigua que tenga nombre completo en un solo campo
UPDATE public.attendants
SET nombre = 'Sara', apellido = 'Carrillo', role = 'administrator'
WHERE nombre = 'Sara Carrillo';

-- Si no existe ninguna Sara, insertar
INSERT INTO public.attendants (nombre, apellido, role)
SELECT 'Sara', 'Carrillo', 'administrator'
WHERE NOT EXISTS (
  SELECT 1 FROM public.attendants
  WHERE nombre = 'Sara' AND (apellido = 'Carrillo' OR apellido IS NULL)
);
