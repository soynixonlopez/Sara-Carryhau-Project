'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Users, Award, Star, Heart } from 'lucide-react'

const Stats = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const stats = [
    {
      icon: Users,
      number: 500,
      suffix: '+',
      label: 'Clientes Satisfechos',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    },
    {
      icon: Award,
      number: 8,
      suffix: '+',
      label: 'Años de Experiencia',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100'
    },
    {
      icon: Star,
      number: 4.9,
      suffix: '/5',
      label: 'Valoración Promedio',
      color: 'text-accent-600',
      bgColor: 'bg-accent-100'
    },
    {
      icon: Heart,
      number: 15,
      suffix: '+',
      label: 'Tratamientos Disponibles',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  ]

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2"
              >
                {stat.number}{stat.suffix}
              </motion.div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
