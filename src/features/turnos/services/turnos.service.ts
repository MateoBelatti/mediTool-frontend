import { apiClient } from '@/shared/api/apiClient'
import {
  type CrearTurnoDto,
  EstadoTurno,
  type Turno,
} from '../types/turnos.types'
import type {
  PageResult,
  PaginationParams,
} from '@/shared/types/pagination.types'

export const turnosService = {
  getAgenda: async (
    params: {
      desde: string
      hasta: string
      profesionalId: number
    } & PaginationParams
  ): Promise<PageResult<Turno>> => {
    const { profesionalId, ...queryParams } = params
    const response = await apiClient.get<PageResult<Turno>>(
      `/Profesional/${profesionalId}/agenda`,
      { params: queryParams }
    )
    return response.data
  },
  getById: async (id: number): Promise<Turno> => {
    const response = await apiClient.get<Turno>(`/Turno/${id}`)
    return response.data
  },
  createSuelto: async (data: CrearTurnoDto): Promise<Turno> => {
    const response = await apiClient.post<Turno>('/Turno', data)
    return response.data
  },
  reprogramar: async (id: number, nuevaFechaHora: string): Promise<void> => {
    await apiClient.patch(`/Turno/${id}/reprogramar`, null, {
      params: { nuevaFechaHora },
    })
  },
  cambiarEstado: async (
    id: number,
    nuevoEstado: EstadoTurno
  ): Promise<void> => {
    await apiClient.patch(`/Turno/${id}/estado`, null, {
      params: { nuevoEstado },
    })
  },
  generarMasivo: async (hastaFecha: string): Promise<void> => {
    await apiClient.post('/Turno/generar-masivo', null, {
      params: { hastaFecha },
    })
  },
}
