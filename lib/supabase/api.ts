import { createClient } from '@supabase/supabase-js'
import type { ReservationInsert } from './types'

export function getSupabaseApi() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en variables de entorno.'
    )
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

export type { ReservationInsert }
