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
  attendants?: { id: string; nombre: string; apellido?: string | null } | null
}

export type AttendantRole = 'collaborator' | 'administrator'

export interface Attendant {
  id: string
  nombre: string
  apellido?: string | null
  email?: string | null
  user_id?: string | null
  role?: AttendantRole | null
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
