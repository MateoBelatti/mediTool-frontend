import { apiClient } from '@/shared/api/apiClient'
import { CrearTurnoDto, EstadoTurno } from '../schemas/turnos.schema'

export const turnosService = {
  getAgenda: async (params: {
    desde: string
    hasta: string
    profesionalId?: number
  }) => {
    const response = await apiClient.get('/Turno/agenda', { params })
    return response.data
  },
  getById: async (id: number) => {
    const response = await apiClient.get(`/Turno/${id}`)
    return response.data
  },
  createSuelto: async (data: CrearTurnoDto) => {
    const response = await apiClient.post('/Turno', data)
    return response.data
  },
  reprogramar: async (id: number, nuevaFechaHora: string) => {
    const response = await apiClient.patch(`/Turno/${id}/reprogramar`, null, {
      params: { nuevaFechaHora },
    })
    return response.data
  },
  cambiarEstado: async (id: number, nuevoEstado: EstadoTurno) => {
    const response = await apiClient.patch(`/Turno/${id}/estado`, null, {
      params: { nuevoEstado },
    })
    return response.data
  },
  generarMasivo: async (hastaFecha: string) => {
    const response = await apiClient.post('/Turno/generar-masivo', null, {
      params: { hastaFecha },
    })
    return response.data
  },
}
