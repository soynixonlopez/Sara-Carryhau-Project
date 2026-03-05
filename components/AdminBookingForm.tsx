'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isPast,
  isBefore,
  startOfDay,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { RESERVATION_SERVICES, RESERVATION_HORARIOS } from '@/lib/constants'
import type { Attendant } from '@/lib/supabase/types'

export interface AdminBookingFormData {
  nombre: string
  apellido: string
  telefono: string
  email?: string
  edad: string
  servicio: string
  comentario: string
}

const SERVICES = [...RESERVATION_SERVICES]
const HORARIOS = [...RESERVATION_HORARIOS]

interface AdminBookingFormProps {
  onSuccess?: () => void
  /** Si es colaborador, las reservas se crean bajo su nombre (quién atiende). */
  attendantId?: string | null
  /** Si es admin, lista de asistentes para elegir quién atiende (incluye a Sara). */
  attendants?: Attendant[] | null
}

export default function AdminBookingForm({ onSuccess, attendantId, attendants }: AdminBookingFormProps) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitError, setSubmitError] = useState('')
  const [occupiedHours, setOccupiedHours] = useState<string[]>([])
  const [loadingHours, setLoadingHours] = useState(false)
  const [selectedAttendantId, setSelectedAttendantId] = useState<string>('')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AdminBookingFormData>()

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const isDateAvailable = (date: Date) => {
    const day = date.getDay()
    return day !== 0 && day !== 6
  }

  const handleDateSelect = (date: Date) => {
    if (isDateAvailable(date) && !isPast(startOfDay(date))) {
      setSelectedDate(date)
      setSelectedTime(null)
    }
  }

  const canGoToStep2 = !!selectedDate
  const canGoToStep3 = canGoToStep2 && !!selectedTime

  useEffect(() => {
    if (!selectedDate) {
      setOccupiedHours([])
      return
    }
    setLoadingHours(true)
    const fechaApi = format(selectedDate, 'yyyy-MM-dd')
    const url = typeof window !== 'undefined' ? `${window.location.origin}/api/reservations?fecha=${encodeURIComponent(fechaApi)}` : `/api/reservations?fecha=${fechaApi}`
    fetch(url)
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('Error')))
      .then((data) => setOccupiedHours(Array.isArray(data?.occupiedHours) ? data.occupiedHours : []))
      .catch(() => setOccupiedHours([]))
      .finally(() => setLoadingHours(false))
  }, [selectedDate])

  useEffect(() => {
    if (selectedTime && occupiedHours.includes(selectedTime)) setSelectedTime(null)
  }, [occupiedHours, selectedTime])

  const onSubmit = async (data: AdminBookingFormData) => {
    if (!selectedDate || !selectedTime) return
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitError('')
    const fechaApi = format(selectedDate, 'yyyy-MM-dd')
    const apiUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/reservations` : '/api/reservations'
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.nombre.trim(),
          apellido: data.apellido.trim(),
          telefono: data.telefono.trim(),
          email: data.email?.trim() || null,
          edad: String(data.edad).trim(),
          servicio: data.servicio,
          comentario: data.comentario?.trim() || null,
          fecha: fechaApi,
          hora: selectedTime,
          attendant_id: attendantId ?? (selectedAttendantId || null),
        }),
      })
      const body = await res.json().catch(() => ({}))
      const msg = typeof body?.error === 'string' ? body.error : ''
      if (!res.ok) {
        setSubmitError(msg || 'Error al guardar la reserva')
        setSubmitStatus('error')
        return
      }
      setSubmitStatus('success')
      setStep(1)
      setSelectedDate(null)
      setSelectedTime(null)
      setSelectedAttendantId('')
      reset()
      onSuccess?.()
    } catch {
      setSubmitError('Error de conexión. Inténtalo de nuevo.')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { num: 1, label: 'Día', icon: Calendar },
    { num: 2, label: 'Hora', icon: Clock },
    { num: 3, label: 'Datos cliente', icon: User },
  ]

  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
      <div className="border-b border-gray-100 bg-gray-50/80 px-4 sm:px-6 py-3">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s.num ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                <s.icon className="w-4 h-4" />
              </div>
              <span className="ml-1.5 text-xs font-medium text-gray-600 hidden sm:inline">{s.label}</span>
              {i < steps.length - 1 && (
                <div className="w-4 sm:w-8 h-0.5 bg-gray-200 rounded-full mx-1 sm:mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {submitStatus === 'success' && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Reserva creada</p>
              <p className="text-sm text-green-700 mt-0.5">Se reflejará en el listado y en la agenda al instante.</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{submitError}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <p className="text-sm font-medium text-gray-700">Elige el día (Lun–Vie)</p>
              <div className="flex items-center justify-between max-w-[240px] mx-auto">
                <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-semibold text-gray-900 capitalize">{format(currentMonth, 'MMMM yyyy', { locale: es })}</span>
                <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 max-w-[280px] mx-auto">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
                  <div key={d} className="p-1 text-center text-[10px] font-semibold text-gray-500">{d}</div>
                ))}
                {calendarDays.map((day) => {
                  const available = isDateAvailable(day) && !isBefore(day, startOfDay(new Date()))
                  const selected = selectedDate && isSameDay(day, selectedDate)
                  const sameMonth = isSameMonth(day, currentMonth)
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      disabled={!available}
                      className={`aspect-square p-0.5 rounded-lg text-xs font-medium transition-colors ${
                        !sameMonth ? 'text-gray-300' : 'text-gray-900'
                      } ${selected ? 'bg-primary-600 text-white' : ''} ${
                        available && !selected ? 'hover:bg-primary-100' : ''
                      } ${!available ? 'opacity-40 cursor-not-allowed' : ''} ${isToday(day) && available ? 'ring-1 ring-primary-400' : ''}`}
                    >
                      {format(day, 'd')}
                    </button>
                  )
                })}
              </div>
              <div className="flex justify-center pt-2">
                <button type="button" disabled={!canGoToStep2} onClick={() => setStep(2)} className="btn-primary text-sm py-2.5 px-4 disabled:opacity-50 flex items-center gap-1.5">
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <p className="text-sm font-medium text-gray-700">
                ¿Qué hora? — {selectedDate && format(selectedDate, "EEE d MMM", { locale: es })}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                {loadingHours ? 'Consultando...' : 'Verde: disponible · Rojo: ocupado'}
              </p>
              <div className="max-h-[260px] overflow-y-auto rounded-xl border border-gray-200 bg-gray-50/50 p-2">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {HORARIOS.map((h) => {
                    const isOccupied = occupiedHours.includes(h)
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => !isOccupied && setSelectedTime(h)}
                        disabled={isOccupied}
                        className={`py-2 px-2 rounded-lg text-sm font-medium transition-colors min-w-0 ${
                          isOccupied
                            ? 'bg-red-100 text-red-700 border border-red-200 cursor-not-allowed'
                            : selectedTime === h
                            ? 'bg-primary-600 text-white'
                            : 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200'
                        }`}
                      >
                        <span className="block truncate">{h}</span>
                        {isOccupied && <span className="block text-[10px] opacity-90">Ocupado</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <button type="button" onClick={() => setStep(1)} className="btn-outline text-sm py-2 px-3 flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> Atrás
                </button>
                <button type="button" disabled={!canGoToStep3} onClick={() => setStep(3)} className="btn-primary text-sm py-2 px-4 disabled:opacity-50 flex items-center gap-1">
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm font-medium text-gray-700 mb-4">
                Datos del cliente — {selectedDate && format(selectedDate, 'd/M/yyyy', { locale: es })} · {selectedTime}
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
                    <input type="text" {...register('nombre', { required: 'Requerido' })} placeholder="Nombre" className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    {errors.nombre && <p className="mt-0.5 text-xs text-red-600">{errors.nombre.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Apellido *</label>
                    <input type="text" {...register('apellido', { required: 'Requerido' })} placeholder="Apellido" className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    {errors.apellido && <p className="mt-0.5 text-xs text-red-600">{errors.apellido.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Celular *</label>
                  <input type="tel" {...register('telefono', { required: 'Requerido', pattern: { value: /^[0-9+\-\s()]{7,}$/, message: 'Inválido' }})} placeholder="+507 6000-0000" className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                  {errors.telefono && <p className="mt-0.5 text-xs text-red-600">{errors.telefono.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Correo (opcional)</label>
                  <input type="email" {...register('email')} placeholder="email@ejemplo.com" className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Edad *</label>
                    <input type="number" min={1} max={120} {...register('edad', { required: 'Requerido', min: 1, max: 120 })} placeholder="Ej. 28" className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    {errors.edad && <p className="mt-0.5 text-xs text-red-600">{errors.edad.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Servicio *</label>
                    <select {...register('servicio', { required: 'Elige servicio' })} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="">Selecciona</option>
                      {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.servicio && <p className="mt-0.5 text-xs text-red-600">{errors.servicio.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Comentario (opcional)</label>
                  <textarea {...register('comentario')} rows={2} placeholder="Notas..." className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
                </div>
                {attendantId ? (
                  <p className="text-sm text-primary-700 font-medium rounded-xl bg-primary-50 border border-primary-200 px-3 py-2.5">
                    La atenderás tú. La reserva aparecerá en tu lista al instante.
                  </p>
                ) : attendants && attendants.length > 0 ? (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Quién atiende</label>
                    <select
                      value={selectedAttendantId}
                      onChange={(e) => setSelectedAttendantId(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Sin asignar</option>
                      {attendants.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.nombre}{a.apellido ? ` ${a.apellido}` : ''}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Elige si lo atiendes tú (Sara) o un asistente. Se verá en la lista al guardar.</p>
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button type="button" onClick={() => setStep(2)} className="btn-outline text-sm py-2.5 px-4 flex items-center gap-1.5">
                    <ChevronLeft className="w-4 h-4" /> Atrás
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2 disabled:opacity-50">
                    {isSubmitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    {isSubmitting ? 'Guardando...' : 'Crear reserva'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
