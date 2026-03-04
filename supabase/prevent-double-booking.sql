-- Evita doble reserva para la misma fecha/hora mientras esté activa
-- (pendiente o atendido). Si ya hay duplicados activos, limpia esos casos
-- antes de ejecutar este índice único.

CREATE UNIQUE INDEX IF NOT EXISTS uq_reservation_slot_active
ON public.reservations(fecha, hora)
WHERE status IN ('pendiente', 'atendido');
