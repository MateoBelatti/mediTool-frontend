# mediTool — Frontend

Aplicación web de **mediTool** para la gestión de turnos, pacientes, informes y reuniones de profesionales de la salud. Construida con React 19, TypeScript y Vite, con CSS Modules y React Query.

## Scripts

| Comando              | Descripción                                                    |
| -------------------- | -------------------------------------------------------------- |
| `npm run dev`        | Levanta el servidor de desarrollo de Vite                      |
| `npm run build`      | Compila TypeScript y genera el bundle de producción en `dist/` |
| `npm run lint`       | Ejecuta ESLint sobre el proyecto                               |
| `npm run type-check` | Verifica los tipos con TypeScript                              |

## Variables de entorno

La aplicación necesita `VITE_API_URL` con la URL base de la API, incluyendo el sufijo `/api` y usando `https` en producción:

```bash
VITE_API_URL=https://tu-api.up.railway.app/api
```

Vite incrusta esta variable en el bundle al compilar, por lo que si cambia hay que volver a buildear y redeployar. Para desarrollo local, copiá `.env.example` a `.env.development` y ajustá el valor.

## Deploy en Vercel

1. Importá el repositorio en Vercel y seleccioná el framework **Vite**.
2. Configurá el build command `npm run build` y el output directory `dist`.
3. Definí la variable `VITE_API_URL` en el entorno **Production**.
4. El archivo `vercel.json` incluye el rewrite de SPA hacia `/index.html`, necesario para que las rutas del router funcionen al entrar directo o refrescar.
