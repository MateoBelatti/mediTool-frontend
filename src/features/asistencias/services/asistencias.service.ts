import { apiClient } from '@/shared/api/apiClient'
import {
  ActualizarAsistenciaDto,
  Asistencia,
  ResumenAsistenciaDto,
} from '../schemas/asistencias.schema'

export const asistenciasService = {
  getByTurno: async (turnoId: number): Promise<Asistencia> => {
    const response = await apiClient.get<Asistencia>(
      `/Asistencia/turno/${turnoId}`
    )
    return response.data
  },
  getFacturables: async (params: {
    pacienteId: number
    desde: string
    hasta: string
  }): Promise<Asistencia[]> => {
    const response = await apiClient.get<Asistencia[]>(
      '/Asistencia/facturables',
      { params }
    )
    return response.data
  },
  getResumenPorTurnoFijo: async (
    turnoFijoId: number
  ): Promise<ResumenAsistenciaDto> => {
    const response = await apiClient.get<ResumenAsistenciaDto>(
      `/Asistencia/resumen/turnofijo/${turnoFijoId}`
    )
    return response.data
  },
  registrar: async (
    turnoId: number,
    params: { asistio: boolean; justificada?: boolean; observaciones?: string }
  ): Promise<Asistencia> => {
    const response = await apiClient.post<Asistencia>(
      `/Asistencia/turno/${turnoId}`,
      null,
      { params }
    )
    return response.data
  },
  update: async (
    turnoId: number,
    data: ActualizarAsistenciaDto
  ): Promise<void> => {
    await apiClient.put(`/Asistencia/turno/${turnoId}`, data)
  },
}
