import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from '@/app/layouts/MainLayout'
import { HomePage } from '@/pages/dashboard/HomePage'
import { LoginPage } from '@/pages/LoginPage/LoginPage'
import { PacientesPage } from '@/pages/pacientesPage/PacientesPage'
import { PacienteProfilePage } from '@/pages/pacienteProfilePage/PacienteProfilePage'
import { TurnosPage } from '@/pages/TurnosPage/TurnosPage'
import { TurnoFijoProfilePage } from '@/pages/TurnoFijoProfilePage/TurnoFijoProfilePage'
import { AsistenciasPage } from '@/pages/AsistenciasPage/AsistenciasPage'
import { InformesPage } from '@/pages/InformesPage/InformesPage'
import { ReunionesPage } from '@/pages/ReunionesPage/ReunionesPage'

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
        path: 'pacientes/:id',
        element: <PacienteProfilePage />,
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
        element: <div>404 - Página no encontrada</div>,
      },
    ],
  },
])

export const AppRouter = () => {
  return <RouterProvider router={router} />
}
