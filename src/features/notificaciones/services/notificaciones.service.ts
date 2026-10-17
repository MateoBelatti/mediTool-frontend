import { apiClient } from '@/shared/api/apiClient'
import type { PageResult } from '@/shared/types/pagination.types'
import type {
  Notificacion,
  CrearNotificacionDto,
  NotificacionesQueryParams,
} from '../types/notificaciones.types'

export const notificacionesService = {
  getMias: async (
    params?: NotificacionesQueryParams
  ): Promise<PageResult<Notificacion>> => {
    const response = await apiClient.get<PageResult<Notificacion>>(
      '/Notificacion',
      {
        params,
      }
    )
    return response.data
  },

  getCountNoLeidas: async (): Promise<number> => {
    const response = await apiClient.get<number>(
      '/Notificacion/no-leidas/count'
    )
    return response.data
  },

  marcarComoLeida: async (id: number): Promise<void> => {
    await apiClient.patch(`/Notificacion/${id}/leer`)
  },

  marcarTodasComoLeidas: async (): Promise<number> => {
    const response = await apiClient.patch<number>('/Notificacion/leer-todas')
    return response.data
  },

  crear: async (data: CrearNotificacionDto): Promise<Notificacion> => {
    const response = await apiClient.post<Notificacion>('/Notificacion', data)
    return response.data
  },
}
