import axios from 'axios'
import { env } from '@/app/config/env'

export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    // Inyectar JWT si existe
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Manejo de refresh token en error 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const { data } = await axios.post(`${env.VITE_API_URL}/Auth/refresh`, {
          refreshToken,
        })

        if (data.accessToken) {
          localStorage.setItem('token', data.accessToken)
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        }

        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken)
        }

        return apiClient(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)
