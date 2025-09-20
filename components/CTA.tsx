'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { Calendar, Phone, MessageCircle, ArrowRight } from 'lucide-react'

const CTA = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const ctaOptions = [
    {
      icon: Calendar,
      title: 'Reservar Cita Online',
      description: 'Agenda tu cita de forma rápida y sencilla',
      href: '/reservar',
      color: 'bg-primary-600 hover:bg-primary-700',
      textColor: 'text-white'
    },
    {
      icon: Phone,
      title: 'Llamar Ahora',
      description: 'Habla directamente con Sara',
      href: 'tel:+50761601403',
      color: 'bg-secondary-600 hover:bg-secondary-700',
      textColor: 'text-white'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Consulta rápida por mensaje',
      href: 'https://wa.me/50761601403',
      color: 'bg-green-600 hover:bg-green-700',
      textColor: 'text-white'
    }
  ]

  return (
    <section ref={ref} className="section-padding bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-serif font-bold mb-6"
          >
            ¿Lista para Transformar tu Belleza?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Reserva tu cita hoy y descubre por qué cientos de clientes confían en Sara 
            para sus tratamientos estéticos. Tu belleza natural te está esperando.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {ctaOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              className="group"
            >
              <Link
                href={option.href}
                className={`${option.color} ${option.textColor} rounded-2xl p-8 text-center block transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-colors">
                  <option.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-3">{option.title}</h3>
                <p className="text-white/80 mb-4">{option.description}</p>
                <div className="inline-flex items-center space-x-2 text-sm font-medium">
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 max-w-7xl mx-auto">
            <h3 className="text-2xl font-serif font-semibold mb-4">
              ¿Por Qué Elegir Sara Carryhau?
            </h3>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-base">
              <div className="flex items-center space-x-3 whitespace-nowrap">
                <div className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0"></div>
                <span>Profesional certificada con +8 años de experiencia</span>
              </div>
              <div className="flex items-center space-x-3 whitespace-nowrap">
                <div className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0"></div>
                <span>Tratamientos personalizados y de alta calidad</span>
              </div>
              <div className="flex items-center space-x-3 whitespace-nowrap">
                <div className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0"></div>
                <span>Resultados naturales y duraderos</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA
