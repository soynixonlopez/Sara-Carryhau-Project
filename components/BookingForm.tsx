'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Calendar,
  Clock,
  User,
  Sparkles,
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

interface BookingFormData {
  nombre: string
  apellido: string
  edad: string
  servicio: string
  comentario: string
}

const SERVICES = [
  'Faciales',
  'Depilación con Cera',
  'Masajes',
  'Cauterizaciones',
  'Laminado y Lifting',
  'Micropigmentación',
  'Pestañas Pelo a Pelo',
  'Consulta Personalizada',
]

const HORARIOS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
]

const BookingForm = () => {
  const ref = useRef(null)
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

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
    }
  }

  const canGoToStep2 = !!selectedDate
  const canGoToStep3 = canGoToStep2 && !!selectedTime

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedDate || !selectedTime) return
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const fechaStr = format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })
      const res = await fetch('https://formsubmit.co/ajax/sarathc@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `Nueva reserva: ${data.nombre} ${data.apellido} - ${fechaStr} ${selectedTime}`,
          nombre: data.nombre,
          apellido: data.apellido,
          edad: data.edad,
          servicio: data.servicio,
          fecha: fechaStr,
          hora: selectedTime,
          comentario: data.comentario || '(Sin comentarios)',
        }),
      })

      const result = await res.json()
      if (result.success === 'true' || result.success === true || res.ok) {
        setSubmitStatus('success')
        setStep(1)
        setSelectedDate(null)
        setSelectedTime(null)
        reset()
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error enviando reserva:', error)
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
        <div className="bg-gradient-to-r from-primary-50 via-white to-secondary-50 px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
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
                  <span className="mt-1.5 text-xs font-medium text-gray-600 hidden sm:block">
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1 bg-gray-200 rounded">
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
                  No pudimos procesar tu reserva. Inténtalo de nuevo o escríbenos por WhatsApp.
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
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-serif font-bold text-gray-900">
                    ¿Qué día te viene bien?
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Lun–Vie · Horario de atención 9:00 a.m. – 5:00 p.m.
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
                  <h2 className="text-2xl font-serif font-bold text-gray-900">
                    Elige tu horario
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {selectedDate && format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                  </p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 max-w-lg mx-auto">
                  {HORARIOS.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setSelectedTime(h)}
                      className={`py-3 px-4 rounded-xl font-medium transition-all ${
                        selectedTime === h
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>

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
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    Casi listo
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">
                    Cuéntanos un poco de ti
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Reserva para el{' '}
                    <span className="font-semibold text-gray-900">
                      {selectedDate && format(selectedDate, "d/M/yyyy", { locale: es })} a las {selectedTime}
                    </span>
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
