# Configuración Supabase - Panel de reservas

## 1. Crear proyecto en Supabase

1. Entra en [supabase.com](https://supabase.com) y crea un proyecto.
2. En **Settings > API** copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (solo backend)
3. Añade estas variables en `.env.local` en la raíz del proyecto.

## 2. Ejecutar el esquema SQL

1. En el Dashboard de Supabase ve a **SQL Editor**.
2. Abre el archivo `schema.sql` de esta carpeta, copia todo su contenido y pégalo en el editor.
3. Ejecuta la consulta (Run). Se crearán las tablas `attendants` y `reservations` y las políticas RLS.

## 3. Crear usuarios del panel (Sara y asistente)

1. Ve a **Authentication > Users > Add user**.
2. Crea un usuario con el **email** y **contraseña** de Sara (ej: sarathc@gmail.com).
3. Repite para el asistente con otro email y contraseña.
4. Esos usuarios podrán entrar en **tu-sitio.com/admin** con correo y contraseña.

## 4. (Opcional) Tiempo real

Para que el panel se actualice al instante cuando llegue una nueva reserva o se edite una:

1. Ve a **Database > Replication**.
2. Activa la replicación para la tabla **reservations**.

## Rutas

- **Panel de administración:** `/admin` (requiere login).
- **Login:** `/admin/login`.
