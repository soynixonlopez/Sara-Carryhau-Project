'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  GraduationCap, 
  Award, 
  Shield, 
  BookOpen
} from 'lucide-react'

const AboutCredentials = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const credentials = [
    {
      icon: GraduationCap,
      title: 'Cosmetóloga Certificada',
      description: 'Formación especializada en técnicas de cosmetología, tratamientos faciales y cuidado de la piel.',
      year: '2017',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Award,
      title: 'Esteticista Profesional',
      description: 'Certificación en estética avanzada, incluyendo depilación, masajes y tratamientos corporales.',
      year: '2018',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Shield,
      title: 'Enfermera Colegiada',
      description: 'Titulación oficial en enfermería, proporcionando una base médica sólida para todos los tratamientos.',
      year: '2019',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BookOpen,
      title: 'Especialista en Micropigmentación',
      description: 'Formación especializada en técnicas de micropigmentación para labios, cejas y corrección de cicatrices.',
      year: '2022',
      color: 'from-green-500 to-teal-500'
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
            Credenciales y Formación
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una formación integral que combina conocimientos técnicos, médicos y estéticos 
            para ofrecerte los mejores tratamientos
          </p>
        </motion.div>

        {/* Main Credentials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {credentials.map((credential, index) => (
            <motion.div
              key={credential.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center card-hover h-full">
                <div className={`w-16 h-16 bg-gradient-to-br ${credential.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <credential.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-gray-900 mb-2">
                  {credential.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {credential.description}
                </p>
                <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
                  {credential.year}
                </span>
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  )
}

export default AboutCredentials
