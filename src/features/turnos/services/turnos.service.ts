import { apiClient } from '@/shared/api/apiClient'
import { CrearTurnoDto, EstadoTurno, Turno } from '../schemas/turnos.schema'

export const turnosService = {
  getAgenda: async (params: {
    desde: string
    hasta: string
    profesionalId?: number
  }): Promise<Turno[]> => {
    const response = await apiClient.get<Turno[]>('/Turno/agenda', { params })
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
