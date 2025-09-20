import ServicesHero from '@/components/ServicesHero'
import ServicesList from '@/components/ServicesList'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'

export const metadata = {
  title: 'Servicios - Sara Carryhau Estética | Tratamientos Profesionales',
  description: 'Descubre todos nuestros servicios estéticos: faciales, depilación, masajes, cauterizaciones, laminado de cejas, micropigmentación y más. Tratamientos profesionales de alta calidad.',
  keywords: 'servicios estéticos, faciales, depilación, masajes, cauterizaciones, laminado cejas, micropigmentación, tratamientos faciales, estética profesional',
}

export default function ServiciosPage() {
  return (
    <div className="min-h-screen">
      <ServicesHero />
      <ServicesList />
      <Pricing />
      <FAQ />
      <CTA />
    </div>
  )
}
