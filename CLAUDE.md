# CLAUDE.md — Ecommerce Next DeepAgent

Guía de referencia rápida para Claude Code al trabajar en este proyecto.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript (strict mode) |
| Estilos | Tailwind CSS 4 + shadcn/ui + Radix UI |
| Base de datos | PostgreSQL + Prisma 6 |
| Auth | NextAuth.js 4 (JWT, Credentials) |
| Pagos | Stripe (checkout sessions + webhooks) |
| Imágenes | Cloudinary (principal) / AWS S3 (presigned URLs) |
| Estado global | Zustand (carrito guest) + Jotai |
| Data fetching | TanStack React Query + SWR |
| Animaciones | Framer Motion |
| Package manager | Yarn |

---

## Estructura del proyecto

```
app/                    # Rutas Next.js (App Router)
  admin/                # Dashboard de administración
  api/                  # API routes (REST)
  cart/                 # Página del carrito
  checkout/             # Flujo de pago
  contacto/             # Página de contacto
  login/ signup/        # Autenticación
  orders/               # Historial de pedidos
  products/             # Catálogo y detalle de producto
components/
  ui/                   # Componentes shadcn/ui (no modificar directamente)
  admin-sidebar.tsx
  header.tsx / footer.tsx
  product-card.tsx
  providers.tsx         # Contextos globales (Query, Auth, Theme, Toast)
lib/
  auth-options.ts       # Configuración NextAuth
  db.ts                 # Prisma client singleton
  cloudinary.ts         # Upload de imágenes
  s3.ts / aws-config.ts # Almacenamiento S3
  utils.ts / types.ts
prisma/
  schema.prisma         # Fuente de verdad del modelo de datos
  migrations/           # Historial de migraciones
store/
  cart-store.ts         # Zustand – carrito de usuarios no autenticados
scripts/
  seed.ts               # Seed de categorías, productos y admin
```

---

## Modelos de base de datos (Prisma)

| Modelo | Descripción |
|---|---|
| `User` | Clientes y admins. Roles: `CUSTOMER` / `ADMIN` |
| `Account` / `Session` | Integración NextAuth (OAuth + JWT) |
| `Category` | Categorías de productos con slug |
| `Product` | Nombre, precio, stock, imágenes (array), categoría |
| `CartItem` | Carrito persistente por usuario (unique user+product) |
| `Order` / `OrderItem` | Pedidos con estado y pago Stripe |

**Enums:** `Role { CUSTOMER ADMIN }` · `OrderStatus { PENDING PROCESSING SHIPPED DELIVERED CANCELLED }`

---

## API Routes clave

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/auth/[...nextauth]` | ALL | Autenticación NextAuth |
| `/api/signup` | POST | Registro de usuario |
| `/api/products` | GET / POST | Listar / crear productos |
| `/api/products/[id]` | GET / PUT / DELETE | Gestión de producto |
| `/api/categories` | GET / POST | Categorías |
| `/api/cart` | POST / PUT / DELETE | Carrito autenticado |
| `/api/orders` | GET / POST | Pedidos del usuario |
| `/api/create-checkout-session` | POST | Crear sesión Stripe |
| `/api/webhooks/stripe` | POST | Fulfillment de pedidos |
| `/api/admin/stats` | GET | Estadísticas del dashboard |
| `/api/upload/cloudinary` | POST | Upload de imágenes |
| `/api/upload/presigned` | POST | URL presignada S3 |

---

## Variables de entorno requeridas

```env
# Base de datos
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# AWS S3 (opcional)
AWS_PROFILE=
AWS_REGION=
AWS_BUCKET_NAME=
AWS_FOLDER_PREFIX=
```

---

## Comandos frecuentes

```bash
yarn dev                        # Servidor de desarrollo
yarn build && yarn start        # Build de producción

yarn prisma generate            # Regenerar cliente Prisma tras cambios en schema
yarn prisma migrate dev         # Aplicar migraciones en desarrollo
yarn prisma db seed             # Poblar BD (categorías, productos, admin)
yarn prisma studio              # GUI visual de la BD

# Stripe webhooks en local
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Usuario admin del seed:** `john@doe.com` / `johndoe123`

---

## Convenciones y patrones del proyecto

### Autenticación y autorización
- Rutas admin verifican `session.user.role === "ADMIN"`, devuelven 401 si no cumple.
- Las rutas de pago requieren sesión activa.
- NextAuth usa estrategia JWT; `role` e `id` se incluyen en el token.

### Componentes UI
- Los componentes de `components/ui/` son de shadcn/ui — no modificarlos manualmente. Para agregar uno nuevo: `npx shadcn@latest add <componente>`.
- Usar `clsx` + `tailwind-merge` (via `cn()` en `lib/utils.ts`) para componer clases Tailwind.

### Rutas dinámicas
- Las rutas que necesitan datos en tiempo real usan `export const dynamic = "force-dynamic"`.

### Imágenes de productos
- Las imágenes se almacenan como array de URLs en `Product.images`.
- El flujo preferido es Cloudinary; S3 presigned URLs es alternativa.

### Estado del carrito
- Usuario autenticado: carrito en BD vía `/api/cart`.
- Usuario guest: carrito en Zustand con persistencia en `localStorage` (`store/cart-store.ts`).

### Idioma
- El proyecto está en español. Textos de UI, mensajes de error y metadatos van en español.
- El campo `lang` del HTML root es `"es"`.

### Formularios
- Preferir **React Hook Form** + **Zod** para validación.
- Formik/Yup existe como legado; no agregar nuevos formularios con esa combinación.

---

## Áreas pendientes / en desarrollo

> Actualizar esta sección conforme avance el proyecto.

- [ ] Implementar paginación en el catálogo de productos
- [ ] Panel de admin: gestión de pedidos con cambio de estado
- [ ] Panel de admin: gestión de usuarios
- [ ] Filtros avanzados en catálogo (precio, rating, etc.)
- [ ] Integración de reseñas/ratings de productos
- [ ] Emails transaccionales (confirmación de pedido, envío)
- [ ] Optimizar SEO con metadata dinámica por producto/categoría
- [ ] Tests unitarios y de integración

---

## Notas importantes

- **No** commitear `.env` ni credenciales al repositorio.
- Siempre correr `yarn prisma generate` después de modificar `schema.prisma`.
- Para cambios de schema, crear una migración con `yarn prisma migrate dev --name descripcion-del-cambio`.
- El proyecto usa `strict: true` en TypeScript — evitar `any` y asegurar tipado correcto.
- Tailwind CSS v4 — la configuración va en `postcss.config.js`, no en `tailwind.config.js`.
