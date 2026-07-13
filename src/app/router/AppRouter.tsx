import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from '@/app/layouts/MainLayout'
import { HomePage } from '@/features/dashboard/pages/HomePage'
import { LoginPage } from '@/dashboard/pages/LoginPage/LoginPage'

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
        path: '*',
        element: <div>404 - Página no encontrada</div>,
      },
    ],
  },
])

export const AppRouter = () => {
  return <RouterProvider router={router} />
}
