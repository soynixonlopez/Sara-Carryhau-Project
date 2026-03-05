import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const bodySchema = z.object({
  nombre: z.string().trim().min(1, 'Nombre requerido').max(120),
  apellido: z.string().trim().min(1, 'Apellido requerido').max(120),
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  role: z.enum(['collaborator', 'administrator']).default('collaborator'),
})

/** Solo super admin (ADMIN_EMAIL) o administradores (attendant.role === 'administrator') pueden crear asistentes. */
export async function POST(request: Request) {
  try {
    const adminEmailsRaw = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
    const adminEmails = adminEmailsRaw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)

    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const serverClient = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    })
    const { data: { user } } = await serverClient.auth.getUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
    const userEmail = user.email.trim().toLowerCase()
    const isSuperAdmin = adminEmails.length > 0 && adminEmails.includes(userEmail)
    if (!isSuperAdmin) {
      const { data: attendant } = await serverClient
        .from('attendants')
        .select('id, role')
        .eq('user_id', user.id)
        .maybeSingle()
      if (!attendant || attendant.role !== 'administrator') {
        return NextResponse.json({ error: 'No autorizado. Solo administradores pueden crear asistentes.' }, { status: 403 })
      }
    }

    const body = await request.json()
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) {
      const msg = parsed.error.issues.map((e) => e.message).join('. ')
      return NextResponse.json({ error: msg || 'Datos inválidos' }, { status: 400 })
    }

    const { nombre, apellido, email, password, role } = parsed.data
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
      return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 })
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nombre, apellido },
    })

    if (createError) {
      if (createError.message.includes('already registered')) {
        return NextResponse.json({ error: 'Ese correo ya tiene una cuenta.' }, { status: 400 })
      }
      console.error('create-attendant createUser:', createError.message)
      return NextResponse.json({ error: 'No se pudo crear la cuenta. Inténtalo de nuevo.' }, { status: 500 })
    }

    const { error: insertError } = await admin
      .from('attendants')
      .insert({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        user_id: newUser.user.id,
        role: role || 'collaborator',
      })

    if (insertError) {
      console.error('create-attendant insert attendant:', insertError)
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'Ya existe un asistente con ese nombre. Edita el nombre en la lista o usa otro.' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Cuenta creada pero no se pudo vincular al equipo. Contacta soporte.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, userId: newUser.user.id })
  } catch (e) {
    console.error('create-attendant:', e)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}
