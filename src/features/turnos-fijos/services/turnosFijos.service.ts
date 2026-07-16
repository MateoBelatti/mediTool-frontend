import { apiClient } from '@/shared/api/apiClient'
import {
  CrearTurnoFijoDto,
  EditarTurnoFijoDto,
} from '../schemas/turnos-fijos.schema'

export const turnosFijosService = {
  getByProfesional: async (profesionalId: number) => {
    const response = await apiClient.get(
      `/TurnoFijo/profesional/${profesionalId}`
    )
    return response.data
  },
  create: async (data: CrearTurnoFijoDto) => {
    const response = await apiClient.post('/TurnoFijo', data)
    return response.data
  },
  update: async (id: number, data: EditarTurnoFijoDto) => {
    const response = await apiClient.put(`/TurnoFijo/${id}`, data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`/TurnoFijo/${id}`)
    return response.data
  },
}
