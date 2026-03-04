import 'server-only'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('Falta SUPABASE_SERVICE_ROLE_KEY en variables de entorno.')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get('fecha')
    if (!fecha) {
      return NextResponse.json({ error: 'Falta parámetro fecha (yyyy-MM-dd).' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('reservations')
      .select('hora, status')
      .eq('fecha', fecha)
      .in('status', ['pendiente', 'atendido'])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const occupiedHours = (data || []).map((r) => r.hora).filter(Boolean)
    return NextResponse.json({ occupiedHours })
  } catch (e) {
    console.error('API reservations GET:', e)
    return NextResponse.json({ error: 'Error al consultar disponibilidad' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
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
    } = body as {
      nombre: string
      apellido: string
      telefono: string
      email?: string | null
      edad: string
      servicio: string
      comentario?: string | null
      fecha: string
      hora: string
    }

    if (!nombre?.trim() || !apellido?.trim() || !telefono?.trim() || !edad || !servicio?.trim() || !fecha || !hora) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: nombre, apellido, telefono, edad, servicio, fecha, hora' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    // Evita doble reserva del mismo horario si ya está ocupado
    const { data: existing, error: existingError } = await supabase
      .from('reservations')
      .select('id')
      .eq('fecha', fecha)
      .eq('hora', hora)
      .in('status', ['pendiente', 'atendido'])
      .limit(1)

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 })
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
        email: email?.trim() || null,
        edad: String(edad).trim(),
        servicio: servicio.trim(),
        comentario: comentario?.trim() || null,
        fecha,
        hora,
        status: 'pendiente',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (e) {
    console.error('API reservations POST:', e)
    return NextResponse.json({ error: 'Error al crear la reserva' }, { status: 500 })
  }
}
