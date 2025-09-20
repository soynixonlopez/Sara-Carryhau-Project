'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Heart, Shield, Star } from 'lucide-react'

const AboutValues = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const values = [
    {
      icon: Heart,
      title: 'Cuidado Personalizado',
      description: 'Cada cliente es única. Adapto cada tratamiento a las necesidades específicas de tu piel y tus objetivos de belleza.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Shield,
      title: 'Seguridad y Calidad',
      description: 'Utilizo solo productos de la más alta calidad y sigo estrictos protocolos de higiene y seguridad en todos los tratamientos.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Star,
      title: 'Excelencia Profesional',
      description: 'Mi formación como cosmetóloga, esteticista y enfermera me permite ofrecer tratamientos de la máxima calidad profesional.',
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  const philosophy = [
    {
      title: 'Mi Misión',
      content: 'Ayudar a cada cliente a sentirse segura, radiante y cómoda en su propia piel, utilizando técnicas profesionales y un enfoque personalizado que respeta y realza su belleza natural.'
    },
    {
      title: 'Mi Visión',
      content: 'Ser reconocida como la esteticista de referencia en la zona, conocida por la excelencia en el servicio, la innovación en los tratamientos y el compromiso genuino con el bienestar de mis clientes.'
    },
    {
      title: 'Mis Valores',
      content: 'Profesionalidad, honestidad, empatía y dedicación. Creo que la belleza va más allá de lo estético; se trata de bienestar, confianza y autoestima. Cada tratamiento que realizo refleja estos valores fundamentales.'
    }
  ]

  return (
    <section ref={ref} className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Mis Valores y Filosofía
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Los principios que guían mi trabajo y mi compromiso contigo
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="bg-gray-50 rounded-2xl p-8 text-center card-hover h-full">
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 md:p-12"
        >
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8 text-center">
            Mi Filosofía de Trabajo
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {philosophy.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h4 className="text-lg font-serif font-semibold text-gray-900 mb-4 text-center">
                  {item.title}
                </h4>
                <p className="text-gray-600 leading-relaxed text-center">
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Commitment */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              Mi Compromiso Contigo
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Cuando eliges mis servicios, no solo estás contratando un tratamiento estético, 
              estás confiando en mi experiencia, profesionalidad y dedicación para ayudarte 
              a alcanzar tus objetivos de belleza y bienestar.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-primary-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Atención Personalizada</h4>
                <p className="text-sm text-gray-600">Cada tratamiento se adapta a ti</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-secondary-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Máxima Seguridad</h4>
                <p className="text-sm text-gray-600">Protocolos de higiene estrictos</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-accent-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Calidad Garantizada</h4>
                <p className="text-sm text-gray-600">Productos y técnicas de primera</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutValues
