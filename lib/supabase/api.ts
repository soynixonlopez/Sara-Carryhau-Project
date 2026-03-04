import { createClient } from '@supabase/supabase-js'
import type { ReservationInsert } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function getSupabaseApi() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

export type { ReservationInsert }
