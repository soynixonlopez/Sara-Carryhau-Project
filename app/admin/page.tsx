'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  format,
  startOfDay,
  parseISO,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'
import {
  LogOut,
  Calendar,
  List,
  Search,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  CalendarPlus,
  Pencil,
  User,
  Phone,
  Clock,
  Mail,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Trash2,
  Info,
  LayoutDashboard,
  Menu,
  Users,
  UserCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Reservation, Attendant, ReservationStatus } from '@/lib/supabase/types'
import * as XLSX from 'xlsx'
import AdminBookingForm from '@/components/AdminBookingForm'
import { RESERVATION_HORARIOS } from '@/lib/constants'
import { siteConfig } from '@/lib/config'
import type { User as AuthUser } from '@supabase/supabase-js'

const HORARIOS = [...RESERVATION_HORARIOS]

export type AdminSection = 'dashboard' | 'reservar' | 'day' | 'profile' | 'attendants'

function AttendantsSection({ attendants, onAttendantCreated }: { attendants: Attendant[]; onAttendantCreated: () => void }) {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'collaborator' | 'administrator'>('collaborator')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingAttendant, setEditingAttendant] = useState<Attendant | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [editApellido, setEditApellido] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/create-attendant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), apellido: apellido.trim(), email: email.trim(), password, role }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data?.error as string) || 'Error al crear la cuenta')
        setLoading(false)
        return
      }
      onAttendantCreated()
      setNombre('')
      setApellido('')
      setEmail('')
      setPassword('')
    } catch {
      setError('Error de conexión')
    }
    setLoading(false)
  }

  const handleDelete = async (a: Attendant) => {
    const fullName = `${a.nombre}${a.apellido ? ` ${a.apellido}` : ''}`.trim()
    if (!window.confirm(`¿Eliminar a ${fullName}? Se quitará del listado y, si tenía cuenta, ya no podrá entrar al panel. Esta acción no se puede deshacer.`)) return
    setError(null)
    setDeletingId(a.id)
    try {
      const res = await fetch(`/api/admin/attendants/${a.id}`, { method: 'DELETE', credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data?.error as string) || 'No se pudo eliminar')
        return
      }
      onAttendantCreated()
      setEditingAttendant(null)
    } catch {
      setError('Error de conexión')
    } finally {
      setDeletingId(null)
    }
  }

  const getDisplayNombre = (a: Attendant) => a.nombre.trim().split(/\s+/)[0] || a.nombre
  const getDisplayApellido = (a: Attendant) => {
    if (a.apellido && a.apellido.trim()) return a.apellido.trim()
    const parts = a.nombre.trim().split(/\s+/).slice(1)
    return parts.length ? parts.join(' ') : '—'
  }

  const openEdit = (a: Attendant) => {
    setEditingAttendant(a)
    setEditNombre(getDisplayNombre(a))
    setEditApellido(getDisplayApellido(a) === '—' ? '' : getDisplayApellido(a))
    setEditEmail(a.email ?? '')
    setEditError(null)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAttendant) return
    setEditError(null)
    setEditSaving(true)
    try {
      const res = await fetch(`/api/admin/attendants/${editingAttendant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: editNombre.trim(),
          apellido: editApellido.trim() || null,
          email: editEmail.trim() || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setEditError((data?.error as string) || 'No se pudo guardar')
        setEditSaving(false)
        return
      }
      onAttendantCreated()
      setEditingAttendant(null)
    } catch {
      setEditError('Error de conexión')
    } finally {
      setEditSaving(false)
    }
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden mb-8">
      <div className="p-5 sm:p-6 lg:p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Asistentes de la estética</h3>
        <p className="text-sm text-gray-500 mb-6">Sara Carrillo (admin) puede crear cuentas para asistentes, ver el listado y eliminarlos si lo desea.</p>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
          <h4 className="text-sm font-medium text-gray-800">Crear cuenta nueva</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm" placeholder="Ej. Marieth" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Apellido</label>
              <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm" placeholder="Ej. Vega" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Correo</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm" placeholder="correo@ejemplo.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm" placeholder="Mínimo 6 caracteres" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Rol</label>
            <select value={role} onChange={(e) => setRole(e.target.value as 'collaborator' | 'administrator')} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm">
              <option value="collaborator">Colaborador (solo dashboard, reservar, por día, perfil; reservas bajo su nombre)</option>
              <option value="administrator">Administrador (acceso completo: ver todo, crear asistentes, etc.)</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary text-sm py-2.5 px-5 disabled:opacity-50">
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>

        <h4 className="text-sm font-medium text-gray-700 mb-3">Lista de asistentes</h4>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Apellido</th>
                <th className="py-3 px-4">Correo</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4 w-24 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {attendants.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">No hay asistentes registrados.</td>
                </tr>
              )}
              {attendants.map((a) => (
                <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-medium text-gray-900">{getDisplayNombre(a)}</td>
                  <td className="py-3 px-4 text-gray-700">{getDisplayApellido(a)}</td>
                  <td className="py-3 px-4 text-gray-700">{a.email ?? '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block text-xs font-medium px-1.5 py-0.5 rounded ${a.role === 'administrator' ? 'bg-primary-100 text-primary-800' : 'bg-gray-200 text-gray-700'}`}>
                      {a.role === 'administrator' ? 'Administrador' : 'Colaborador'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(a)}
                        className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        title="Editar nombre y correo"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(a)}
                        disabled={deletingId === a.id}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Eliminar asistente"
                      >
                        {deletingId === a.id ? (
                          <span className="w-4 h-4 block border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal editar asistente */}
        {editingAttendant && (
          <div
            className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/50"
            onClick={() => !editSaving && setEditingAttendant(null)}
            aria-modal
            role="dialog"
            aria-label="Editar asistente"
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Editar asistente</h3>
                <button
                  type="button"
                  onClick={() => !editSaving && setEditingAttendant(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm"
                    placeholder="Ej. Marieth"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Apellido</label>
                  <input
                    type="text"
                    value={editApellido}
                    onChange={(e) => setEditApellido(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm"
                    placeholder="Ej. Vega"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Correo</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                {editError && <p className="text-sm text-red-600">{editError}</p>}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => !editSaving && setEditingAttendant(null)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={editSaving}
                    className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                  >
                    {editSaving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [attendants, setAttendants] = useState<Attendant[]>([])
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'))
  const [section, setSection] = useState<AdminSection>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentAttendantId, setCurrentAttendantId] = useState<string | null>(null)
  const [roleLoaded, setRoleLoaded] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'todos'>('todos')
  const [monthFilter, setMonthFilter] = useState(() => format(new Date(), 'yyyy-MM'))
  const [detailReservation, setDetailReservation] = useState<Reservation | null>(null)
  const [editFecha, setEditFecha] = useState('')
  const [editHora, setEditHora] = useState('')
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showDayCalendar, setShowDayCalendar] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(() => new Date())
  const todayDate = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (detailReservation) {
      setEditFecha(detailReservation.fecha)
      setEditHora(detailReservation.hora)
    }
  }, [detailReservation])

  const fetchAttendantsList = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.from('attendants').select('id, nombre, apellido, email, user_id, role').order('nombre')
    if (data) setAttendants(data as Attendant[])
  }, [])

  useEffect(() => {
    fetchAttendantsList()
  }, [fetchAttendantsList])

  useEffect(() => {
    const supabase = createClient()
    const loadUserAndRole = async () => {
      const { data: { user: u } } = await supabase.auth.getUser()
      setUser(u ?? null)
      if (!u) {
        setRoleLoaded(true)
        return
      }
      try {
        const res = await fetch('/api/admin/me', { credentials: 'include' })
        const data = res.ok ? await res.json() : { isAdmin: false, attendantId: null }
        setIsAdmin(!!data.isAdmin)
        setCurrentAttendantId(data.attendantId ?? null)
      } catch {
        setIsAdmin(false)
        setCurrentAttendantId(null)
      }
      setRoleLoaded(true)
    }
    loadUserAndRole()
  }, [])

  const fetchReservations = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('reservations')
      .select('*, attendants(id, nombre, apellido)')
      .order('fecha', { ascending: false })
      .order('hora', { ascending: true })
    if (!error && data) setReservations(data as Reservation[])
  }, [])

  useEffect(() => {
    fetchReservations()
    const supabase = createClient()
    const channel = supabase
      .channel('reservations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        fetchReservations()
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchReservations])

  const reservationsForRole = useMemo(() => {
    if (isAdmin || !currentAttendantId) return reservations
    return reservations.filter((r) => r.attendant_id === currentAttendantId)
  }, [reservations, isAdmin, currentAttendantId])

  const reservationsForSelectedDay = useMemo(() => {
    return reservationsForRole.filter(
      (r) => r.fecha === selectedDate && r.status !== 'cancelado'
    )
  }, [reservationsForRole, selectedDate])

  const slotsWithReservations = useMemo(() => {
    const map: Record<string, Reservation> = {}
    reservationsForSelectedDay.forEach((r) => {
      map[r.hora] = r
    })
    return map
  }, [reservationsForSelectedDay])

  const daySummary = useMemo(() => {
    const pendientes = reservationsForSelectedDay.filter((r) => r.status === 'pendiente').length
    const atendidos = reservationsForSelectedDay.filter((r) => r.status === 'atendido').length
    const ocupados = reservationsForSelectedDay.length
    const disponibles = Math.max(HORARIOS.length - ocupados, 0)
    return { pendientes, atendidos, ocupados, disponibles }
  }, [reservationsForSelectedDay])

  const filteredList = useMemo(() => {
    let list = reservationsForRole
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(
        (r) =>
          r.nombre.toLowerCase().includes(q) ||
          r.apellido.toLowerCase().includes(q) ||
          (r.telefono && r.telefono.toLowerCase().includes(q)) ||
          (r.email && r.email.toLowerCase().includes(q)) ||
          r.servicio.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'todos') list = list.filter((r) => r.status === statusFilter)
    if (monthFilter) {
      const [y, m] = monthFilter.split('-').map(Number)
      const start = startOfMonth(new Date(y, m - 1))
      const end = endOfMonth(new Date(y, m - 1))
      list = list.filter((r) => {
        const d = parseISO(r.fecha)
        return isWithinInterval(d, { start, end })
      })
    }
    return list.sort((a, b) => {
      const da = parseISO(a.fecha)
      const db = parseISO(b.fecha)
      if (da.getTime() !== db.getTime()) return db.getTime() - da.getTime()
      return (b.hora || '').localeCompare(a.hora || '')
    })
  }, [reservationsForRole, search, statusFilter, monthFilter])

  const dashboardSummary = useMemo(() => {
    const total = reservationsForRole.length
    const pendientes = reservationsForRole.filter((r) => r.status === 'pendiente').length
    const atendidos = reservationsForRole.filter((r) => r.status === 'atendido').length
    const hoy = reservationsForRole.filter((r) => r.fecha === todayDate && r.status !== 'cancelado').length
    return { total, pendientes, atendidos, hoy }
  }, [reservationsForRole, todayDate])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const updateReservation = async (
    id: string,
    updates: { status?: ReservationStatus; attendant_id?: string | null; fecha?: string; hora?: string }
  ) => {
    setUpdateError(null)
    setUpdating(true)
    const supabase = createClient()
    const { error } = await supabase.from('reservations').update(updates).eq('id', id)
    setUpdating(false)
    if (error) {
      setUpdateError(error.message || 'No se pudo actualizar la reserva. Inténtalo de nuevo.')
      return
    }
    const newAttendants =
      updates.attendant_id != null
        ? attendants.find((a) => a.id === updates.attendant_id)
        : null
    const attendantsForReservation =
      newAttendants != null
        ? { id: newAttendants.id, nombre: newAttendants.nombre, apellido: newAttendants.apellido ?? null }
        : null

    setReservations((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r
        const next = { ...r, ...updates }
        if (updates.attendant_id !== undefined) next.attendants = attendantsForReservation
        return next
      })
    )
    if (detailReservation?.id === id) {
      setDetailReservation((prev) =>
        prev
          ? {
              ...prev,
              ...updates,
              attendants: updates.attendant_id !== undefined ? attendantsForReservation : prev.attendants,
            }
          : null
      )
    }
  }

  const goPrevDay = () => {
    const d = startOfDay(parseISO(selectedDate))
    d.setDate(d.getDate() - 1)
    setSelectedDate(format(d, 'yyyy-MM-dd'))
  }

  const goNextDay = () => {
    const d = startOfDay(parseISO(selectedDate))
    d.setDate(d.getDate() + 1)
    setSelectedDate(format(d, 'yyyy-MM-dd'))
  }

  const getAttendantName = (r: Reservation) => {
    const att = r.attendants
    if (att && typeof att === 'object' && 'nombre' in att) {
      const a = att as { nombre: string; apellido?: string | null }
      const first = a.nombre.trim().split(/\s+/)[0] || a.nombre
      const last = (a.apellido && a.apellido.trim())
        ? a.apellido.trim()
        : a.nombre.trim().split(/\s+/).slice(1).join(' ')
      return last ? `${first} ${last}` : first
    }
    return null
  }

  const handleCancelarReserva = async (r: Reservation, e?: React.MouseEvent, skipConfirm?: boolean) => {
    e?.stopPropagation()
    if (!skipConfirm && !window.confirm(`¿Cancelar la reserva de ${r.nombre} ${r.apellido}? El horario quedará libre. Podrás verla en "Canceladas" y reactivarla después.`)) return
    setUpdateError(null)
    setUpdating(true)
    const supabase = createClient()
    const { error } = await supabase.from('reservations').update({ status: 'cancelado' }).eq('id', r.id)
    setUpdating(false)
    if (error) {
      setUpdateError(error.message)
      return
    }
    setReservations((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: 'cancelado' as const } : x)))
    if (detailReservation?.id === r.id) setDetailReservation((prev) => (prev ? { ...prev, status: 'cancelado' } : null))
  }

  const handleReactivarReserva = async (r: Reservation, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setUpdateError(null)
    setUpdating(true)
    const supabase = createClient()
    const { error } = await supabase.from('reservations').update({ status: 'pendiente' }).eq('id', r.id)
    setUpdating(false)
    if (error) {
      setUpdateError(error.message)
      return
    }
    setReservations((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: 'pendiente' as const } : x)))
    if (detailReservation?.id === r.id) setDetailReservation((prev) => (prev ? { ...prev, status: 'pendiente' } : null))
  }

  const handleEliminarReserva = async (r: Reservation, e?: React.MouseEvent, skipConfirm?: boolean) => {
    e?.stopPropagation()
    if (!skipConfirm && !window.confirm(`¿Eliminar del sistema la reserva de ${r.nombre} ${r.apellido}? Se borrará para siempre y no podrás recuperarla. Esta acción no se puede deshacer.`)) return
    setUpdateError(null)
    setUpdating(true)
    const supabase = createClient()
    const { error } = await supabase.from('reservations').delete().eq('id', r.id)
    setUpdating(false)
    if (error) {
      setUpdateError(error.message)
      return
    }
    setReservations((prev) => prev.filter((x) => x.id !== r.id))
    setDetailReservation(null)
  }

  const escapeCsvCell = (value: string | null | undefined): string => {
    if (value == null) return ''
    const s = String(value).replace(/"/g, '""')
    if (/[",\n\r]/.test(s)) return `"${s}"`
    return s
  }

  const exportCsv = () => {
    const headers = [
      'Fecha',
      'Hora',
      'Nombre',
      'Apellido',
      'Teléfono',
      'Email',
      'Edad',
      'Servicio',
      'Estado',
      'Quién atiende',
      'Comentario',
      'Creado',
    ]
    const rows = filteredList.map((r) => [
      r.fecha,
      r.hora,
      r.nombre,
      r.apellido,
      r.telefono ?? '',
      r.email ?? '',
      r.edad,
      r.servicio,
      r.status,
      getAttendantName(r) ?? '',
      r.comentario ?? '',
      format(parseISO(r.created_at), "d/M/yyyy HH:mm", { locale: es }),
    ])
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map(escapeCsvCell).join(',')),
    ].join('\r\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reservas_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportExcel = () => {
    const headers = [
      'Fecha',
      'Hora',
      'Nombre',
      'Apellido',
      'Teléfono',
      'Email',
      'Edad',
      'Servicio',
      'Estado',
      'Quién atiende',
      'Comentario',
      'Creado',
    ]
    const rows = filteredList.map((r) => [
      r.fecha,
      r.hora,
      r.nombre,
      r.apellido,
      r.telefono ?? '',
      r.email ?? '',
      r.edad,
      r.servicio,
      r.status,
      getAttendantName(r) ?? '',
      r.comentario ?? '',
      format(parseISO(r.created_at), "d/M/yyyy HH:mm", { locale: es }),
    ])
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
    const colWidths = [{ wch: 12 }, { wch: 6 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 8 }, { wch: 22 }, { wch: 10 }, { wch: 14 }, { wch: 30 }, { wch: 16 }]
    ws['!cols'] = colWidths
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Reservas')
    XLSX.writeFile(wb, `reservas_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`)
  }

  const navItemsAll: { id: AdminSection; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reservar', label: 'Reservar cita', icon: CalendarPlus },
    { id: 'day', label: 'Reservas por día', icon: Calendar },
    { id: 'profile', label: 'Perfil', icon: UserCircle },
    { id: 'attendants', label: 'Asistentes', icon: Users },
  ]
  const navItems = isAdmin ? navItemsAll : navItemsAll.filter((item) => item.id !== 'attendants')

  if (!roleLoaded) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-[100dvh] bg-gray-100 flex overflow-hidden">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar: 100% altura, fijo (sin scroll), colapsable */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-0 h-[100dvh] flex flex-col shrink-0
          bg-white border-r border-gray-200 shadow-lg lg:shadow-none overflow-hidden
          transform transition-[transform,width] duration-200 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'w-16 lg:w-16' : 'w-64 lg:w-56 xl:w-64'}
        `}
      >
        <div className={`border-b border-gray-100 shrink-0 ${sidebarCollapsed ? 'p-2' : 'p-4'}`}>
          <div className="flex items-center justify-between gap-1">
            {!sidebarCollapsed && (
              <>
                <h1 className="text-lg font-serif font-bold text-gray-900 truncate min-w-0">Sara Carryhau</h1>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 shrink-0"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            )}
            {sidebarCollapsed && (
              <span className="text-sm font-bold text-gray-900 truncate w-full text-center">SC</span>
            )}
          </div>
          {!sidebarCollapsed && <p className="text-xs text-gray-500 mt-0.5">Panel de administración</p>}
        </div>
        <nav className="flex-1 p-3 space-y-0.5 min-h-0 flex flex-col">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => { setSection(id); setSidebarOpen(false) }}
              title={sidebarCollapsed ? label : undefined}
              className={`
                w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-colors shrink-0
                ${sidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5 text-left'}
                ${section === id ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{label}</span>}
            </button>
          ))}
        </nav>
        <div className={`border-t border-gray-100 shrink-0 ${sidebarCollapsed ? 'p-2' : 'p-3'}`}>
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`w-full flex items-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors ${sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'}`}
            title={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
            aria-label={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!sidebarCollapsed && <span className="text-sm font-medium">Colapsar</span>}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-700 text-sm font-medium transition-colors mt-1 ${sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'}`}
            title={sidebarCollapsed ? 'Cerrar sesión' : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main: solo el contenido con scroll */}
      <main className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 shrink-0 z-30 px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 text-gray-600"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {section === 'dashboard' && 'Dashboard'}
            {section === 'reservar' && 'Reservar cita'}
            {section === 'day' && 'Reservas por día'}
            {section === 'profile' && 'Perfil'}
            {section === 'attendants' && 'Asistentes'}
          </h2>
          {user?.email && (
            <span className="ml-auto text-xs text-gray-500 truncate max-w-[140px] sm:max-w-none" title={user.email}>
              {user.email}
            </span>
          )}
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
        {updateError && !detailReservation && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-0.5">{updateError}</p>
            </div>
            <button
              type="button"
              onClick={() => setUpdateError(null)}
              className="p-1 rounded-lg hover:bg-red-100 text-red-600"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {section === 'dashboard' && (
          <section className="mb-8">
            <p className="text-gray-600 text-sm mb-6">
              {isAdmin ? 'Resumen general de reservas.' : 'Tus citas asignadas.'}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reservas hoy</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{dashboardSummary.hoy}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pendientes</p>
                <p className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1">{dashboardSummary.pendientes}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Atendidos</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{dashboardSummary.atendidos}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary-600 mt-1">{dashboardSummary.total}</p>
              </div>
            </div>

            {/* Listado de reservas integrado en el dashboard */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
              <div className="p-5 sm:p-6 lg:p-8 border-b border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Listado de reservas</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Busca por nombre, teléfono o servicio. Haz clic en una fila para ver o editar.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={exportCsv}
                      disabled={filteredList.length === 0}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                      title="Descargar CSV"
                    >
                      <FileText className="w-4 h-4" />
                      CSV
                    </button>
                    <button
                      type="button"
                      onClick={exportExcel}
                      disabled={filteredList.length === 0}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                      title="Descargar Excel"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Excel
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-5 sm:p-6 lg:p-8 pt-0">
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-5">
                  <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Buscar nombre, celular, servicio..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 min-h-[44px] border border-gray-300 rounded-xl text-sm"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ReservationStatus | 'todos')}
                    className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] border border-gray-300 rounded-xl text-sm touch-manipulation"
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="atendido">Atendido</option>
                    <option value="cancelado" suppressHydrationWarning>
                      {mounted ? 'Canceladas' : 'Cancelado'}
                    </option>
                  </select>
                  <input
                    type="month"
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] border border-gray-300 rounded-xl text-sm touch-manipulation"
                  />
                </div>

                <div className="block md:hidden space-y-2">
                  {filteredList.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-primary-50/50 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setDetailReservation(r)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">{r.nombre} {r.apellido}</p>
                            <p className="text-xs text-gray-500">{r.telefono || 'Sin celular'}</p>
                            <p className="text-sm text-gray-600">{r.servicio}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {format(parseISO(r.fecha), 'd/M/yyyy', { locale: es })} · {r.hora}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                              r.status === 'pendiente'
                                ? 'bg-amber-100 text-amber-800'
                                : r.status === 'atendido'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                      </button>
                      <div className="flex items-center gap-1 shrink-0">
                        {r.status !== 'cancelado' ? (
                          <button
                            type="button"
                            onClick={() => handleCancelarReserva(r)}
                            className="p-2.5 rounded-xl text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                            title="Cancelar"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleReactivarReserva(r)}
                            className="p-2.5 rounded-xl text-gray-400 hover:text-green-600 hover:bg-green-50"
                            title="Reactivar"
                          >
                            <RotateCcw className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEliminarReserva(r)}
                          className="p-2.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50"
                          title="Eliminar del sistema"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/80 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th className="py-3.5 px-4">Fecha</th>
                        <th className="py-3.5 px-4">Hora</th>
                        <th className="py-3.5 px-4">Cliente</th>
                        <th className="py-3.5 px-4">Celular</th>
                        <th className="py-3.5 px-4">Servicio</th>
                        <th className="py-3.5 px-4">Estado</th>
                        <th className="py-3.5 px-4">Atiende</th>
                        <th className="py-3.5 px-4 w-20 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredList.map((r) => (
                        <tr
                          key={r.id}
                          onClick={() => setDetailReservation(r)}
                          className="border-b border-gray-100 hover:bg-primary-50/50 cursor-pointer"
                        >
                          <td className="py-3.5 px-4 text-gray-900">{format(parseISO(r.fecha), 'd/M/yyyy', { locale: es })}</td>
                          <td className="py-3.5 px-4 text-gray-700">{r.hora}</td>
                          <td className="py-3.5 px-4 font-medium text-gray-900">
                            {r.nombre} {r.apellido}
                          </td>
                          <td className="py-3.5 px-4 text-gray-700">{r.telefono || '—'}</td>
                          <td className="py-3.5 px-4 text-gray-700">{r.servicio}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                                r.status === 'pendiente'
                                  ? 'bg-amber-100 text-amber-800'
                                  : r.status === 'atendido'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-700">{getAttendantName(r) || '—'}</td>
                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              {r.status !== 'cancelado' ? (
                                <button
                                  type="button"
                                  onClick={() => handleCancelarReserva(r)}
                                  className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                  title="Cancelar reserva (queda en lista como cancelada)"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleReactivarReserva(r)}
                                  className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                                  title="Reactivar reserva"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleEliminarReserva(r)}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Eliminar del sistema (borrado definitivo)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredList.length === 0 && (
                  <p className="py-10 text-center text-gray-500 text-sm sm:text-base">No hay reservas con los filtros actuales.</p>
                )}
              </div>
            </div>
          </section>
        )}

        {section === 'reservar' && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden mb-8">
            <div className="p-5 sm:p-6 lg:p-8 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Nueva reserva</h2>
              <p className="text-sm text-gray-500 mt-0.5">Reserva a nombre del cliente. Verde: disponible · Rojo: ocupado. Al guardar, la reserva se verá al instante en el listado y en la agenda.</p>
            </div>
            <div className="p-5 sm:p-6 lg:p-8">
              <AdminBookingForm
                onSuccess={() => { fetchReservations(); setSection('dashboard') }}
                attendantId={!isAdmin ? currentAttendantId : undefined}
                attendants={isAdmin ? attendants : undefined}
              />
            </div>
          </section>
        )}

        {section === 'day' && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden mb-8">
            {/* Cabecera clara: fecha y navegación */}
            <div className="p-5 sm:p-6 lg:p-8 border-b border-gray-100 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Agenda del día</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Cada fila es un horario. Toca una cita para ver detalles o eliminarla y liberar el horario.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                  <button
                    onClick={goPrevDay}
                    className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Día anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalendarMonth(parseISO(selectedDate))
                      setShowDayCalendar(true)
                    }}
                    className="min-w-[140px] px-3 py-2.5 rounded-lg text-center font-semibold text-gray-900 capitalize text-base hover:bg-primary-50 hover:text-primary-700 transition-colors flex items-center justify-center gap-1.5"
                    aria-label="Abrir calendario para elegir día"
                  >
                    <Calendar className="w-4 h-4 text-primary-600" />
                    {format(parseISO(selectedDate), "EEEE d 'de' MMMM", { locale: es })}
                  </button>
                  <button
                    onClick={goNextDay}
                    className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Día siguiente"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Resumen del día en lenguaje claro */}
            <div className="p-5 sm:p-6 lg:p-8 pb-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Resumen de este día</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-xl bg-amber-50 border border-amber-200/80 px-4 py-3">
                  <p className="text-xs font-medium text-amber-700">Por atender</p>
                  <p className="text-2xl font-bold text-amber-800 mt-0.5">{daySummary.pendientes}</p>
                  <p className="text-[11px] text-amber-600 mt-0.5">Citas pendientes</p>
                </div>
                <div className="rounded-xl bg-blue-50 border border-blue-200/80 px-4 py-3">
                  <p className="text-xs font-medium text-blue-700">Atendidas</p>
                  <p className="text-2xl font-bold text-blue-800 mt-0.5">{daySummary.atendidos}</p>
                  <p className="text-[11px] text-blue-600 mt-0.5">Ya realizadas</p>
                </div>
                <div className="rounded-xl bg-red-50 border border-red-200/80 px-4 py-3">
                  <p className="text-xs font-medium text-red-700">Horas ocupadas</p>
                  <p className="text-2xl font-bold text-red-800 mt-0.5">{daySummary.ocupados}</p>
                  <p className="text-[11px] text-red-600 mt-0.5">Con reserva</p>
                </div>
                <div className="rounded-xl bg-green-50 border border-green-200/80 px-4 py-3">
                  <p className="text-xs font-medium text-green-700">Horas libres</p>
                  <p className="text-2xl font-bold text-green-800 mt-0.5">{daySummary.disponibles}</p>
                  <p className="text-[11px] text-green-600 mt-0.5">Disponibles</p>
                </div>
              </div>
            </div>

            {/* Lista de horarios: una fila por hora, más legible */}
            <div className="p-5 sm:p-6 lg:p-8">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Horario 9:00 – 20:00</p>
              <div className="space-y-2">
                {HORARIOS.map((hora) => {
                  const res = slotsWithReservations[hora]
                  const isBooked = !!res && res.status === 'pendiente'
                  const isAttended = !!res && res.status === 'atendido'
                  return (
                    <div
                      key={hora}
                      className={`flex items-center gap-3 rounded-xl border-2 p-3 sm:p-4 transition-colors ${
                        isBooked
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : isAttended
                          ? 'bg-blue-50 border-blue-200 text-blue-900'
                          : 'bg-green-50 border-green-200 text-green-800'
                      }`}
                    >
                      <span className="w-14 sm:w-16 shrink-0 font-semibold text-lg">{hora}</span>
                      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                        {res ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setDetailReservation(res)}
                              className="flex-1 min-w-0 text-left flex items-center gap-2"
                            >
                              <Info className="w-4 h-4 shrink-0 text-gray-500" />
                              <span className="font-medium truncate">{res.nombre} {res.apellido}</span>
                              <span className="text-sm opacity-90 hidden sm:inline">— {res.servicio}</span>
                            </button>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleCancelarReserva(res)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/80 hover:bg-amber-100 text-gray-600 hover:text-amber-700 border border-gray-200/80 text-xs font-medium transition-colors"
                                title="Cancelar (ver en lista canceladas)"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Cancelar</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEliminarReserva(res)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/80 hover:bg-red-100 text-gray-600 hover:text-red-700 border border-gray-200/80 text-xs font-medium transition-colors"
                                title="Eliminar del sistema"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Eliminar</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <span className="text-sm font-medium opacity-90">Sin reserva — horario libre</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {section === 'profile' && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden mb-8 max-w-xl">
            <div className="p-5 sm:p-6 lg:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tu perfil</h3>
              <div className="space-y-4 text-sm">
                {user?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{user.email}</span>
                  </div>
                )}
                {user?.user_metadata?.nombre && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{user.user_metadata.nombre} {user.user_metadata.apellido || ''}</span>
                  </div>
                )}
                {!user?.user_metadata?.nombre && user?.email && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">Cuenta vinculada</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-6">Para cambiar la contraseña, cierra sesión y usa &quot;¿Olvidaste tu contraseña?&quot; en la pantalla de inicio de sesión (si está configurado en Supabase).</p>
            </div>
          </section>
        )}

        {section === 'attendants' && (
          isAdmin ? (
            <AttendantsSection attendants={attendants} onAttendantCreated={fetchAttendantsList} />
          ) : (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden mb-8 max-w-xl">
              <div className="p-5 sm:p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Asistentes</h3>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 space-y-3">
                  <p className="font-medium">Solo el administrador puede gestionar asistentes.</p>
                  <p>Tu correo en esta sesión: <strong className="text-amber-900 break-all">{user?.email ?? '—'}</strong></p>
                  <p>Para que esta cuenta sea admin:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>En <code className="bg-amber-100/80 px-1 rounded">.env.local</code> (local) añade: <code className="break-all">NEXT_PUBLIC_ADMIN_EMAIL=</code> + el correo de arriba (sin espacios).</li>
                    <li>En Vercel: Settings → Environment Variables → <code>NEXT_PUBLIC_ADMIN_EMAIL</code> con el mismo correo.</li>
                    <li>Reinicia el servidor local (<code>npm run dev</code>) o haz <strong>Redeploy</strong> en Vercel después de cambiar la variable.</li>
                  </ul>
                </div>
              </div>
            </section>
          )
        )}

        {/* Modal calendario para elegir día (vista por día) */}
        {showDayCalendar && (
          <div
            className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowDayCalendar(false)}
            aria-modal
            role="dialog"
            aria-label="Seleccionar día"
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-4 sm:p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Elegir día</h3>
                <button
                  type="button"
                  onClick={() => setShowDayCalendar(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setCalendarMonth((m) => subMonths(m, 1))}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                  aria-label="Mes anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-base font-medium text-gray-900 capitalize">
                  {format(calendarMonth, 'MMMM yyyy', { locale: es })}
                </span>
                <button
                  type="button"
                  onClick={() => setCalendarMonth((m) => addMonths(m, 1))}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                  aria-label="Mes siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
                  <div key={d} className="p-1 text-center text-xs font-semibold text-gray-500">
                    {d}
                  </div>
                ))}
                {eachDayOfInterval({
                  start: startOfWeek(startOfMonth(calendarMonth), { weekStartsOn: 1 }),
                  end: endOfWeek(endOfMonth(calendarMonth), { weekStartsOn: 1 }),
                }).map((day) => {
                  const selected = isSameDay(day, parseISO(selectedDate))
                  const currentMonth = isSameMonth(day, calendarMonth)
                  const today = isToday(day)
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => {
                        setSelectedDate(format(day, 'yyyy-MM-dd'))
                        setShowDayCalendar(false)
                      }}
                      className={`aspect-square p-1 rounded-lg text-sm font-medium transition-colors ${
                        !currentMonth ? 'text-gray-300' : 'text-gray-900'
                      } ${selected ? 'bg-primary-600 text-white' : ''} ${
                        currentMonth && !selected ? 'hover:bg-primary-100' : ''
                      } ${today && !selected ? 'ring-1 ring-primary-400' : ''}`}
                    >
                      {format(day, 'd')}
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                Al elegir un día se actualizan las citas de esa fecha.
              </p>
            </div>
          </div>
        )}

        {/* Modal detalle */}
        {detailReservation && (
          <div
            className="fixed inset-0 z-30 flex items-end sm:items-center justify-center p-0 sm:p-6 lg:p-8 bg-black/50 overflow-y-auto"
            onClick={() => !updating && (setDetailReservation(null), setUpdateError(null))}
          >
            <div
              className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-w-lg w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 mt-auto sm:mt-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start gap-2 mb-4 sticky top-0 bg-white pb-2 border-b border-gray-100">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-900">Detalle de la reserva</h3>
                <button
                  onClick={() => !updating && (setDetailReservation(null), setUpdateError(null))}
                  className="p-2.5 min-h-[44px] min-w-[44px] rounded-full hover:bg-gray-100 text-gray-600 touch-manipulation flex items-center justify-center shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {updateError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{updateError}</p>
                </div>
              )}

              <div className="space-y-3 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{detailReservation.nombre} {detailReservation.apellido}</span>
                </div>
                {detailReservation.telefono && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${detailReservation.telefono}`} className="text-primary-600 hover:underline">
                      {detailReservation.telefono}
                    </a>
                  </div>
                )}
                {detailReservation.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${detailReservation.email}`} className="text-primary-600 hover:underline">
                      {detailReservation.email}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {format(parseISO(detailReservation.fecha), "d 'de' MMMM, yyyy", { locale: es })} · {detailReservation.hora}
                </div>
                <p><span className="text-gray-500">Edad:</span> {detailReservation.edad}</p>
                <p><span className="text-gray-500">Servicio:</span> {detailReservation.servicio}</p>
                {detailReservation.comentario && (
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-gray-700">{detailReservation.comentario}</p>
                  </div>
                )}
                <p className="text-gray-500 text-xs">
                  Creada: {format(parseISO(detailReservation.created_at), "d/M/yyyy HH:mm", { locale: es })}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quién atiende</label>
                  <select
                    value={detailReservation.attendant_id || ''}
                    onChange={(e) => {
                      const v = e.target.value
                      updateReservation(detailReservation.id, { attendant_id: v || null })
                      setDetailReservation({ ...detailReservation, attendant_id: v || null })
                    }}
                    disabled={updating}
                    className="w-full px-4 py-2.5 min-h-[44px] border border-gray-300 rounded-xl text-base touch-manipulation"
                  >
                    <option value="">Sin asignar</option>
                    {attendants.map((a) => (
                      <option key={a.id} value={a.id}>{a.nombre}{a.apellido ? ` ${a.apellido}` : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                    <Pencil className="w-4 h-4" />
                    Editar fecha y hora
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="date"
                      value={editFecha}
                      onChange={(e) => setEditFecha(e.target.value)}
                      disabled={updating}
                      className="flex-1 min-w-[140px] px-3 py-2.5 border border-gray-300 rounded-xl text-sm"
                    />
                    <select
                      value={editHora}
                      onChange={(e) => setEditHora(e.target.value)}
                      disabled={updating}
                      className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm min-w-[100px]"
                    >
                      {HORARIOS.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (editFecha && editHora) {
                          updateReservation(detailReservation.id, { fecha: editFecha, hora: editHora })
                        }
                      }}
                      disabled={updating || !editFecha || !editHora}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 text-sm font-medium"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      Guardar cambios
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  {detailReservation.status === 'pendiente' && (
                    <>
                      <button
                        onClick={() => updateReservation(detailReservation.id, { status: 'atendido' })}
                        disabled={updating}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 touch-manipulation"
                      >
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        Marcar atendido
                      </button>
                      <button
                        onClick={() => handleCancelarReserva(detailReservation, undefined, true)}
                        disabled={updating}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:opacity-50 touch-manipulation"
                      >
                        <XCircle className="w-4 h-4 shrink-0" />
                        Cancelar reserva
                      </button>
                    </>
                  )}
                  {detailReservation.status === 'atendido' && (
                    <button
                      onClick={() => handleCancelarReserva(detailReservation, undefined, true)}
                      disabled={updating}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:opacity-50 touch-manipulation"
                    >
                      <XCircle className="w-4 h-4 shrink-0" />
                      Cancelar reserva
                    </button>
                  )}
                  {detailReservation.status === 'cancelado' && (
                    <button
                      onClick={() => handleReactivarReserva(detailReservation, undefined)}
                      disabled={updating}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 touch-manipulation"
                    >
                      <RotateCcw className="w-4 h-4 shrink-0" />
                      Reactivar reserva
                    </button>
                  )}
                  <button
                    onClick={() => handleEliminarReserva(detailReservation, undefined, true)}
                    disabled={updating}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-white border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 disabled:opacity-50 touch-manipulation font-medium"
                  >
                    <Trash2 className="w-4 h-4 shrink-0" />
                    Eliminar del sistema
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  )
}
