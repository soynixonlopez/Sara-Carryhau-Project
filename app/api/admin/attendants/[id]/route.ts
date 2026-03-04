import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getAdminEmail(): string {
  const raw = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
  return raw.trim().toLowerCase()
}

/** Solo el admin (Sara Carrillo, sarythc@gmail.com) puede eliminar asistentes. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminEmail = getAdminEmail()
    if (!adminEmail) {
      return NextResponse.json({ error: 'Configuración incompleta' }, { status: 503 })
    }

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
    if (!user?.email || user.email.trim().toLowerCase() !== adminEmail) {
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
