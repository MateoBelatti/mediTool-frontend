import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import type { LoginRequestDto, AuthResponseDto } from '../types/auth.types'

export const useAuth = () => {
  const navigate = useNavigate()

  const loginMutation = useMutation<AuthResponseDto, Error, LoginRequestDto>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: () => {
      // Redirigir al usuario al dashboard o página principal después de un login exitoso
      navigate('/dashboard')
    },
    onError: (error) => {
      console.error('Error en el login:', error)
      // Aquí puedes agregar lógica adicional como mostrar un toast de error
    },
  })

  const logout = () => {
    authService.logout()
    navigate('/login')
  }

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
  }
}
