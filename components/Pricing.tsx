'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { Check, Star, ArrowRight } from 'lucide-react'

const Pricing = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const pricingPlans = [
    {
      name: 'Faciales',
      price: 'Desde $30.00',
      duration: '60-120 min',
      description: 'Tratamientos faciales desde limpieza básica hasta regeneración avanzada',
      features: [
        'Limpieza básica desde $30.00',
        'Face + Micro desde $45.00',
        'Super Face desde $80.00',
        'Regeneración desde $100.00',
        'Consulta personalizada'
      ],
      popular: false,
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Pestañas Pelo a Pelo',
      price: 'Desde $35.00',
      duration: '120-180 min',
      description: 'Extensiones de pestañas con diferentes efectos y volúmenes',
      features: [
        'Clásicas desde $35.00',
        'Clásicas 2D seda desde $45.00',
        'Efecto pestañina desde $40.00',
        'Volumen hawaian desde $45.00',
        'Mega volumen desde $50.00'
      ],
      popular: true,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      name: 'Masajes',
      price: 'Desde $25.00',
      duration: '60-120 min',
      description: 'Terapias de relajación y paquetes reductores especializados',
      features: [
        'Relajante completo desde $60.00',
        'Relax candle desde $85.00',
        'Espalda desde $25.00',
        'Terapéutico desde $25.00',
        'Paquete reductor 12 sesiones $200.00'
      ],
      popular: false,
      color: 'from-green-500 to-teal-500'
    },
    {
      name: 'Micropigmentación',
      price: 'Desde $85.00',
      duration: '120-180 min',
      description: 'Técnicas avanzadas para labios y cejas con efecto natural',
      features: [
        'Micro labios desde $85.00',
        'Cejas efecto polvo desde $85.00',
        'Cejas y labios desde $150.00',
        'Retoques desde $60.00',
        'Consulta y diseño personalizado'
      ],
      popular: false,
      color: 'from-red-500 to-pink-500'
    },
    {
      name: 'Laminado y Lifting',
      price: 'Desde $25.00',
      duration: '90-120 min',
      description: 'Laminado de cejas y lifting de pestañas profesional',
      features: [
        'Laminado de cejas desde $25.00',
        'Lifting de pestañas desde $25.00',
        'Combo desde $40.00',
        'Diseño personalizado',
        'Cuidados específicos'
      ],
      popular: false,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Servicios Especializados',
      price: 'Consulta',
      duration: '30-90 min',
      description: 'Tratamientos médicos estéticos especializados',
      features: [
        'Cauterización de verrugas',
        'Sueroterapia',
        'Inyectología',
        'Post operatorio',
        'Aclaramiento de zonas oscuras'
      ],
      popular: false,
      color: 'from-yellow-500 to-orange-500'
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
            Tarifas y Precios
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Precios transparentes y competitivos para todos nuestros servicios. 
            Consulta sin compromiso para obtener un presupuesto personalizado.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span>Más Popular</span>
                  </div>
                </div>
              )}
              
              <div className={`bg-white rounded-2xl shadow-lg overflow-hidden card-hover h-full ${
                plan.popular ? 'ring-2 ring-primary-500' : ''
              }`}>
                <div className={`h-2 bg-gradient-to-r ${plan.color}`} />
                
                <div className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {plan.price}
                    </div>
                    <p className="text-sm text-gray-500">{plan.duration}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/reservar"
                    className={`w-full ${
                      plan.popular 
                        ? 'btn-primary' 
                        : 'btn-outline'
                    } inline-flex items-center justify-center space-x-2`}
                  >
                    <span>Reservar Ahora</span>
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
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              ¿Necesitas un Presupuesto Personalizado?
            </h3>
            <p className="text-gray-600 mb-6">
              Cada tratamiento se adapta a tus necesidades específicas. 
              Contacta con nosotros para obtener un presupuesto detallado y personalizado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contacto" className="btn-primary">
                Solicitar Presupuesto
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
