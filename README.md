# Sara Carryhau Estética - Sitio Web Profesional

Un sitio web moderno y profesional para la estética integral de Sara Carryhau, cosmetóloga, esteticista y enfermera certificada.

## 🚀 Características

- **Diseño Moderno**: Interfaz elegante y profesional con animaciones suaves
- **Responsive**: Optimizado para todos los dispositivos (móvil, tablet, desktop)
- **SEO Optimizado**: Configuración completa para motores de búsqueda
- **Formularios Funcionales**: Sistema de contacto y solicitud de citas
- **Rendimiento**: Carga rápida y optimización de imágenes
- **Accesibilidad**: Cumple con estándares de accesibilidad web a detalle

## 🛠️ Tecnologías Utilizadas

- **Next.js 14**: Framework React con App Routes
- **TypeScript**: Tipado estático para mayor robustez
- **Tailwind CSS**: Framework de CSS utilitario
- **Framer Motion**: Animaciones y transiciones
- **React Hook Form**: Manejo de formularios
- **Lucide React**: Iconografía moderna
- **Date-fns**: Manipulación de fechas
- **Cloudinary**: Optimización de imágenes

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   ├── servicios/         # Página de servicios
│   ├── sobre-sara/        # Página sobre Sara
│   ├── reservar/          # Sistema de solicitud de citas
│   ├── contacto/          # Página de contacto
│   ├── sitemap.ts         # Sitemap XML
│   ├── robots.ts          # Robots.txt
│   └── manifest.ts        # PWA manifest
├── components/            # Componentes reutilizables
│   ├── Header.tsx         # Navegación principal
│   ├── Footer.tsx         # Pie de página
│   ├── Hero.tsx           # Sección hero
│   ├── ServicesPreview.tsx # Vista previa de servicios
│   ├── AboutPreview.tsx   # Vista previa sobre Sara
│   ├── Testimonials.tsx   # Testimonios de clientes
│   ├── CTA.tsx            # Llamadas a la acción
│   ├── Stats.tsx          # Estadísticas
│   ├── ServicesList.tsx   # Lista detallada de servicios
│   ├── Pricing.tsx        # Tarifas y precios
│   ├── FAQ.tsx            # Preguntas frecuentes
│   ├── BookingCalendar.tsx # Calendario de selección de fechas
│   ├── BookingForm.tsx    # Formulario de solicitud de citas
│   ├── BookingInfo.tsx    # Información de reservas
│   ├── ContactForm.tsx    # Formulario de contacto
│   ├── ContactInfo.tsx    # Información de contacto
│   └── ContactMap.tsx     # Mapa de ubicación
├── lib/                   # Utilidades y configuraciones
│   ├── cloudinary.ts      # Configuración de Cloudinary
│   └── animations.ts      # Constantes de animaciones
├── public/                # Archivos estáticos
├── tailwind.config.js     # Configuración de Tailwind
├── next.config.js         # Configuración de Next.js
├── tsconfig.json          # Configuración de TypeScript
└── package.json           # Dependencias del proyecto
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/soynixonlopez/Sara-Carryhau-WebSite.git
   cd Sara-Carryhau-WebSite
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Editar `.env.local` con tus configuraciones:
   ```
   NEXT_PUBLIC_SITE_URL=https://sara-carryhau-estetica.com
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloudinary_cloud_name
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📱 Páginas y Funcionalidades

### 🏠 Página de Inicio
- Hero section atractivo
- Estadísticas de la empresa
- Vista previa de servicios
- Información sobre Sara
- Testimonios de clientes
- Llamadas a la acción

### 🛍️ Servicios
- Lista detallada de todos los tratamientos
- Información de precios
- Preguntas frecuentes
- Formulario de consulta

### 👩‍⚕️ Sobre Sara
- Biografía profesional
- Credenciales y formación
- Valores y filosofía
- Galería de trabajos

### 📅 Sistema de Solicitud de Citas
- Calendario interactivo para selección de fechas
- Formulario de solicitud de cita
- Información de políticas y términos

### 📞 Contacto
- Formulario de contacto
- Información de ubicación
- Mapa interactivo
- Horarios de atención

## 🎨 Personalización

### Colores
Los colores principales se pueden modificar en `tailwind.config.js`:
- **Primary**: Rosa (#ec4899)
- **Secondary**: Azul (#0ea5e9)
- **Accent**: Amarillo (#eab308)

### Contenido
- Editar textos en los componentes correspondientes
- Actualizar imágenes en Cloudinary
- Modificar información de contacto en los componentes

### Servicios
Para agregar o modificar servicios, editar:
- `components/ServicesList.tsx`
- `components/Pricing.tsx`
- `components/ServicesPreview.tsx`

## 📈 SEO y Rendimiento

### Optimizaciones Implementadas
- Meta tags dinámicos
- Sitemap XML automático
- Robots.txt configurado
- Imágenes optimizadas con Cloudinary
- Lazy loading
- Compresión de assets

### Métricas de Rendimiento
- Lighthouse Score: 95+
- Core Web Vitals optimizados
- Tiempo de carga < 3 segundos

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar el repositorio a Vercel
2. Añadir las variables de entorno (ver `.env.example`):
   - **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - **Admin**: `NEXT_PUBLIC_ADMIN_EMAIL` (correo del administrador principal)
   - **Cloudinary** y resto opcionales
3. Desplegar. El panel de administración (`/admin`) requiere login con el email configurado en `NEXT_PUBLIC_ADMIN_EMAIL`.

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto:
- Email: sarathc@gmail.com
- WhatsApp: +507 6160 1403

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado con ❤️ para Sara Carryhau Estética**