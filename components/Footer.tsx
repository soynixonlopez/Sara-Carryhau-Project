'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react'
import { CldImage } from 'next-cloudinary'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const services = [
    { name: 'Faciales', href: '/servicios#faciales' },
    { name: 'Depilación', href: '/servicios#depilacion' },
    { name: 'Masajes', href: '/servicios#masajes' },
    { name: 'Cauterizaciones', href: '/servicios#cauterizaciones' },
    { name: 'Laminado de Cejas', href: '/servicios#laminado' },
    { name: 'Micropigmentación', href: '/servicios#micropigmentacion' },
  ]

  const quickLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Sobre Sara', href: '/sobre-sara' },
    { name: 'Reservar Cita', href: '/reservar' },
    { name: 'Contacto', href: '/contacto' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información de Contacto */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-40 h-24 rounded-lg overflow-hidden">
                <CldImage
                  src="acuario-spa/logosara"
                  alt="Sara Carryhau Logo"
                  width={160}
                  height={96}
                  className="w-full h-full object-contain"
                  quality="auto"
                  format="auto"
                />
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Cosmetóloga, esteticista y enfermera certificada con años de experiencia 
              en tratamientos estéticos integrales de alta calidad.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/acuario_spa_04" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
                title="Síguenos en Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/acuario_spa_04" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                title="Síguenos en Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@acuario_spa_04" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-black transition-colors"
                title="Síguenos en TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    href={service.href}
                    className="text-gray-300 hover:text-primary-400 text-sm transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Información de Contacto */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">+507 6160 1403</p>
                  <p className="text-gray-400 text-xs">Llamadas y WhatsApp</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">sarathc@gmail.com</p>
                  <p className="text-gray-400 text-xs">Consultas generales</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm">Mini Mall Cangrejo, local 03</p>
                    <p className="text-gray-400 text-xs">Pretty Supply</p>
                  </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Lun - Vie: 9:00 - 19:00</p>
                  <p className="text-gray-400 text-xs">Sáb: 9:00 - 15:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Sitio web desarrollado por nixondev | Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/politica-privacidad" className="text-gray-400 hover:text-primary-400 transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terminos-condiciones" className="text-gray-400 hover:text-primary-400 transition-colors">
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
