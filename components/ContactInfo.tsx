'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Clock, 
  Mail, 
  MapPin, 
  Calendar,
  Star,
  Heart
} from 'lucide-react'

const ContactInfo = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const contactDetails = [
    {
      icon: Mail,
      title: 'Email',
      content: 'sarathc@gmail.com',
      description: 'Consultas detalladas y reservas',
      action: 'mailto:sarathc@gmail.com',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100'
    },
    {
      icon: MapPin,
      title: 'Dirección',
      content: 'Mini Mall Cangrejo, local 03',
      description: 'Pretty Supply',
      action: '#',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Clock,
      title: 'Horarios',
      content: 'Lun-Vie: 9:00-19:00',
      description: 'Sáb: 9:00-15:00 | Dom: Cerrado',
      action: '#',
      color: 'text-accent-600',
      bgColor: 'bg-accent-100'
    }
  ]

  const quickActions = [
    {
      icon: Calendar,
      title: 'Reservar Cita',
      description: 'Agenda tu tratamiento online',
      href: '/reservar',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: Star,
      title: 'Ver Servicios',
      description: 'Descubre todos nuestros tratamientos',
      href: '/servicios',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: Heart,
      title: 'Conocer a Sara',
      description: 'Descubre la profesional detrás del centro',
      href: '/sobre-sara',
      color: 'from-pink-500 to-pink-600'
    }
  ]


  return (
    <div ref={ref} className="space-y-8">
      {/* Contact Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">
          Información de Contacto
        </h3>
        
        <div className="space-y-6">
          {contactDetails.map((detail, index) => (
            <motion.a
              key={detail.title}
              href={detail.action}
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className={`w-12 h-12 ${detail.bgColor} rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <detail.icon className={`w-6 h-6 ${detail.color}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{detail.title}</h4>
                <p className="text-gray-900 font-medium mb-1">{detail.content}</p>
                <p className="text-sm text-gray-600">{detail.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">
          Acciones Rápidas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.a
              key={action.title}
              href={action.href}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              className={`block p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all duration-300 hover:scale-105 text-center`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <action.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{action.title}</h4>
                  <p className="text-xs opacity-90 leading-tight">{action.description}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

    </div>
  )
}

export default ContactInfo
