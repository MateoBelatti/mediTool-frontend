import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from '@/app/layouts/MainLayout'
import { LoginPage } from '@/pages/LoginPage/LoginPage'
import { ROLES } from '@/features/auth/hooks/useAuth'

import { ProtectedRoute } from './ProtectedRoute'

const HomePage = lazy(() =>
  import('@/pages/dashboard/HomePage').then((m) => ({ default: m.HomePage }))
)
const PacientesPage = lazy(() =>
  import('@/pages/pacientesPage/PacientesPage').then((m) => ({
    default: m.PacientesPage,
  }))
)
const PacienteProfilePage = lazy(() =>
  import('@/pages/pacienteProfilePage/PacienteProfilePage').then((m) => ({
    default: m.PacienteProfilePage,
  }))
)
const ProfesionalesPage = lazy(() =>
  import('@/pages/ProfesionalesPage/ProfesionalesPage').then((m) => ({
    default: m.ProfesionalesPage,
  }))
)
const TurnosPage = lazy(() =>
  import('@/pages/TurnosPage/TurnosPage').then((m) => ({
    default: m.TurnosPage,
  }))
)
const TurnoFijoProfilePage = lazy(() =>
  import('@/pages/TurnoFijoProfilePage/TurnoFijoProfilePage').then((m) => ({
    default: m.TurnoFijoProfilePage,
  }))
)
const AsistenciasPage = lazy(() =>
  import('@/pages/AsistenciasPage/AsistenciasPage').then((m) => ({
    default: m.AsistenciasPage,
  }))
)
const InformesPage = lazy(() =>
  import('@/pages/InformesPage/InformesPage').then((m) => ({
    default: m.InformesPage,
  }))
)
const ReunionesPage = lazy(() =>
  import('@/pages/ReunionesPage/ReunionesPage').then((m) => ({
    default: m.ReunionesPage,
  }))
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage/NotFoundPage').then((m) => ({
    default: m.NotFoundPage,
  }))
)

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'pacientes',
        element: <PacientesPage />,
      },
      {
        path: 'pacientes/:id',
        element: <PacienteProfilePage />,
      },
      {
        path: 'profesionales',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <ProfesionalesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'turnos',
        element: <TurnosPage />,
      },
      {
        path: 'turnos-fijos/:id',
        element: <TurnoFijoProfilePage />,
      },
      {
        path: 'asistencia',
        element: <AsistenciasPage />,
      },
      {
        path: 'informes',
        element: <InformesPage />,
      },
      {
        path: 'reuniones',
        element: <ReunionesPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

export const AppRouter = () => {
  return <RouterProvider router={router} />
}
