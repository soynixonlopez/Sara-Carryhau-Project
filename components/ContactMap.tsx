'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { MapPin, Navigation, Car } from 'lucide-react'

const ContactMap = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const locationInfo = [
    {
      icon: MapPin,
      title: 'Dirección',
      content: 'Mini Mall El Cangrejo, local 03\nPretty Supply\nPanamá',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    },
    {
      icon: Navigation,
      title: 'Cómo Llegar',
      content: 'Fácil acceso en transporte público\nParada de autobús a 2 minutos\nEstación de metro cercana',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100'
    },
    {
      icon: Car,
      title: 'Parking',
      content: 'Parking gratuito disponible\nPlazas reservadas para clientes\nAcceso para personas con movilidad reducida',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ]

  return (
    <section ref={ref} className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Nuestra Ubicación
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encuéntranos fácilmente en el corazón de la ciudad. 
            Un espacio diseñado para tu comodidad y bienestar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative h-[600px]"
          >
            <div className="h-full rounded-2xl overflow-hidden shadow-2xl">
              {/* Google Maps Embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.123456789!2d-79.123456789!3d9.123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMini%20Mall%20El%20Cangrejo%2C%20Pretty%20Supply!5e0!3m2!1ses!2spa!4v1234567890123!5m2!1ses!2spa"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Sara Carryhau Estética - Mini Mall El Cangrejo, Pretty Supply"
                className="rounded-2xl"
              ></iframe>
            </div>
            
            {/* Map overlay info */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">Abierto ahora</span>
              </div>
            </div>
          </motion.div>

          {/* Location Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col justify-center space-y-6"
          >
            {locationInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${info.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <info.icon className={`w-6 h-6 ${info.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-gray-900 mb-2">
                      {info.title}
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                      {info.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}

export default ContactMap
