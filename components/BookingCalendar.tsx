'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isPast } from 'date-fns'
import { es } from 'date-fns/locale'

const BookingCalendar = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Horarios disponibles (ejemplo)
  const availableSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ]

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const isDateAvailable = (date: Date) => {
    // Lógica para verificar disponibilidad (ejemplo: no fines de semana)
    const day = date.getDay()
    return day !== 0 && day !== 6 // No domingos ni sábados
  }

  const handleDateSelect = (date: Date) => {
    if (isDateAvailable(date) && !isPast(date)) {
      setSelectedDate(date)
    }
  }

  return (
    <section ref={ref} className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Selecciona Fecha y Hora
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Disponibilidad en tiempo real</span>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <h3 className="text-xl font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h3>
          
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {/* Days of week */}
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day) => {
            const isAvailable = isDateAvailable(day)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const isCurrentDay = isToday(day)
            const isPastDay = isPast(day)
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateSelect(day)}
                disabled={!isAvailable || isPastDay}
                className={`
                  p-2 text-center text-sm rounded-lg transition-all duration-200
                  ${isSameMonth(day, currentDate) ? 'text-gray-900' : 'text-gray-400'}
                  ${isCurrentDay ? 'bg-primary-100 text-primary-700 font-semibold' : ''}
                  ${isSelected ? 'bg-primary-600 text-white font-semibold' : ''}
                  ${isAvailable && !isPastDay && !isSelected ? 'hover:bg-primary-50 hover:text-primary-700' : ''}
                  ${!isAvailable || isPastDay ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {format(day, 'd')}
              </button>
            )
          })}
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="border-t pt-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-primary-600" />
              <h4 className="font-semibold text-gray-900">
                Horarios disponibles para {format(selectedDate, 'dd/MM/yyyy')}
              </h4>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {availableSlots.map((time) => (
                <button
                  key={time}
                  className="p-3 text-center bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors duration-200 font-medium"
                >
                  {time}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Legend */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex flex-wrap items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span>No disponible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-100 rounded-full"></div>
              <span>Hoy</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default BookingCalendar
