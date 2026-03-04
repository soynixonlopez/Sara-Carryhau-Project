'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, MapPin, Clock } from 'lucide-react'
import { CldImage } from 'next-cloudinary'
import { siteConfig } from '@/lib/config'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Sobre Sara', href: '/sobre-sara' },
    { name: 'Contacto', href: '/contacto' },
  ]

  return (
    <>
      {/* Barra superior: altura fija en una línea; safe-area para notch en móviles */}
      <div className="fixed top-0 left-0 right-0 z-[60] min-h-10 bg-primary-600 text-white border-b border-primary-500/30 shadow-sm pt-[env(safe-area-inset-top,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">
        <div className="container-custom px-3 sm:px-6 lg:px-8 h-10">
          <div className="flex flex-row flex-nowrap justify-between items-center h-full text-[11px] sm:text-xs md:text-sm gap-2 min-w-0">
            <div className="flex flex-nowrap items-center gap-2 sm:gap-4 min-w-0 flex-1 overflow-hidden">
              <a
                href={mounted ? `tel:+${siteConfig.whatsappNumber.replace(/\s/g, '')}` : '#'}
                className="flex items-center gap-1 sm:gap-1.5 hover:text-white/90 transition-colors shrink-0"
              >
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span suppressHydrationWarning className="truncate">{mounted ? `+${siteConfig.whatsappNumber.replace(/\s/g, '')}` : '\u00A0'}</span>
              </a>
              <span className="hidden sm:inline text-primary-300 shrink-0">|</span>
              <span className="hidden md:flex items-center gap-1.5 shrink-0 min-w-0">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span suppressHydrationWarning className="truncate max-w-[120px] lg:max-w-[180px]">{mounted ? siteConfig.address : '\u00A0'}</span>
              </span>
            </div>
            <span className="flex items-center gap-1 sm:gap-1.5 text-primary-100 shrink-0 min-w-0 max-w-[50%] overflow-hidden">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span suppressHydrationWarning className="truncate">{mounted ? `${siteConfig.schedule.week} · ${siteConfig.schedule.saturday}` : '\u00A0'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Header principal: justo debajo de la barra (2.5rem + safe-area) */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-white shadow-sm'
        }`}
        style={{ top: 'calc(2.5rem + env(safe-area-inset-top, 0px))' }}
      >
        <div className="container-custom px-3 sm:px-6 lg:px-8 w-full min-w-0">
          <div className="flex justify-between items-center py-2 sm:py-2.5 lg:py-3 gap-2 min-w-0">
            {/* Logo: se reduce en móvil para no tapar el menú */}
            <Link href="/" className="flex items-center shrink-0 min-w-0 max-w-[60%] sm:max-w-none">
              <div className="h-8 sm:h-10 lg:h-12 flex items-center">
                <CldImage
                  src="acuario-spa/logosara"
                  alt="Sara Carryhau Logo"
                  width={160}
                  height={96}
                  className="h-full w-auto object-contain object-center"
                  quality="auto"
                  format="auto"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 shrink-0">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block shrink-0">
              <Link href="/reservar" className="btn-primary text-sm xl:text-base">
                Reservar Cita
              </Link>
            </div>

            {/* Botón menú móvil/tablet: siempre visible y con área táctil suficiente */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden shrink-0 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-100 touch-manipulation"
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

      </header>

      {/* Mobile Sidebar - Fuera del header para mantener fondo sólido */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Sidebar: empieza debajo del header (barra + nav) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 w-80 bg-white shadow-2xl z-50 lg:hidden rounded-tl-xl"
              style={{
                top: 'calc(5.5rem + env(safe-area-inset-top, 0px))',
                height: 'calc(100vh - 5.5rem - env(safe-area-inset-top, 0px))',
              }}
            >
              {/* Sin header interno: se cierra con la X del header principal o tocando fuera */}
              <div className="flex flex-col h-full">
                <nav className="flex-1 px-6 pt-6 pb-6 overflow-y-auto">
                  <div className="space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    
                    {/* Reservar Cita como último menú con estilo de botón */}
                    <Link
                      href="/reservar"
                      className="flex items-center px-4 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-lg font-medium transition-all duration-200 mt-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Reservar Cita
                    </Link>
                  </div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer: barra + header + margen extra para separar el contenido del header */}
      <div
        className="w-full"
        style={{ height: 'calc(7rem + env(safe-area-inset-top, 0px))' }}
        aria-hidden
      />
    </>
  )
}

export default Header
