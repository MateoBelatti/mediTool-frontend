import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from '@/app/layouts/MainLayout'
import { HomePage } from '@/features/dashboard/pages/HomePage'
import { LoginPage } from '@/dashboard/pages/LoginPage/LoginPage'
import { PacientesPage } from '@/dashboard/pages/pacientesPage/PacientesPage'
import { TurnosPage } from '@/dashboard/pages/TurnosPage/TurnosPage'
import { AsistenciasPage } from '@/dashboard/pages/AsistenciasPage/AsistenciasPage'
import { InformesPage } from '@/dashboard/pages/InformesPage/InformesPage'
import { ReunionesPage } from '@/dashboard/pages/ReunionesPage/ReunionesPage'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
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
        path: 'turnos',
        element: <TurnosPage />,
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
        element: <div>404 - Página no encontrada</div>,
      },
    ],
  },
])

export const AppRouter = () => {
  return <RouterProvider router={router} />
}
