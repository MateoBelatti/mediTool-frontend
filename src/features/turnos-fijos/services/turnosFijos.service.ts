import { apiClient } from '@/shared/api/apiClient'
import type {
  CrearTurnoFijoDto,
  EditarTurnoFijoDto,
  TurnoFijo,
} from '../schemas/turnos-fijos.schema'

export const turnosFijosService = {
  getByProfesional: async (profesionalId: number): Promise<TurnoFijo[]> => {
    const response = await apiClient.get<TurnoFijo[]>(
      `/TurnoFijo/profesional/${profesionalId}`
    )
    return response.data
  },
  create: async (data: CrearTurnoFijoDto): Promise<TurnoFijo> => {
    const response = await apiClient.post<TurnoFijo>('/TurnoFijo', data)
    return response.data
  },
  update: async (id: number, data: EditarTurnoFijoDto): Promise<TurnoFijo> => {
    const response = await apiClient.put<TurnoFijo>(`/TurnoFijo/${id}`, data)
    return response.data
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/TurnoFijo/${id}`)
  },
}
