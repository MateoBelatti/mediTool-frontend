import { apiClient } from '@/shared/api/apiClient'
import type {
  ActualizarAsistenciaDto,
  ResumenAsistenciaDto,
} from '../schemas/asistencias.schema'
import type { Turno } from '../../turnos/schemas/turnos.schema'

export const asistenciasService = {
  getFacturables: async (params: {
    pacienteId: number
    desde: string
    hasta: string
  }): Promise<Turno[]> => {
    const response = await apiClient.get<Turno[]>('/Turno/facturables', {
      params,
    })
    return response.data
  },
  getResumenPorTurnoFijo: async (
    turnoFijoId: number
  ): Promise<ResumenAsistenciaDto> => {
    const response = await apiClient.get<ResumenAsistenciaDto>(
      `/Turno/turnofijo/${turnoFijoId}/resumen-asistencia`
    )
    return response.data
  },
  registrarActualizar: async (
    turnoId: number,
    data: ActualizarAsistenciaDto
  ): Promise<Turno> => {
    const response = await apiClient.patch<Turno>(
      `/Turno/${turnoId}/asistencia`,
      data
    )
    return response.data
  },
}
