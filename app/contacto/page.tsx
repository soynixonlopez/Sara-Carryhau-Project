import ContactHero from '@/components/ContactHero'
import ContactInfo from '@/components/ContactInfo'
import ContactForm from '@/components/ContactForm'
import ContactMap from '@/components/ContactMap'

export const metadata = {
  title: 'Contacto - Sara Carryhau Estética | Información y Ubicación',
  description: 'Contacta con Sara Carryhau Estética. Información de contacto, ubicación, horarios y formulario de consulta. Estamos aquí para ayudarte.',
  keywords: 'contacto, Sara Carryhau, estética, ubicación, teléfono, email, horarios, consulta',
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen">
      <ContactHero />
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <ContactForm />
          </div>
          <div>
            <ContactInfo />
          </div>
        </div>
      </div>
      <ContactMap />
    </div>
  )
}
