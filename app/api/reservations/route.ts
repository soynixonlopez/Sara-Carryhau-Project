import { NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { z } from 'zod'
import {
  RESERVATION_SERVICES,
  RESERVATION_HORARIOS,
  FECHA_REGEX,
} from '@/lib/constants'

// Forzar runtime Node.js en Vercel para evitar errores de módulos en serverless
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

/** No lanzar: devolver null si faltan env para evitar 405 en Vercel cuando falla la inicialización */
function getSupabaseAdmin(): SupabaseClient | null {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!serviceRoleKey || !supabaseUrl) {
    console.error('API reservations: faltan SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_URL')
    return null
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

const MSG_UNAVAILABLE = 'Servicio no disponible. Inténtalo más tarde o escríbenos por WhatsApp.'

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin')
  const allowOrigin = origin || process.env.NEXT_PUBLIC_SITE_URL || '*'
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

/** CORS preflight: evita 405 cuando el navegador envía OPTIONS antes del POST */
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: 'GET, POST, OPTIONS',
      ...corsHeaders(request),
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
        { status: 400, headers: corsHeaders(request) }
      )
    }
    if (!FECHA_REGEX.test(fecha)) {
      return NextResponse.json(
        { error: 'Formato de fecha inválido. Use yyyy-MM-dd.' },
        { status: 400, headers: corsHeaders(request) }
      )
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: MSG_UNAVAILABLE }, { status: 503, headers: corsHeaders(request) })
    }
    const { data, error } = await supabase
      .from('reservations')
      .select('hora, status')
      .eq('fecha', fecha)
      .in('status', ['pendiente', 'atendido'])

    if (error) {
      console.error('API reservations GET Supabase:', error.message)
      return NextResponse.json(
        { error: 'Error al consultar disponibilidad' },
        { status: 500, headers: corsHeaders(request) }
      )
    }

    const occupiedHours = (data || []).map((r) => r.hora).filter(Boolean)
    return NextResponse.json({ occupiedHours }, { headers: corsHeaders(request) })
  } catch (e) {
    console.error('API reservations GET:', e)
    return NextResponse.json(
      { error: 'Error al consultar disponibilidad' },
      { status: 500, headers: corsHeaders(request) }
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
        { status: 400, headers: corsHeaders(request) }
      )
    }

    const parseResult = reservationBodySchema.safeParse(body)
    if (!parseResult.success) {
      const first = parseResult.error.flatten().fieldErrors
      const msg =
        Object.values(first).flat().find(Boolean) || 'Datos de reserva inválidos.'
      return NextResponse.json({ error: String(msg) }, { status: 400, headers: corsHeaders(request) })
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
    if (!supabase) {
      return NextResponse.json({ error: MSG_UNAVAILABLE }, { status: 503, headers: corsHeaders(request) })
    }

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
        { status: 500, headers: corsHeaders(request) }
      )
    }

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'Esta hora ya está ocupada. Por favor elige otra.' },
        { status: 409, headers: corsHeaders(request) }
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
        { status: 500, headers: corsHeaders(request) }
      )
    }

    return NextResponse.json({ success: true, id: data?.id }, { headers: corsHeaders(request) })
  } catch (e) {
    console.error('API reservations POST:', e)
    return NextResponse.json(
      { error: 'Error al crear la reserva' },
      { status: 500, headers: corsHeaders(request) }
    )
  }
}
