'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react'

const ContactHero = () => {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom section-padding relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-6 py-3 rounded-full text-sm font-medium mb-8"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Estamos Aquí para Ayudarte</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight"
          >
            Contacta con Nosotros
            <span className="gradient-text block">Estamos a tu Disposición</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
          >
            ¿Tienes alguna pregunta sobre nuestros servicios? ¿Quieres agendar una consulta? 
            No dudes en contactarnos. Estaremos encantadas de ayudarte y resolver todas tus dudas.
          </motion.p>

          {/* Quick Contact Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <a 
              href="tel:+50761601403"
              className="flex items-center justify-center space-x-3 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <Phone className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Llamar</div>
                <div className="text-sm text-gray-600">+507 6160 1403</div>
              </div>
            </a>

            <a 
              href="https://wa.me/50761601403"
              className="flex items-center justify-center space-x-3 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">WhatsApp</div>
                <div className="text-sm text-gray-600">Mensaje rápido</div>
              </div>
            </a>

            <a 
              href="mailto:info@saracarryhau.com"
              className="flex items-center justify-center space-x-3 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
                <Mail className="w-6 h-6 text-secondary-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Email</div>
                <div className="text-sm text-gray-600">Consulta detallada</div>
              </div>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactHero
