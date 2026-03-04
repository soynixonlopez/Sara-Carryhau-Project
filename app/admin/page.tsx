'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  format,
  startOfDay,
  parseISO,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
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
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Reservation, Attendant, ReservationStatus } from '@/lib/supabase/types'
import * as XLSX from 'xlsx'

const HORARIOS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

export default function AdminPage() {
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [attendants, setAttendants] = useState<Attendant[]>([])
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'))
  const [view, setView] = useState<'day' | 'list'>('list')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'todos'>('todos')
  const [monthFilter, setMonthFilter] = useState(() => format(new Date(), 'yyyy-MM'))
  const [detailReservation, setDetailReservation] = useState<Reservation | null>(null)
  const [editFecha, setEditFecha] = useState('')
  const [editHora, setEditHora] = useState('')
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
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

  useEffect(() => {
    const supabase = createClient()
    const fetchAttendants = async () => {
      const { data } = await supabase.from('attendants').select('id, nombre').order('nombre')
      if (data) setAttendants(data as Attendant[])
    }
    fetchAttendants()
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const fetchReservations = async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*, attendants(id, nombre)')
        .order('fecha', { ascending: false })
        .order('hora', { ascending: true })
      if (!error && data) setReservations(data as Reservation[])
    }
    fetchReservations()

    const channel = supabase
      .channel('reservations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        fetchReservations()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const reservationsForSelectedDay = useMemo(() => {
    return reservations.filter(
      (r) => r.fecha === selectedDate && r.status !== 'cancelado'
    )
  }, [reservations, selectedDate])

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
    let list = reservations
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
  }, [reservations, search, statusFilter, monthFilter])

  const dashboardSummary = useMemo(() => {
    const total = reservations.length
    const pendientes = reservations.filter((r) => r.status === 'pendiente').length
    const atendidos = reservations.filter((r) => r.status === 'atendido').length
    const hoy = reservations.filter((r) => r.fecha === todayDate && r.status !== 'cancelado').length
    return { total, pendientes, atendidos, hoy }
  }, [reservations, todayDate])

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
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    )
    if (detailReservation?.id === id) {
      setDetailReservation((prev) => (prev ? { ...prev, ...updates } : null))
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
    if (att && typeof att === 'object' && 'nombre' in att) return (att as { nombre: string }).nombre
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

  return (
    <div className="min-h-[100dvh] bg-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 truncate">Panel de reservas</h1>
            <p className="text-sm text-gray-500 mt-0.5">Sara Carryhau Estética</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors touch-manipulation shrink-0 border border-gray-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
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
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
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
        </section>

        <nav className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6" aria-label="Vista del panel">
          <button
            onClick={() => setView('list')}
            className={`flex-1 min-w-0 inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-xl font-medium transition-all touch-manipulation border ${
              view === 'list'
                ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            <List className="w-5 h-5 shrink-0" />
            <span className="text-sm sm:text-base">Listado de reservas</span>
          </button>
          <button
            onClick={() => setView('day')}
            className={`flex-1 min-w-0 inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-xl font-medium transition-all touch-manipulation border ${
              view === 'day'
                ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            <Calendar className="w-5 h-5 shrink-0" />
            <span className="text-sm sm:text-base">Agenda por día</span>
          </button>
        </nav>

        {view === 'list' && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden mb-8">
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

            {/* Lista en cards para móvil */}
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

            {/* Tabla para tablet y desktop */}
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
          </section>
        )}

        {view === 'day' && (
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
                  <time className="min-w-[140px] text-center font-semibold text-gray-900 capitalize text-base">
                    {format(parseISO(selectedDate), "EEEE d 'de' MMMM", { locale: es })}
                  </time>
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
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Horario 9:00 – 17:00</p>
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
                      <option key={a.id} value={a.id}>{a.nombre}</option>
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
      </main>
    </div>
  )
}
