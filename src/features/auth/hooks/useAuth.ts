import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { authService } from '../services/auth.service'
import type {
  LoginRequestDto,
  AuthResponseDto,
  UserClaims,
  User,
} from '../types/auth.types'

const getUserFromToken = (): User | null => {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const decoded = jwtDecode<UserClaims>(token)
    return {
      id:
        decoded.sub ||
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ] ||
        '',
      email:
        decoded.email ||
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
        ] ||
        '',
      name:
        decoded.name ||
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        '',
    }
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

export const useAuth = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(getUserFromToken())

  const loginMutation = useMutation<AuthResponseDto, Error, LoginRequestDto>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: () => {
      // Actualizar el estado del usuario con el nuevo token
      setUser(getUserFromToken())
      // Redirigir al usuario al dashboard o página principal después de un login exitoso
      navigate('/')
    },
    onError: (error) => {
      console.error('Error en el login:', error)
      // Aquí puedes agregar lógica adicional como mostrar un toast de error
    },
  })

  const logout = () => {
    authService.logout()
    setUser(null)
    navigate('/login')
  }

  return {
    user,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
  }
}
