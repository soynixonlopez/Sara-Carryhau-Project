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
      <div className="container-custom px-4 sm:px-6 pt-2 pb-12 sm:pt-4">
        <div className="w-full max-w-2xl mx-auto">
          <BookingForm />
        </div>
        <div className="w-full max-w-2xl mx-auto mt-8">
          <BookingInfo />
        </div>
      </div>
    </div>
  )
}
