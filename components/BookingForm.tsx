'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
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
import { siteConfig } from '@/lib/config'

interface BookingFormData {
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

const BookingForm = () => {
  const ref = useRef(null)
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitError, setSubmitError] = useState<string>('')
  const [occupiedHours, setOccupiedHours] = useState<string[]>([])
  const [loadingHours, setLoadingHours] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>()

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
    const fetchAvailability = async () => {
      if (!selectedDate) {
        setOccupiedHours([])
        return
      }

      setLoadingHours(true)
      try {
        const fechaApi = format(selectedDate, 'yyyy-MM-dd')
        const res = await fetch(`/api/reservations?fecha=${fechaApi}`)
        if (!res.ok) throw new Error('No se pudo consultar disponibilidad')
        const result = await res.json()
        const occupied = Array.isArray(result.occupiedHours) ? result.occupiedHours : []
        setOccupiedHours(occupied)
      } catch (error) {
        console.error('Error consultando disponibilidad:', error)
        setOccupiedHours([])
      } finally {
        setLoadingHours(false)
      }
    }

    fetchAvailability()
  }, [selectedDate])

  useEffect(() => {
    if (selectedTime && occupiedHours.includes(selectedTime)) {
      setSelectedTime(null)
    }
  }, [occupiedHours, selectedTime])

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedDate || !selectedTime) return
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitError('')

    const fechaStr = format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })
    const fechaApi = format(selectedDate, 'yyyy-MM-dd')

    try {
      const resApi = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          email: data.email || null,
          edad: data.edad,
          servicio: data.servicio,
          comentario: data.comentario || null,
          fecha: fechaApi,
          hora: selectedTime,
        }),
      })

      const errBody = await resApi.json().catch(() => ({}))
      const apiMessage = typeof errBody?.error === 'string' ? errBody.error : ''

      if (!resApi.ok) {
        setSubmitError(apiMessage || 'Error al guardar la reserva')
        setSubmitStatus('error')
        return
      }

      fetch(`https://formsubmit.co/ajax/${siteConfig.contactEmail}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Nueva reserva: ${data.nombre} ${data.apellido} - ${fechaStr} ${selectedTime ?? ''}`,
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          email: data.email || '(No indicado)',
          edad: data.edad,
          servicio: data.servicio,
          fecha: fechaStr,
          hora: selectedTime ?? '',
          comentario: data.comentario || '(Sin comentarios)',
        }),
      }).catch(() => {})

      setSubmitStatus('success')
      setStep(1)
      setSelectedDate(null)
      setSelectedTime(null)
      reset()
    } catch (error) {
      console.error('Error enviando reserva:', error)
      setSubmitError(
        error instanceof Error ? error.message : 'No pudimos procesar tu reserva. Inténtalo de nuevo o escríbenos por WhatsApp.'
      )
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { num: 1, label: 'Elige el día', icon: Calendar },
    { num: 2, label: 'Elige la hora', icon: Clock },
    { num: 3, label: 'Tus datos', icon: User },
  ]

  return (
    <section ref={ref} className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-primary-100/50 overflow-hidden"
      >
        {/* Indicador de pasos */}
        <div className="bg-gradient-to-r from-primary-50/80 via-white to-secondary-50/80 px-4 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-center gap-3 sm:gap-6 max-w-lg mx-auto">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step >= s.num
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className="mt-1.5 text-xs font-medium text-gray-600 text-center">
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-8 sm:w-12 h-0.5 bg-gray-200 rounded flex-shrink-0">
                    <motion.div
                      className="h-full bg-primary-400 rounded"
                      initial={{ width: 0 }}
                      animate={{ width: step > s.num ? '100%' : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-10">
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-5 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-4"
            >
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-800">Solicitud enviada</h3>
                <p className="text-sm text-green-700 mt-1">
                  Hemos recibido tu reserva. Te contactaremos pronto a WhatsApp o correo para
                  confirmar tu cita. ¡Gracias por confiar en nosotros!
                </p>
              </div>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4"
            >
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">Error al enviar</h3>
                <p className="text-sm text-red-700 mt-1">
                  {submitError || 'No pudimos procesar tu reserva. Inténtalo de nuevo o escríbenos por WhatsApp.'}
                </p>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* Paso 1: Calendario */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
                    ¿Qué día?
                  </h2>
                  <p className="text-gray-500 text-sm mt-0.5">
                    Lun–Vie 9:00–17:00
                  </p>
                </div>

                <div className="flex items-center justify-between max-w-xs mx-auto">
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 rounded-full hover:bg-primary-50 text-primary-600 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-lg font-semibold text-gray-900 capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: es })}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 rounded-full hover:bg-primary-50 text-primary-600 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1.5 max-w-sm mx-auto">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
                    <div
                      key={d}
                      className="p-1.5 text-center text-xs font-semibold text-gray-500"
                    >
                      {d}
                    </div>
                  ))}
                  {calendarDays.map((day) => {
                    const available = isDateAvailable(day) && !isBefore(day, startOfDay(new Date()))
                    const selected = selectedDate && isSameDay(day, selectedDate)
                    const today = isToday(day)
                    const sameMonth = isSameMonth(day, currentMonth)
                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        disabled={!available}
                        className={`
                          aspect-square p-1 rounded-xl text-sm font-medium transition-all
                          ${!sameMonth ? 'text-gray-300' : 'text-gray-900'}
                          ${today && available ? 'ring-2 ring-primary-400 ring-offset-2' : ''}
                          ${selected ? 'bg-primary-600 text-white shadow-md' : ''}
                          ${available && !selected ? 'hover:bg-primary-100 hover:text-primary-700' : ''}
                          ${!available ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        {format(day, 'd')}
                      </button>
                    )
                  })}
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    disabled={!canGoToStep2}
                    onClick={() => setStep(2)}
                    className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente: elegir hora
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Paso 2: Hora */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
                    ¿Qué hora?
                  </h2>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {selectedDate && format(selectedDate, "EEE d MMM", { locale: es })}
                  </p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 max-w-lg mx-auto">
                  {HORARIOS.map((h) => {
                    const isOccupied = occupiedHours.includes(h)
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => !isOccupied && setSelectedTime(h)}
                        disabled={isOccupied}
                        className={`py-3 px-4 rounded-xl font-medium transition-all ${
                          isOccupied
                            ? 'bg-red-100 text-red-700 border border-red-200 cursor-not-allowed'
                            : selectedTime === h
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                        }`}
                      >
                        <span className="block">{h}</span>
                        {isOccupied && <span className="block text-[10px] mt-0.5">Ocupado</span>}
                      </button>
                    )
                  })}
                </div>
                <p className="text-center text-xs text-gray-500">
                  {loadingHours
                    ? 'Consultando disponibilidad...'
                    : 'Las horas en rojo ya están ocupadas.'}
                </p>

                <div className="flex justify-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-outline inline-flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Atrás
                  </button>
                  <button
                    type="button"
                    disabled={!canGoToStep3}
                    onClick={() => setStep(3)}
                    className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente: tus datos
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Paso 3: Formulario */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
                    Tus datos
                  </h2>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {selectedDate && format(selectedDate, "d/M/yyyy", { locale: es })}
                    {selectedTime != null ? ` · ${selectedTime}` : ''}
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        {...register('nombre', { required: 'Requerido' })}
                        placeholder="Tu nombre"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      />
                      {errors.nombre && (
                        <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        {...register('apellido', { required: 'Requerido' })}
                        placeholder="Tu apellido"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      />
                      {errors.apellido && (
                        <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <Phone className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                      Celular *
                    </label>
                    <input
                      type="tel"
                      {...register('telefono', {
                        required: 'Requerido',
                        pattern: {
                          value: /^[0-9+\-\s()]{7,}$/,
                          message: 'Celular inválido',
                        },
                      })}
                      placeholder="+507 6000-0000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    />
                    {errors.telefono && (
                      <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <Mail className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                      Correo (opcional)
                    </label>
                    <input
                      type="email"
                      {...register('email', {
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email inválido',
                        },
                      })}
                      placeholder="tu@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Edad *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={120}
                        {...register('edad', {
                          required: 'Requerido',
                          min: { value: 1, message: 'Edad válida' },
                          max: { value: 120, message: 'Edad válida' },
                        })}
                        placeholder="Ej. 28"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      />
                      {errors.edad && (
                        <p className="mt-1 text-sm text-red-600">{errors.edad.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Servicio *
                      </label>
                      <select
                        {...register('servicio', { required: 'Elige un servicio' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Selecciona un tratamiento</option>
                        {SERVICES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.servicio && (
                        <p className="mt-1 text-sm text-red-600">{errors.servicio.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <MessageSquare className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                      Comentario (opcional)
                    </label>
                    <textarea
                      {...register('comentario')}
                      rows={3}
                      placeholder="Alergias, preferencias, o algo que debamos saber..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-outline inline-flex items-center justify-center gap-2 order-2 sm:order-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Atrás
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary flex-1 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Confirmar reserva
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  )
}

export default BookingForm
