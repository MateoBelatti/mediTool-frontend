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
        // TODO: Implementar lógica de refresh token
        // const { data } = await axios.post(`${env.VITE_API_URL}/auth/refresh`)
        // localStorage.setItem('token', data.token)
        // originalRequest.headers.Authorization = `Bearer ${data.token}`
        // return apiClient(originalRequest)

        return Promise.reject(error)
      } catch (refreshError) {
        localStorage.removeItem('token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)
