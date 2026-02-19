import BookingHero from '@/components/BookingHero'
import BookingForm from '@/components/BookingForm'
import BookingInfo from '@/components/BookingInfo'

export const metadata = {
  title: 'Reservar Cita - Sara Carryhau Estética | Agenda tu Tratamiento',
  description: 'Reserva tu cita online: elige día, hora (9am-5pm) y completa tus datos. Tratamientos estéticos con Sara Carryhau.',
  keywords: 'reservar cita, agendar tratamiento, cita online, Sara Carryhau, estética, faciales, depilación, masajes',
}

export default function ReservarPage() {
  return (
    <div className="min-h-screen">
      <BookingHero />
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
            <BookingForm />
          </div>
          <div className="lg:col-span-1">
            <BookingInfo />
          </div>
        </div>
      </div>
    </div>
  )
}
