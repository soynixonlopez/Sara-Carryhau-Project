import AboutHero from '@/components/AboutHero'
import AboutStory from '@/components/AboutStory'
import AboutCredentials from '@/components/AboutCredentials'
import AboutValues from '@/components/AboutValues'
import AboutGallery from '@/components/AboutGallery'
import CTA from '@/components/CTA'

export const metadata = {
  title: 'Sobre Sara Carryhau - Cosmetóloga y Esteticista Profesional',
  description: 'Conoce a Sara Carryhau, cosmetóloga, esteticista y enfermera con más de 8 años de experiencia en tratamientos estéticos profesionales. Su pasión por la belleza natural y su formación integral.',
  keywords: 'Sara Carryhau, cosmetóloga, esteticista, enfermera, biografía, experiencia, formación, tratamientos estéticos, profesional',
}

export default function SobreSaraPage() {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <AboutStory />
      <AboutCredentials />
      <AboutValues />
      <AboutGallery />
      <CTA />
    </div>
  )
}
