'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  CheckCircle, 
  Calendar,
  Star,
  Shield
} from 'lucide-react'

const BookingInfo = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })


  const policies = [
    {
      icon: Calendar,
      title: 'Política de Cancelación',
      description: 'Puedes cancelar o reprogramar tu cita con 24 horas de anticipación sin coste alguno.'
    },
    {
      icon: Shield,
      title: 'Protocolos de Seguridad',
      description: 'Seguimos estrictos protocolos de higiene y seguridad en todos nuestros tratamientos.'
    },
    {
      icon: Star,
      title: 'Satisfacción Garantizada',
      description: 'Si no estás completamente satisfecha, trabajaremos contigo para encontrar la mejor solución.'
    }
  ]

  const tips = [
    'Llega 10 minutos antes de tu cita',
    'No uses maquillaje para tratamientos faciales',
    'Evita la exposición solar antes de depilación',
    'Trae ropa cómoda para masajes',
    'Informa sobre alergias o medicamentos'
  ]

  return (
    <div ref={ref} className="space-y-8">

      {/* Policies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">
          Políticas y Términos
        </h3>
        
        <div className="space-y-4">
          {policies.map((policy, index) => (
            <motion.div
              key={policy.title}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              className="flex items-start space-x-3"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <policy.icon className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {policy.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {policy.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6"
      >
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">
          Consejos para tu Cita
        </h3>
        
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <motion.div
              key={tip}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: 0.7 + index * 0.05, duration: 0.4 }}
              className="flex items-start space-x-3"
            >
              <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{tip}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}

export default BookingInfo
