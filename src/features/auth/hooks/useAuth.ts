import { useMutation, useQueryClient } from '@tanstack/react-query'
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

export const ROLES = {
  ADMIN: 'Admin',
  PROFESIONAL: 'Profesional',
} as const

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
      role:
        decoded.role ||
        decoded[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] ||
        '',
    }
  } catch (error) {
    console.error('Error decoding token:', error)
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    return null
  }
}

export const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(getUserFromToken())

  const loginMutation = useMutation<AuthResponseDto, Error, LoginRequestDto>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: () => {
      // Actualizar el estado del usuario con el nuevo token
      setUser(getUserFromToken())
      // Redirigir al usuario al dashboard o página principal después de un login exitoso
      navigate('/')
    },
  })

  const logout = () => {
    authService.logout()
    queryClient.clear()
    setUser(null)
    navigate('/login', { replace: true })
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
