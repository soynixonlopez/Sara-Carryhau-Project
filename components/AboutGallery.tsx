'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { CldImage } from 'next-cloudinary'

const AboutGallery = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const galleryImages = [
    {
      src: 'acuario-spa/place1',
      alt: 'Espacio de trabajo 1'
    },
    {
      src: 'acuario-spa/place2',
      alt: 'Espacio de trabajo 2'
    },
    {
      src: 'acuario-spa/place3',
      alt: 'Espacio de trabajo 3'
    },
    {
      src: 'acuario-spa/place4',
      alt: 'Espacio de trabajo 4'
    },
    {
      src: 'acuario-spa/place5',
      alt: 'Espacio de trabajo 5'
    },
    {
      src: 'acuario-spa/place6',
      alt: 'Espacio de trabajo 6'
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
            Nuestro Espacio de Trabajo
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un ambiente profesional, relajante y diseñado para tu comodidad y bienestar
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                <CldImage
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  quality="auto"
                  format="auto"
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default AboutGallery
