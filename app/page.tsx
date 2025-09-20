import Hero from '@/components/Hero'
import ServicesPreview from '@/components/ServicesPreview'
import AboutPreview from '@/components/AboutPreview'
import Testimonials from '@/components/Testimonials'
import CTA from '@/components/CTA'
import Stats from '@/components/Stats'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Stats />
      <ServicesPreview />
      <AboutPreview />
      <Testimonials />
      <CTA />
    </div>
  )
}
