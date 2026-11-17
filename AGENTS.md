# AGENTS.md — mediTool (frontend)

Frontend de **mediTool**, sistema de gestión de turnos médicos/clínicos. React 19 + TypeScript + Vite, organizado por _features_. Consume la API REST del backend (ASP.NET Core, repo `mediTool`).

El dominio y los textos de interfaz están en **español** (pacientes, turnos, informes, reuniones, asistencia). Los identificadores técnicos (hooks, componentes, servicios) siguen el patrón que ya existe en cada feature. Mantené ese idioma en textos visibles al usuario y mensajes de validación.

---

## Stack

- **React 19**, **TypeScript ~6**, **Vite**
- **react-router-dom 7** (`createBrowserRouter`, en `src/app/router/AppRouter.tsx`)
- **@tanstack/react-query 5** para datos del servidor
- **axios** con un único cliente compartido (`src/shared/api/apiClient.ts`)
- **react-hook-form** + **zod** + `@hookform/resolvers` para formularios
- **CSS Modules** (un `.module.css` por componente) + variables globales en `src/styles/global.css`
- **lucide-react** para íconos, **date-fns** para fechas, **react-calendar**, **jwt-decode**

No hay Tailwind, ni librería de componentes UI, ni store global (Redux/Zustand). No agregues ninguna sin consultarlo.

---

## Comandos

```bash
npm install
npm run dev          # Vite en desarrollo
npm run build        # tsc -b && vite build
npm run type-check   # tsc --noEmit
npm run lint         # eslint .
npm run lint:fix
npm run format       # prettier --write .
```

- No hay framework de tests configurado (sin Vitest/Jest). No inventes comandos de test; si hace falta testear, proponelo antes.
- Hay pre-commit con Husky + lint-staged (`eslint --fix` y `prettier --write` sobre los archivos staged).

**Antes de dar una tarea por terminada:** correr `npm run lint` y `npm run type-check` y reportar el resultado real. Ver "Estado conocido" más abajo: hoy `type-check` no está en verde por errores previos, así que lo que importa es **no sumar errores nuevos** en los archivos que tocás.

---

## Variables de entorno

- `VITE_API_URL` (en `.env.development` / `.env.production`). Validada con zod en `src/app/config/env.ts`.
- La URL ya incluye `/api` (ej. `https://localhost:7058/api`), por eso los servicios usan paths como `/Informe`, `/Turno/{id}`, `/Auth/login` (PascalCase, igual que el nombre del controller del backend).
- Nunca leer ni imprimir el contenido de los `.env` en tus respuestas, y nunca hardcodear URLs ni credenciales.

---

## Estructura de carpetas

```
src/
├── app/
│   ├── config/env.ts            # validación de variables de entorno
│   ├── layouts/MainLayout.tsx   # sidebar + <Outlet />
│   ├── providers/QueryProvider.tsx
│   └── router/AppRouter.tsx     # todas las rutas
├── features/<feature>/
│   ├── components/<Componente>/<Componente>.tsx + .module.css
│   ├── hooks/use<Feature>.ts    # React Query (queries + mutations)
│   ├── services/<feature>.service.ts   # llamadas HTTP con apiClient
│   ├── schemas/<feature>.schema.ts     # zod + tipos inferidos
│   └── types/<feature>.types.ts        # tipos TS (features más viejas)
├── pages/<Nombre>Page/<Nombre>Page.tsx + .module.css
├── shared/
│   ├── api/apiClient.ts         # axios + interceptores (JWT, refresh)
│   └── components/              # Button, Modal, Sidebar (reutilizables)
├── styles/global.css            # tokens de diseño (variables CSS)
├── App.tsx / main.tsx
```

Features actuales: `auth`, `dashboard`, `pacientes`, `turnos`, `turnos-fijos`, `informes`, `reuniones`, `asistencias`.

### Reglas de capas

- **Páginas** (`pages/`): orquestan hooks y componentes de features; sin llamadas HTTP directas.
- **Componentes**: presentación y estado de UI local. No llaman a `apiClient` ni a servicios directamente; usan hooks.
- **Hooks** (`features/*/hooks`): único lugar donde se usa React Query. Exportan un objeto de keys (`INFORMES_KEYS`, `TURNOS_KEYS`) y los hooks `useX`, `useCreateX`, `useUpdateX`, `useDeleteX`.
- **Servicios**: objetos con funciones async que usan `apiClient` y devuelven `response.data` tipado. Sin lógica de UI.
- **Una feature no importa componentes internos de otra feature**, salvo hooks públicos ya usados así (ej. `useAuth`, `usePacientes`). Lo realmente compartido va en `shared/`.
- Imports con alias `@/` (`@/shared/...`, `@/features/...`, `@/app/...`). Dentro de una misma feature se usan imports relativos (`../../hooks/...`).

---

## Convenciones de código

### Componentes

