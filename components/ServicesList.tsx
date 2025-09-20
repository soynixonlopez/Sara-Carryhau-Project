'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { 
  Sparkles, 
  Scissors, 
  Hand, 
  Zap, 
  Eye, 
  Palette, 
  Clock, 
  CheckCircle,
  ArrowRight 
} from 'lucide-react'
import { CldImage } from 'next-cloudinary'

const ServicesList = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const services = [
    {
      id: 'faciales',
      icon: Sparkles,
      title: 'Faciales',
      subtitle: 'Tratamientos faciales especializados',
      description: 'Tratamientos faciales profesionales desde limpieza básica hasta regeneración avanzada. Sara utiliza técnicas especializadas y productos de alta calidad para rejuvenecer, hidratar y mejorar la textura de tu piel.',
      image: 'facialsara_gkr4sq',
      duration: '60-120 min',
      includes: [
        'Limpieza profunda',
        'Exfoliación suave',
        'Mascarilla hidratante',
        'Masaje facial relajante',
        'Consulta personalizada'
      ],
      benefits: [
        'Piel más suave y luminosa',
        'Reducción de imperfecciones',
        'Hidratación profunda',
        'Resultados visibles'
      ],
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'depilacion',
      icon: Scissors,
      title: 'Depilación con Cera',
      subtitle: 'Depilación profesional con cera',
      description: 'Depilación con cera profesional para diferentes zonas del cuerpo. Sara utiliza técnicas especializadas para resultados suaves y duraderos con el máximo cuidado.',
      image: 'depilacionsara_fxa1yp',
      duration: '15-60 min',
      includes: [
        'Consulta previa',
        'Preparación de la zona',
        'Depilación profesional',
        'Cuidados post-tratamiento',
        'Consejos de mantenimiento'
      ],
      benefits: [
        'Piel suave y sin vello',
        'Resultados duraderos',
        'Técnicas profesionales',
        'Cuidado especializado'
      ],
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'masajes',
      icon: Hand,
      title: 'Masajes',
      subtitle: 'Terapias de relajación y bienestar',
      description: 'Masajes terapéuticos diseñados para aliviar tensiones, reducir el estrés y mejorar tu bienestar general. Sara combina diferentes técnicas para ofrecerte la experiencia perfecta.',
      image: 'masajesara_cnceth',
      duration: '60-120 min',
      includes: [
        'Evaluación inicial',
        'Aceites esenciales',
        'Técnicas especializadas',
        'Ambiente relajante',
        'Paquetes reductores disponibles'
      ],
      benefits: [
        'Reducción del estrés',
        'Alivio de tensiones',
        'Mejora de la circulación',
        'Relajación profunda'
      ],
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'cauterizaciones',
      icon: Zap,
      title: 'Servicios Especializados',
      subtitle: 'Tratamientos médicos estéticos',
      description: 'Servicios especializados que incluyen cauterización de verrugas, sueroterapia, inyectología, post operatorio, aclaramiento de zonas oscuras y levantamiento de glúteo. Sara cuenta con la formación médica necesaria.',
      image: 'cauterizacionsara_fsht48',
      duration: '30-90 min',
      includes: [
        'Cauterización de verrugas',
        'Sueroterapia',
        'Inyectología',
        'Post operatorio',
        'Aclaramiento de zonas oscuras'
      ],
      benefits: [
        'Eliminación de imperfecciones',
        'Piel más uniforme',
        'Resultados profesionales',
        'Técnicas médicas seguras'
      ],
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'laminado',
      icon: Eye,
      title: 'Laminado y Lifting',
      subtitle: 'Diseño y laminado profesional',
      description: 'Transforma tus cejas y pestañas con nuestros servicios de laminado y lifting profesional. Sara diseña la forma perfecta para tu rostro y aplica técnicas especializadas para resultados duraderos.',
      image: 'laminadosara_q3bxij',
      duration: '90-120 min',
      includes: [
        'Diseño personalizado',
        'Tinte de cejas',
        'Laminado profesional',
        'Lifting de pestañas',
        'Cuidados específicos'
      ],
      benefits: [
        'Cejas perfectamente definidas',
        'Pestañas más largas y curvadas',
        'Resultados duraderos',
        'Aspecto natural'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'micropigmentacion',
      icon: Palette,
      title: 'Micropigmentación',
      subtitle: 'Técnicas de micropigmentación avanzadas',
      description: 'Micropigmentación profesional para labios y cejas. Sara utiliza pigmentos de alta calidad y técnicas avanzadas para resultados naturales y duraderos que realzan tu belleza.',
      image: 'microsara_ggs7es',
      duration: '120-180 min',
      includes: [
        'Consulta y diseño',
        'Pigmentos de calidad',
        'Técnica especializada',
        'Cuidados post-tratamiento',
        'Sesión de retoque incluida'
      ],
      benefits: [
        'Resultados naturales',
        'Duración prolongada',
        'Diseño personalizado',
        'Técnicas avanzadas'
      ],
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'pestanas',
      icon: Eye,
      title: 'Pestañas Pelo a Pelo',
      subtitle: 'Extensiones de pestañas profesionales',
      description: 'Extensiones de pestañas pelo a pelo con diferentes efectos y volúmenes. Sara utiliza técnicas especializadas para crear el look perfecto que realza tu mirada de forma natural.',
      image: 'peloapelosara_qkja8e',
      duration: '120-180 min',
      includes: [
        'Consulta y diseño',
        'Extensiones pelo a pelo',
        'Diferentes volúmenes',
        'Efectos especiales',
        'Cuidados post-tratamiento'
      ],
      benefits: [
        'Mirada más expresiva',
        'Resultados naturales',
        'Duración prolongada',
        'Técnicas profesionales'
      ],
      color: 'from-indigo-500 to-purple-500'
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
            Tratamientos Especializados
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cada servicio está diseñado para ofrecerte los mejores resultados 
            con la máxima comodidad y profesionalidad
          </p>
        </motion.div>

        <div className="space-y-24">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                      {service.title}
                    </h3>
                    <p className="text-primary-600 font-medium">{service.subtitle}</p>
                  </div>
                </div>

                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="flex items-center space-x-2 mb-6">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600 font-medium">Duración: {service.duration}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Incluye:</h4>
                    <ul className="space-y-2">
                      {service.includes.map((item, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Beneficios:</h4>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-secondary-600 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href="/reservar"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <span>Reservar {service.title}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Image */}
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <div className="relative">
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                    <CldImage
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      quality="auto"
                      format="auto"
                    />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-20 rounded-3xl`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesList
