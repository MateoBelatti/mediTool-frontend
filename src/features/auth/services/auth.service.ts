import { apiClient } from '@/shared/api/apiClient'
import type {
  LoginRequestDto,
  RefreshTokenRequestDto,
  AuthResponseDto,
} from '../types/auth.types'

export const authService = {
  async login(credentials: LoginRequestDto): Promise<AuthResponseDto> {
    const response = await apiClient.post<AuthResponseDto>(
      '/Auth/login',
      credentials
    )

    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken)
    }

    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken)
    }

    return response.data
  },

  async refresh(data: RefreshTokenRequestDto): Promise<AuthResponseDto> {
    const response = await apiClient.post<AuthResponseDto>(
      '/Auth/refresh',
      data
    )

    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken)
    }

    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken)
    }

    return response.data
  },

  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  },
}