- Componentes funcionales con `export const Nombre = (...) => {}` (export nombrado, no default; `App.tsx` es la excepción).
- Una carpeta por componente: `Componente/Componente.tsx` + `Componente.module.css`.
- Props tipadas con `interface NombreProps`.
- Estilos con `import styles from './X.module.css'` y `className={styles.algo}`. **No** usar estilos inline salvo valores dinámicos puntuales.
- Reutilizar `shared/components/Button` y `shared/components/Modal` antes de crear otro botón o modal.
- Íconos solo de `lucide-react`.

### Estilos y diseño

- Usar las variables de `src/styles/global.css` (`--accent`, `--surface-color`, `--border-color`, `--text-primary`, `--danger`, `--space-*`, `--radius-*`, `--shadow-*`, `--text-*`). **No hardcodear colores, espaciados ni radios** si existe un token equivalente.
- El sistema visual es "Salvia clínica" (verdes apagados sobre fondo cálido). Respetar esa paleta; no introducir colores nuevos sin pedirlo.
- Pensar en responsive: el layout colapsa el sidebar en pantallas <= 768px.

### Datos del servidor (React Query)

- Query keys jerárquicas definidas en un objeto `*_KEYS` dentro del hook.
- Toda mutation invalida `*_KEYS.all` (y el `detail` si corresponde) en `onSuccess`.
- `enabled: !!id` en queries dependientes de un id.
- `staleTime` por defecto es 5 minutos (ver `QueryProvider`); no lo sobreescribas sin motivo.

### Formularios

- `react-hook-form` + `zodResolver` con el schema de la feature.
- Los modales de formulario se llaman `XFormModal` y reciben `isOpen`, `onClose` y opcionalmente el elemento a editar (`xToEdit`).
- Los inputs numéricos o selects que llegan como string se convierten con `Number(...)` antes de enviar al backend.

### TypeScript

- `strict` y `noUnusedLocals`/`noUnusedParameters` activos. **No usar `any`** (la regla de ESLint es `error`).
- `verbatimModuleSyntax` está activo: los tipos se importan con `import type { ... }` o `type` inline (`import { type X, y } from ...`).
- `erasableSyntaxOnly` está activo: **no usar `enum`**; usar objetos `as const` + tipo derivado (`type Estado = (typeof ESTADO)[keyof typeof ESTADO]`).
- No hace falta `import React` para JSX (jsx: react-jsx); importá solo lo que uses (`useState`, `type ReactNode`, etc.).
- Para schemas **nuevos**, definir el schema zod y derivar los tipos con `z.infer` (patrón de `informes`, `turnos`, `reuniones`). No duplicar el mismo tipo en `types/` y en `schemas/`.

### Zod 4

El proyecto usa `zod ^4`. La opción `required_error` **ya no existe**; usar `error` o `message`:

```ts
z.number({ error: 'El profesional es requerido' })
z.string().min(1, 'La fecha es requerida')
```

### Estilo de código (Prettier)

Sin punto y coma, comillas simples, 2 espacios, trailing comma `es5`, LF. No reformatear archivos que no estás modificando.

---

## Autenticación

- El backend devuelve `accessToken` y `refreshToken`. Se guardan en `localStorage` (`token`, `refreshToken`) desde `auth.service.ts`.
- `apiClient` agrega `Authorization: Bearer <token>` y, ante un 401, intenta **una vez** `POST /Auth/refresh`; si falla, limpia el storage y redirige a `/login`.
- `useAuth` decodifica el JWT (`jwt-decode`) para obtener `id`, `email` y `name`.
- El id del usuario autenticado coincide con el `profesionalId` del backend (`parseInt(user.id)`).
- Roles del sistema: **solo `Admin` y `Profesional`**. No existe login de pacientes; no agregar pantallas ni rutas para ese rol.
- No tocar `apiClient.ts`, `auth.service.ts` ni `useAuth.ts` sin pedido explícito.

---

## Contrato con el backend

- El backend es la fuente de verdad. Si hay dudas sobre un endpoint o DTO, leelo en el repo del backend (`Controllers/` y `Utils/DTOs/`) en vez de adivinar.
- Los textos de error del backend vienen como `{ status, code, message, details[] }`; mostrar `message` al usuario.
- El backend guarda fechas en **UTC**; el negocio opera en `America/Argentina/Buenos_Aires`. Al mostrar fechas/horas, convertir a hora local; al enviar, mandar ISO 8601 (`toISOString()`). Las fechas de informes son solo fecha (`yyyy-mm-dd`).
- Los listados de pacientes del backend son **paginados** (`PageResult<T>`: `items`, `page`, `pageSize`, `totalItems`, `totalPages`) con `searchTerm`, `sortBy`, `sortOrder`.
- El estado de un turno viaja como **string** (`Pendiente`, `Presente`, `Cancelado`, `Reprogramado`, `Ausente`).
- La asistencia **ya no es un módulo aparte en el backend**: vive dentro del turno (`PATCH /Turno/{id}/asistencia`, campos `justificada`, `facturable`, `observaciones`, `fechaRegistroAsistencia`).
- Un informe pertenece como máximo a un turno (`turnoId`) y se consulta con `GET /Informe/turno/{turnoId}`.

