/**
 * Configuración pública del sitio (email, teléfono, etc.).
 * Usar variables de entorno para no hardcodear datos sensibles.
 */
const env =
  typeof process !== 'undefined' && process.env ? process.env : ({} as NodeJS.ProcessEnv)

export const siteConfig = {
  /** Email de contacto / FormSubmit (NEXT_PUBLIC para uso en cliente) */
  contactEmail:
    (env.NEXT_PUBLIC_CONTACT_EMAIL as string) || 'sarathc@gmail.com',

  /** Número de WhatsApp sin + ni espacios (ej: 50761601403) */
  whatsappNumber:
    (env.NEXT_PUBLIC_WHATSAPP_NUMBER as string) || '50761601403',

  /** Dirección breve para mostrar */
  address: (env.NEXT_PUBLIC_SITE_ADDRESS as string) || 'Mini Mall Cangrejo, local 03',

  /** Descripción de ubicación (ej: "Pretty Supply") */
  addressDescription: (env.NEXT_PUBLIC_SITE_ADDRESS_DESC as string) || 'Pretty Supply',

  /** Horarios de atención */
  schedule: {
    week: (env.NEXT_PUBLIC_SCHEDULE_WEEK as string) || 'Lun-Vie: 9:00-19:00',
    saturday: (env.NEXT_PUBLIC_SCHEDULE_SAT as string) || 'Sáb: 9:00-15:00',
    sunday: (env.NEXT_PUBLIC_SCHEDULE_SUN as string) || 'Dom: Cerrado',
  },
} as const
