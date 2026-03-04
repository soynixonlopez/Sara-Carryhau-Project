import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sara Carryhau Estética',
    short_name: 'Sara Carryhau',
    description: 'Estética integral profesional con Sara Carryhau. Servicios de faciales, depilación, masajes, cauterizaciones, laminado de cejas, micropigmentación y más.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ec4899',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
