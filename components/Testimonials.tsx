'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote } from 'lucide-react'
import { CldImage } from 'next-cloudinary'

const Testimonials = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const testimonials = [
    {
      image: 'acuario-spa/message1',
      alt: 'Testimonio de WhatsApp de Karina',
      clientName: 'Karina'
    },
    {
      image: 'acuario-spa/message2',
      alt: 'Testimonio de WhatsApp de Khistie',
      clientName: 'Khistie'
    },
    {
      image: 'acuario-spa/message1',
      alt: 'Testimonio de WhatsApp de Karina',
      clientName: 'Karina'
    }
  ]

  return (
    <section ref={ref} className="section-padding bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Lo Que Dicen Mis Clientes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Testimonios reales de WhatsApp de clientas satisfechas con los tratamientos de Sara Carryhau
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
                <div className="relative">
                  <CldImage
                    src={testimonial.image}
                    alt={testimonial.alt}
                    width={400}
                    height={600}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    quality="auto"
                    format="auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Client Name Label */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                      <p className="text-sm font-semibold text-gray-900 text-center">
                        {testimonial.clientName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overall Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">4.9/5</h3>
            <p className="text-gray-600 mb-4">Valoración promedio basada en +500 clientas satisfechas</p>
            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <span>WhatsApp</span>
              <span>•</span>
              <span>Recomendaciones</span>
              <span>•</span>
              <span>Clientas Fieles</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
