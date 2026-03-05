import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Devuelve si el usuario es admin (super admin por email o rol administrador), su rol y attendantId si es asistente. */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      return NextResponse.json({ isAdmin: false, email: null, role: null, attendantId: null })
    }
    const adminRaw = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
    const adminEmails = adminRaw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    const userEmail = user.email.trim().toLowerCase()
    const isSuperAdmin = adminEmails.length > 0 && adminEmails.includes(userEmail)
    if (isSuperAdmin) {
      return NextResponse.json({
        isAdmin: true,
        email: user.email,
        role: 'admin' as const,
        attendantId: null,
      })
    }
    const { data: attendant } = await supabase
      .from('attendants')
      .select('id, role')
      .eq('user_id', user.id)
      .maybeSingle()
    if (!attendant) {
      return NextResponse.json({
        isAdmin: false,
        email: user.email,
        role: null,
        attendantId: null,
      })
    }
    const isAdmin = attendant.role === 'administrator'
    return NextResponse.json({
      isAdmin,
      email: user.email,
      role: attendant.role as 'collaborator' | 'administrator',
      attendantId: attendant.id,
    })
  } catch (e) {
    console.error('GET /api/admin/me:', e)
    return NextResponse.json({ isAdmin: false, email: null, role: null, attendantId: null }, { status: 500 })
  }
}
