'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Scissors, Hand, Zap, Eye, Palette, Star } from 'lucide-react'
import { CldImage } from 'next-cloudinary'

const ServicesPreview = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const services = [
    {
      icon: Sparkles,
      title: 'Faciales',
      description: 'Tratamientos faciales desde limpieza básica hasta regeneración avanzada',
      image: 'facialsara_gkr4sq',
      color: 'from-pink-500 to-rose-500',
      link: '/servicios#faciales'
    },
    {
      icon: Palette,
      title: 'Micropigmentación',
      description: 'Técnicas avanzadas para labios y cejas con efecto natural',
      image: 'microsara_ggs7es',
      color: 'from-red-500 to-pink-500',
      link: '/servicios#micropigmentacion'
    },
    {
      icon: Star,
      title: 'Pestañas Pelo a Pelo',
      description: 'Extensiones de pestañas con diferentes efectos y volúmenes',
      image: 'peloapelosara_qkja8e',
      color: 'from-indigo-500 to-purple-500',
      link: '/servicios#pestanas'
    }
  ]

  return (
    <section ref={ref} className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Mis Servicios
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre los tratamientos estéticos especializados de Sara Carryhau, 
            diseñados para realzar tu belleza natural con técnicas profesionales
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
                <div className="relative h-40 overflow-hidden">
                  <CldImage
                    src={service.image}
                    alt={service.title}
                    fill
                    className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                      service.title === 'Pestañas Pelo a Pelo' 
                        ? 'object-top' 
                        : 'object-center'
                    }`}
                    quality="auto"
                    format="auto"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-20`} />
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <Link
                    href={service.link}
                    className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      const targetId = service.link.split('#')[1]
                      const targetElement = document.getElementById(targetId)
                      if (targetElement) {
                        targetElement.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        })
                      } else {
                        window.location.href = service.link
                      }
                    }}
                  >
                    <span>Saber más</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/servicios" className="btn-primary inline-flex items-center space-x-2">
            <span>Ver Todos los Servicios</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesPreview
