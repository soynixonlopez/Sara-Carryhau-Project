import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Devuelve si el usuario actual es admin (según ADMIN_EMAIL / NEXT_PUBLIC_ADMIN_EMAIL). La comprobación es en servidor para leer env en cada petición. */
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
      return NextResponse.json({ isAdmin: false, email: null })
    }
    const adminRaw = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
    const adminEmails = adminRaw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    const userEmail = user.email.trim().toLowerCase()
    const isAdmin = adminEmails.length > 0 && adminEmails.includes(userEmail)
    return NextResponse.json({ isAdmin, email: user.email })
  } catch (e) {
    console.error('GET /api/admin/me:', e)
    return NextResponse.json({ isAdmin: false, email: null }, { status: 500 })
  }
}
