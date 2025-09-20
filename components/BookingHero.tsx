'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, CheckCircle } from 'lucide-react'

const BookingHero = () => {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom section-padding relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-6 py-3 rounded-full text-sm font-medium mb-8"
          >
            <Calendar className="w-5 h-5" />
            <span>Reserva Online</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight"
          >
            Reserva tu Cita
            <span className="gradient-text block">Fácil y Rápido</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
          >
            Agenda tu tratamiento estético de forma sencilla. Elige la fecha y hora 
            que mejor se adapte a tu agenda y confirma tu cita en pocos minutos.
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-gray-700 font-medium whitespace-nowrap">Disponibilidad en Tiempo Real</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary-600" />
              </div>
              <span className="text-gray-700 font-medium whitespace-nowrap">Confirmación Inmediata</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-accent-600" />
              </div>
              <span className="text-gray-700 font-medium whitespace-nowrap">Recordatorios Automáticos</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default BookingHero
