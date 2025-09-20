'use client'

import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const FAQ = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: '¿Qué servicios ofrecen?',
      answer: 'Ofrecemos una amplia gama de servicios estéticos incluyendo faciales, depilación, masajes, cauterizaciones, laminado de cejas, micropigmentación y más. Todos nuestros tratamientos son realizados por Sara Carryhau, cosmetóloga, esteticista y enfermera certificada.'
    },
    {
      question: '¿Cómo puedo reservar una cita?',
      answer: 'Puedes reservar tu cita de varias formas: a través de nuestro sistema online en la página de reservas, llamando al +34 123 456 789, o enviando un mensaje por WhatsApp. Te recomendamos reservar con anticipación para asegurar tu horario preferido.'
    },
    {
      question: '¿Cuánto duran los tratamientos?',
      answer: 'La duración varía según el tratamiento: faciales (60-90 min), depilación (30-60 min), masajes (60-120 min), laminado de cejas (90-120 min), micropigmentación (120-180 min), y cauterizaciones (30-45 min). Siempre te informaremos del tiempo estimado al reservar.'
    },
    {
      question: '¿Qué incluye el precio de los tratamientos?',
      answer: 'Todos nuestros precios incluyen la consulta inicial, el tratamiento completo, productos de calidad profesional, cuidados post-tratamiento y consejos personalizados. No hay costes ocultos ni sorpresas en la factura.'
    },
    {
      question: '¿Necesito prepararme antes del tratamiento?',
      answer: 'Dependiendo del tratamiento, te daremos instrucciones específicas. En general, recomendamos no usar maquillaje en faciales, evitar la exposición solar antes de depilación, y no usar cremas hidratantes antes de masajes. Te enviaremos las instrucciones detalladas al confirmar tu cita.'
    },
    {
      question: '¿Los tratamientos son seguros?',
      answer: 'Absolutamente. Sara es cosmetóloga, esteticista y enfermera certificada con más de 8 años de experiencia. Utilizamos productos de alta calidad, técnicas seguras y seguimos todos los protocolos de higiene y seguridad. Además, realizamos una evaluación previa para asegurar que el tratamiento es adecuado para ti.'
    },
    {
      question: '¿Ofrecen garantías en los resultados?',
      answer: 'Nos comprometemos a ofrecer tratamientos de la más alta calidad. Si no estás completamente satisfecha con los resultados, trabajaremos contigo para encontrar la mejor solución. La satisfacción de nuestras clientes es nuestra prioridad.'
    },
    {
      question: '¿Puedo cancelar o reprogramar mi cita?',
      answer: 'Sí, puedes cancelar o reprogramar tu cita con al menos 24 horas de anticipación sin coste alguno. Para cambios de última hora, te pedimos que nos contactes lo antes posible para que podamos ofrecer tu horario a otra cliente.'
    },
    {
      question: '¿Aceptan métodos de pago?',
      answer: 'Aceptamos efectivo, tarjeta de crédito/débito, transferencia bancaria y pago móvil. También ofrecemos la posibilidad de pagar en varias cuotas para tratamientos de mayor valor. Consulta las opciones disponibles al reservar.'
    },
    {
      question: '¿Dónde se encuentra el centro?',
      answer: 'Nuestro centro está ubicado en Mini Mall Cangrejo, local 03, Pretty Supply. Te enviaremos la dirección exacta y las indicaciones de cómo llegar al confirmar tu cita. También tenemos parking disponible para tu comodidad.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

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
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Resolvemos las dudas más comunes sobre nuestros servicios y tratamientos
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-gray-50 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <Minus className="w-6 h-6 text-primary-600" />
                    ) : (
                      <Plus className="w-6 h-6 text-primary-600" />
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-primary-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              ¿Tienes Otras Preguntas?
            </h3>
            <p className="text-gray-600 mb-6">
              Si no encuentras la respuesta que buscas, no dudes en contactarnos. 
              Estaremos encantadas de ayudarte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+50761601403" className="btn-primary">
                Llamar Ahora
              </a>
              <a href="https://wa.me/50761601403" className="btn-outline">
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ
