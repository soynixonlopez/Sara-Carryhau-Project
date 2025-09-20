import type { Metadata } from 'next'
import { FileText, Scale, AlertTriangle, CheckCircle, Clock, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Términos y Condiciones - Sara Carryhau Estética',
  description: 'Términos y condiciones de uso de los servicios de Sara Carryhau Estética. Conoce nuestras políticas y condiciones.',
  robots: 'index, follow',
}

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container-custom py-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">Términos y Condiciones</h1>
              <p className="text-gray-600">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            
            {/* Introducción */}
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. Introducción</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Bienvenido a Sara Carryhau Estética. Estos Términos y Condiciones rigen el uso de nuestros servicios 
                estéticos y la relación entre usted y Sara Carryhau Estética.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Al utilizar nuestros servicios, usted acepta estar sujeto a estos términos y condiciones.
              </p>
            </section>

            {/* Servicios ofrecidos */}
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Servicios Ofrecidos</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Tratamientos Estéticos</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Tratamientos faciales</li>
                      <li>• Depilación láser</li>
                      <li>• Masajes terapéuticos</li>
                      <li>• Cauterizaciones</li>
                      <li>• Laminado de cejas</li>
                      <li>• Micropigmentación</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Reservas y citas */}
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. Reservas y Citas</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Política de Reservas</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Las citas deben reservarse con al menos 24 horas de antelación</li>
                      <li>• Se requiere confirmación de la cita</li>
                      <li>• Los horarios están sujetos a disponibilidad</li>
                      <li>• Se puede solicitar una cita de urgencia, sujeta a disponibilidad</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Cancelaciones */}
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. Cancelaciones y Reagendamientos</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Política de Cancelación</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Cancelaciones con más de 24 horas: Sin cargo</li>
                      <li>• Cancelaciones con menos de 24 horas: 50% del costo del servicio</li>
                      <li>• No presentarse a la cita: 100% del costo del servicio</li>
                      <li>• Reagendamientos: Gratuitos con 24 horas de antelación</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Precios y pagos */}
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Precios y Formas de Pago</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Scale className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Información de Precios</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Los precios están sujetos a cambios sin previo aviso</li>
                      <li>• Se aceptan pagos en efectivo y tarjeta</li>
                      <li>• Los precios incluyen IVA cuando corresponda</li>
                      <li>• Se pueden ofrecer descuentos por paquetes de tratamientos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Contraindicaciones */}
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Contraindicaciones y Responsabilidades</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Responsabilidades del Cliente</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Informar sobre condiciones médicas, alergias o medicamentos</li>
                      <li>• Seguir las instrucciones post-tratamiento</li>
                      <li>• No exponerse al sol después de ciertos tratamientos</li>
                      <li>• Comunicar cualquier reacción adversa inmediatamente</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Garantías */}
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Garantías y Resultados</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Los resultados de los tratamientos estéticos pueden variar según cada persona. 
                No garantizamos resultados específicos, pero nos comprometemos a:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Utilizar productos y técnicas de calidad profesional</li>
                <li>• Proporcionar un servicio profesional y seguro</li>
                <li>• Realizar seguimiento adecuado de los tratamientos</li>
                <li>• Ofrecer asesoramiento personalizado</li>
              </ul>
            </section>

            {/* Limitación de responsabilidad */}
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. Limitación de Responsabilidad</h2>
              <p className="text-gray-600 leading-relaxed">
                Sara Carryhau Estética no se hace responsable de daños indirectos, incidentales o consecuenciales 
                que puedan resultar del uso de nuestros servicios, excepto en casos de negligencia comprobada.
              </p>
            </section>

            {/* Modificaciones */}
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">9. Modificaciones</h2>
              <p className="text-gray-600 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. 
                Los cambios serán efectivos inmediatamente después de su publicación en nuestro sitio web.
              </p>
            </section>

            {/* Contacto */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">10. Contacto</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Para cualquier consulta sobre estos términos y condiciones, puede contactarnos:
              </p>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-2">
                  <p className="text-gray-900"><strong>Email:</strong> info@saracarryhau.com</p>
                  <p className="text-gray-900"><strong>Teléfono:</strong> +507 6160 1403</p>
                  <p className="text-gray-900"><strong>Dirección:</strong> Mini Mall Cangrejo, local 03, Pretty Supply</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions
