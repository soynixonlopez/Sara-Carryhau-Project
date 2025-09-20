import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import WhatsAppButton from '@/components/WhatsAppButton'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://sara-carryhau-estetica.com'),
  title: 'Sara Carryhau - Estética Integral | Cosmetóloga y Esteticista',
  description: 'Estética integral profesional con Sara Carryhau. Servicios de faciales, depilación, masajes, cauterizaciones, laminado de cejas, micropigmentación y más. Cosmetóloga, esteticista y enfermera certificada.',
  keywords: 'estética, faciales, depilación, masajes, cauterizaciones, laminado cejas, micropigmentación, Sara Carryhau, cosmetóloga, esteticista',
  authors: [{ name: 'Sara Carryhau' }],
  creator: 'Sara Carryhau',
  publisher: 'Sara Carryhau Estética',
  robots: 'index, follow',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://sara-carryhau-estetica.com',
    title: 'Sara Carryhau - Estética Integral',
    description: 'Estética integral profesional con servicios de faciales, depilación, masajes y más.',
    siteName: 'Sara Carryhau Estética',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sara Carryhau - Estética Integral',
    description: 'Estética integral profesional con servicios de faciales, depilación, masajes y más.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ec4899',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ScrollToTopButton />
        <WhatsAppButton />
      </body>
    </html>
  )
}
