export type ReservationStatus = 'pendiente' | 'atendido' | 'cancelado'

export interface Reservation {
  id: string
  created_at: string
  updated_at: string
  nombre: string
  apellido: string
  telefono: string | null
  email: string | null
  edad: string
  servicio: string
  comentario: string | null
  fecha: string
  hora: string
  status: ReservationStatus
  attendant_id: string | null
  attendants?: { id: string; nombre: string } | null
}

export interface Attendant {
  id: string
  nombre: string
  apellido?: string | null
  user_id?: string | null
}

export interface ReservationInsert {
  nombre: string
  apellido: string
  telefono?: string | null
  email?: string | null
  edad: string
  servicio: string
  comentario?: string | null
  fecha: string
  hora: string
  status?: ReservationStatus
  attendant_id?: string | null
}
