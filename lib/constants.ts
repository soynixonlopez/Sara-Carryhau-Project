/**
 * Constantes compartidas entre frontend y API para reservas.
 * Mantener sincronizado con la lista de servicios en BD si aplica.
 */
export const RESERVATION_SERVICES = [
  'Faciales',
  'Depilación con Cera',
  'Masajes',
  'Cauterizaciones',
  'Laminado y Lifting',
  'Micropigmentación',
  'Pestañas Pelo a Pelo',
  'Consulta Personalizada',
] as const

export const RESERVATION_HORARIOS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
] as const

/** Formato esperado: yyyy-MM-dd */
export const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/

export type ReservationService = (typeof RESERVATION_SERVICES)[number]
export type ReservationHorario = (typeof RESERVATION_HORARIOS)[number]
