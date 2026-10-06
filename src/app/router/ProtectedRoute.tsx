import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // Redirigir al login si no está autenticado, guardando la ruta intentada
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    // Si hay roles permitidos y el usuario no tiene el rol, redirigir al home
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
