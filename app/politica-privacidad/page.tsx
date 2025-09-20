import type { Metadata } from 'next'
import { Shield, Eye, Lock, Database, UserCheck, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Privacidad - Sara Carryhau Estética',
  description: 'Política de privacidad y protección de datos de Sara Carryhau Estética. Conoce cómo protegemos tu información personal.',
  robots: 'index, follow',
}

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container-custom py-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">Política de Privacidad</h1>
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
                En Sara Carryhau Estética, nos comprometemos a proteger la privacidad y seguridad de la información personal 
                de nuestros clientes. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y 
                protegemos su información personal.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política.
              </p>
            </section>

            {/* Información que recopilamos */}
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Información que Recopilamos</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <UserCheck className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Información Personal</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Nombre completo</li>
                      <li>• Número de teléfono</li>
                      <li>• Dirección de correo electrónico</li>
                      <li>• Fecha de nacimiento</li>
                      <li>• Información médica relevante para los tratamientos</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Database className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Información de Tratamientos</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Historial de tratamientos realizados</li>
                      <li>• Preferencias de servicios</li>
                      <li>• Notas de consultas y seguimiento</li>
                      <li>• Fotografías antes y después (con consentimiento)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Cómo utilizamos la información */}
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. Cómo Utilizamos su Información</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Eye className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Finalidades Principales</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Proporcionar servicios estéticos de calidad</li>
                      <li>• Programar y gestionar citas</li>
                      <li>• Realizar seguimiento de tratamientos</li>
                      <li>• Comunicarnos con usted sobre nuestros servicios</li>
                      <li>• Cumplir con obligaciones legales y regulatorias</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Protección de datos */}
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. Protección de sus Datos</h2>
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información 
                    personal contra acceso no autorizado, alteración, divulgación o destrucción.
                  </p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Encriptación de datos sensibles</li>
                    <li>• Acceso restringido a información personal</li>
                    <li>• Formación del personal en protección de datos</li>
                    <li>• Copias de seguridad regulares</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Sus derechos */}
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Sus Derechos</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Usted tiene los siguientes derechos respecto a su información personal:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• <strong>Acceso:</strong> Solicitar una copia de la información que tenemos sobre usted</li>
                <li>• <strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
                <li>• <strong>Eliminación:</strong> Solicitar la eliminación de su información personal</li>
                <li>• <strong>Limitación:</strong> Restringir el procesamiento de su información</li>
                <li>• <strong>Portabilidad:</strong> Recibir su información en un formato estructurado</li>
                <li>• <strong>Oposición:</strong> Oponerse al procesamiento de su información</li>
              </ul>
            </section>

            {/* Contacto */}
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Contacto</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, 
                puede contactarnos:
              </p>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-2">
                  <p className="text-gray-900"><strong>Email:</strong> info@saracarryhau.com</p>
                  <p className="text-gray-900"><strong>Teléfono:</strong> +507 6160 1403</p>
                  <p className="text-gray-900"><strong>Dirección:</strong> Mini Mall Cangrejo, local 03, Pretty Supply</p>
                </div>
              </div>
            </section>

            {/* Cambios en la política */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Cambios en esta Política</h2>
              <p className="text-gray-600 leading-relaxed">
                Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. 
                Los cambios significativos serán notificados a través de nuestro sitio web o por correo electrónico. 
                Le recomendamos revisar esta política periódicamente.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
