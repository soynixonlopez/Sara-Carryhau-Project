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

/** Horario de reservas: 9:00 a 20:00 con intervalos de 30 min */
export const RESERVATION_HORARIOS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00',
] as const

/** Formato esperado: yyyy-MM-dd */
export const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/

export type ReservationService = (typeof RESERVATION_SERVICES)[number]
export type ReservationHorario = (typeof RESERVATION_HORARIOS)[number]
