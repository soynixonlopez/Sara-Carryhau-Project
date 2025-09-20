'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Heart, Target, Users, Award } from 'lucide-react'
import { CldImage } from 'next-cloudinary'

const AboutStory = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const milestones = [
    {
      year: '2015',
      title: 'Inicio de la Formación',
      description: 'Comienzo de mis estudios en cosmetología y estética, descubriendo mi pasión por la belleza natural y el cuidado de la piel.',
      icon: Heart
    },
    {
      year: '2017',
      title: 'Primera Certificación',
      description: 'Obtuve mi certificación como cosmetóloga profesional, especializándome en tratamientos faciales y técnicas de rejuvenecimiento.',
      icon: Award
    },
    {
      year: '2019',
      title: 'Formación en Enfermería',
      description: 'Completé mis estudios de enfermería, lo que me permitió integrar conocimientos médicos en mis tratamientos estéticos.',
      icon: Target
    },
    {
      year: '2020',
      title: 'Apertura del Centro',
      description: 'Inauguré mi propio centro de estética, ofreciendo tratamientos integrales con un enfoque personalizado y profesional.',
      icon: Users
    },
    {
      year: '2023',
      title: 'Expansión de Servicios',
      description: 'Incorporé nuevas técnicas como micropigmentación y laminado de cejas, ampliando mi oferta de servicios especializados.',
      icon: Award
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
            Mi Historia
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una trayectoria dedicada a la belleza, el bienestar y la excelencia profesional
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Main Story */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                    Mi Pasión por la Belleza Natural
                  </h3>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                      Mi camino en el mundo de la estética comenzó hace más de 8 años, 
                      cuando descubrí que mi verdadera pasión era ayudar a las personas 
                      a sentirse seguras y radiantes en su propia piel.
                    </p>
                    <p>
                      Como cosmetóloga, esteticista y enfermera, he desarrollado un 
                      enfoque integral que combina conocimientos técnicos avanzados 
                      con un trato personal y empático hacia cada una de mis clientes.
                    </p>
                    <p>
                      Creo firmemente que la belleza no se trata de cambiar quién eres, 
                      sino de realzar lo mejor de ti misma. Cada tratamiento que realizo 
                      está diseñado para celebrar tu belleza natural y potenciar tu 
                      confianza personal.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                    <CldImage
                      src="acuario-spa/saratendiendo"
                      alt="Sara trabajando en su centro"
                      fill
                      className="object-cover object-top"
                      quality="auto"
                      format="auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8 text-center">
              Mi Trayectoria Profesional
            </h3>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-secondary-500"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: -50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                    className="relative flex items-start space-x-6"
                  >
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-16 h-16 bg-white border-4 border-primary-500 rounded-full flex items-center justify-center shadow-lg">
                        <milestone.icon className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-2xl font-bold text-primary-600">{milestone.year}</span>
                        <h4 className="text-xl font-serif font-semibold text-gray-900">
                          {milestone.title}
                        </h4>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutStory
