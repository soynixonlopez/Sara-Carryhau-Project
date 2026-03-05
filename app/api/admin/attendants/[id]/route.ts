import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const patchBodySchema = z.object({
  nombre: z.string().trim().min(1).max(120).optional(),
  apellido: z.string().trim().max(120).optional(),
  email: z.string().email('Correo inválido').optional().nullable(),
})

async function canManageAttendants(
  serverClient: ReturnType<typeof createServerClient>,
  user: { email: string; id: string }
): Promise<boolean> {
  const adminEmailsRaw = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
  const adminEmails = adminEmailsRaw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
  if (adminEmails.length > 0 && adminEmails.includes(user.email.trim().toLowerCase())) return true
  const { data: att } = await serverClient
    .from('attendants')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  return att?.role === 'administrator'
}

/** Solo super admin o administradores pueden editar asistentes. */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: attendantId } = await params
    if (!attendantId) {
      return NextResponse.json({ error: 'Falta id del asistente' }, { status: 400 })
    }

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
    const email = user?.email
    if (!user || !email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
    if (!(await canManageAttendants(serverClient, { email, id: user.id }))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
    }
    const parsed = patchBodySchema.safeParse(body)
    if (!parsed.success) {
      const msg = parsed.error.issues.map((e) => e.message).join('. ')
      return NextResponse.json({ error: msg || 'Datos inválidos' }, { status: 400 })
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
      return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 })
    }
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: attendant, error: fetchErr } = await admin
      .from('attendants')
      .select('id, user_id, email')
      .eq('id', attendantId)
      .single()

    if (fetchErr || !attendant) {
      return NextResponse.json({ error: 'Asistente no encontrado' }, { status: 404 })
    }

    const updates: { nombre?: string; apellido?: string; email?: string | null } = {}
    if (parsed.data.nombre !== undefined) updates.nombre = parsed.data.nombre
    if (parsed.data.apellido !== undefined) updates.apellido = parsed.data.apellido
    if (parsed.data.email !== undefined) updates.email = parsed.data.email ?? null

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: true })
    }

    const { error: updateErr } = await admin
      .from('attendants')
      .update(updates)
      .eq('id', attendantId)

    if (updateErr) {
      console.error('PATCH attendants:', updateErr)
      return NextResponse.json({ error: 'No se pudo actualizar' }, { status: 500 })
    }

    if (updates.email != null && attendant.user_id) {
      const { error: authErr } = await admin.auth.admin.updateUserById(attendant.user_id, {
        email: updates.email,
      })
      if (authErr) {
        console.error('PATCH attendants updateUser email:', authErr.message)
      }
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('PATCH /api/admin/attendants/[id]:', e)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}

/** Solo super admin (ADMIN_EMAIL) o administradores (attendant.role === 'administrator') pueden eliminar asistentes. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: attendantId } = await params
    if (!attendantId) {
      return NextResponse.json({ error: 'Falta id del asistente' }, { status: 400 })
    }

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
    const email = user?.email
    if (!user || !email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
    if (!(await canManageAttendants(serverClient, { email, id: user.id }))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
      return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 })
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: attendant, error: fetchErr } = await admin
      .from('attendants')
      .select('id, user_id, nombre')
      .eq('id', attendantId)
      .single()

    if (fetchErr || !attendant) {
      return NextResponse.json({ error: 'Asistente no encontrado' }, { status: 404 })
    }

    if (attendant.user_id) {
      const { error: deleteUserErr } = await admin.auth.admin.deleteUser(attendant.user_id)
      if (deleteUserErr) {
        console.error('delete-attendant auth:', deleteUserErr.message)
      }
    }

    const { error: deleteErr } = await admin.from('attendants').delete().eq('id', attendantId)

    if (deleteErr) {
      console.error('delete-attendant:', deleteErr)
      return NextResponse.json({ error: 'No se pudo eliminar el asistente' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('DELETE /api/admin/attendants/[id]:', e)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}
