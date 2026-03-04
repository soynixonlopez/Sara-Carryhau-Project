import 'server-only'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import {
  RESERVATION_SERVICES,
  RESERVATION_HORARIOS,
  FECHA_REGEX,
} from '@/lib/constants'

const reservationBodySchema = z.object({
  nombre: z.string().trim().min(1, 'Nombre requerido').max(120),
  apellido: z.string().trim().min(1, 'Apellido requerido').max(120),
  telefono: z.string().trim().min(1, 'Teléfono requerido').max(30),
  email: z
    .string()
    .max(320)
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() ? v.trim() : null))
    .refine((v) => v === null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Email inválido'),
  edad: z.string().trim().min(1, 'Edad requerida').max(20),
  servicio: z
    .string()
    .trim()
    .refine((s) => (RESERVATION_SERVICES as readonly string[]).includes(s), 'Servicio no válido'),
  comentario: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() ? v.trim() : null)),
  fecha: z.string().regex(FECHA_REGEX, 'Formato de fecha inválido (yyyy-MM-dd)'),
  hora: z
    .string()
    .refine((h) => (RESERVATION_HORARIOS as readonly string[]).includes(h), 'Hora no válida'),
})

function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!serviceRoleKey || !supabaseUrl) {
    throw new Error(
      'Faltan SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_URL en variables de entorno.'
    )
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get('fecha')
    if (!fecha) {
      return NextResponse.json(
        { error: 'Falta parámetro fecha (yyyy-MM-dd).' },
        { status: 400 }
      )
    }
    if (!FECHA_REGEX.test(fecha)) {
      return NextResponse.json(
        { error: 'Formato de fecha inválido. Use yyyy-MM-dd.' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('reservations')
      .select('hora, status')
      .eq('fecha', fecha)
      .in('status', ['pendiente', 'atendido'])

    if (error) {
      console.error('API reservations GET Supabase:', error.message)
      return NextResponse.json(
        { error: 'Error al consultar disponibilidad' },
        { status: 500 }
      )
    }

    const occupiedHours = (data || []).map((r) => r.hora).filter(Boolean)
    return NextResponse.json({ occupiedHours })
  } catch (e) {
    console.error('API reservations GET:', e)
    return NextResponse.json(
      { error: 'Error al consultar disponibilidad' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Body JSON inválido o vacío.' },
        { status: 400 }
      )
    }

    const parseResult = reservationBodySchema.safeParse(body)
    if (!parseResult.success) {
      const first = parseResult.error.flatten().fieldErrors
      const msg =
        Object.values(first).flat().find(Boolean) || 'Datos de reserva inválidos.'
      return NextResponse.json({ error: String(msg) }, { status: 400 })
    }

    const {
      nombre,
      apellido,
      telefono,
      email,
      edad,
      servicio,
      comentario,
      fecha,
      hora,
    } = parseResult.data

    const supabase = getSupabaseAdmin()

    const { data: existing, error: existingError } = await supabase
      .from('reservations')
      .select('id')
      .eq('fecha', fecha)
      .eq('hora', hora)
      .in('status', ['pendiente', 'atendido'])
      .limit(1)

    if (existingError) {
      console.error('API reservations POST check existing:', existingError.message)
      return NextResponse.json(
        { error: 'Error al verificar disponibilidad. Inténtalo de nuevo.' },
        { status: 500 }
      )
    }

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'Esta hora ya está ocupada. Por favor elige otra.' },
        { status: 409 }
      )
    }

    const { data, error } = await supabase
      .from('reservations')
      .insert({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim(),
        email: email && String(email).trim() ? String(email).trim() : null,
        edad: String(edad).trim(),
        servicio: servicio.trim(),
        comentario:
          comentario && String(comentario).trim() ? String(comentario).trim() : null,
        fecha,
        hora,
        status: 'pendiente',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Error al crear la reserva. Inténtalo de nuevo.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (e) {
    console.error('API reservations POST:', e)
    return NextResponse.json(
      { error: 'Error al crear la reserva' },
      { status: 500 }
    )
  }
}