---

## Estado conocido (verificado sobre el código, octubre 2026)

**Build / calidad**

- `npm run type-check` y `npm run lint` pasan en verde (0 errores). Cualquier error nuevo es responsabilidad de tu cambio: no lo dejes.

**Ya resuelto (no lo rehagas)**

- `ProtectedRoute` existe y envuelve las rutas.
- Notificaciones: `features/notificaciones` + `NotificationBell` implementados.
- La agenda usa `GET /Profesional/{id}/agenda`; asistencia vive dentro de Turno.
- Pacientes paginados (`PageResult<T>`); `/Paciente/vinculados` devuelve solo los pacientes del profesional logueado.
- `usePacientesVinculados` implementado en `features/pacientes/hooks/usePacientes.ts` y consumido en `TurnoFormModal`.
- Hook `useMediaQuery` en `shared/hooks/useMediaQuery.ts`.
- Sidebar y responsive adaptados a 1200px (compacto) y 1201px (escritorio).

**Pendiente / deuda conocida**

- `usePacientes()` dispara siempre `getAll` y `getVinculados`. Para selects de pacientes de un profesional, usar `usePacientesVinculados`, nunca `pacientes` (todos).
- `pageSize` máximo del backend: 100.
- El backend filtra la agenda con `FechaHora >= desde && FechaHora <= hasta`. Una fecha sin hora vale 00:00, así que para "un día entero" enviar `yyyy-MM-ddT00:00:00` y `yyyy-MM-ddT23:59:59` (hora local; el backend asume America/Argentina/Buenos_Aires).
- Nunca calcular "hoy" con `toISOString()` (da UTC). Usar `format(new Date(), 'yyyy-MM-dd')` de date-fns.
- Inconsistencias de nombres de carpetas en `pages/` (`pacientesPage`, `dashboard`).

## Responsive (convención del proyecto)

- **Compacto (teléfono y tablet, vertical y horizontal):** `max-width: 1200px`. El sidebar es siempre un overlay que se superpone al contenido (nunca empuja ni achica el contenido).
- **Escritorio:** `min-width: 1201px`. Sidebar fijo de 260px con el contenido desplazado.
- Para distinguir tablet vertical de horizontal usar `(orientation: portrait)` / `(orientation: landscape)` combinado con el rango de ancho. No usar solo `max-width`.
- No duplicar el número 1200/768 en JS y CSS: en JS usar el hook `useMediaQuery` de `src/shared/hooks/`.
- Estilos solo con tokens de `global.css`; no hardcodear colores.

---

## Cómo trabajar (flujo esperado)

1. **Leer antes de escribir**: mirá una feature vecina completa (componente, hook, service, schema) y copiá su patrón.
2. **Alcance acotado**: modificá solo los archivos necesarios. Si la tarea requiere tocar `shared/`, el router, `apiClient` o varias features, avisá antes.
3. **Contrato primero**: si la tarea consume un endpoint, verificá método, ruta y DTO en el backend antes de escribir el servicio.
4. **Mostrar el diff / listar archivos tocados** antes de cerrar.
5. **Verificar**: `npm run lint` y `npm run type-check`; reportar el resultado real, y distinguir errores nuevos de los preexistentes.
6. **Git**: no hacer commit, push, merge ni cambio de rama sin pedido explícito. Mensajes de commit en español, descriptivos (el repo usa prefijos tipo `refactor:` / `fix:` de forma informal). Ramas: `feature/<nombre>`, `fix/<nombre>`.

---

## Prohibido / pedir confirmación primero

- Agregar dependencias (`npm install <paquete>`) o cambiar versiones.
- Cambiar la lógica de autenticación, el refresh de tokens o dónde se guardan los tokens.
- Crear rutas, pantallas o roles para pacientes/clientes.
- Reintroducir lógica del módulo `Asistencia` como recurso independiente del backend.
- Cambiar el sistema de diseño (paleta, tipografía, tokens de `global.css`) o migrar a otra solución de estilos.
- Desactivar reglas de ESLint o usar `// @ts-ignore` / `any` para "hacer pasar" un error.
- Reformatear o reorganizar archivos que no forman parte de la tarea.

---

## Roadmap (contexto, no implementar sin pedido)

- Informes asociados a turnos (botón "Crear informe" desde el detalle del turno en la agenda) y apartado de PDFs profesionales en el perfil del profesional, visibles para otros profesionales en el perfil del paciente.
- Centro de notificaciones y alertas de asistencia pendiente.
- Recordatorios a pacientes por WhatsApp (lado backend).
- Facturación electrónica AFIP: a futuro.
