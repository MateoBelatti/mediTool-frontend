import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { asistenciasService } from '../services/asistencias.service'
import type { ActualizarAsistenciaDto } from '../schemas/asistencias.schema'
import { TURNOS_KEYS } from '../../turnos/hooks/useTurnos'

export const ASISTENCIAS_KEYS = {
  all: ['asistencias'] as const,
  facturables: (params: { pacienteId: number; desde: string; hasta: string }) =>
    [...ASISTENCIAS_KEYS.all, 'facturables', params] as const,
  resumenPorTurnoFijo: (turnoFijoId: number) =>
    [...ASISTENCIAS_KEYS.all, 'resumen', turnoFijoId] as const,
}

export const useAsistenciasFacturables = (params: {
  pacienteId: number
  desde: string
  hasta: string
}) =>
  useQuery({
    queryKey: ASISTENCIAS_KEYS.facturables(params),
    queryFn: () => asistenciasService.getFacturables(params),
    enabled: !!params.pacienteId && !!params.desde && !!params.hasta,
  })

export const useResumenPorTurnoFijo = (turnoFijoId: number) =>
  useQuery({
    queryKey: ASISTENCIAS_KEYS.resumenPorTurnoFijo(turnoFijoId),
    queryFn: () => asistenciasService.getResumenPorTurnoFijo(turnoFijoId),
    enabled: !!turnoFijoId,
  })

export const useRegistrarActualizarAsistencia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      turnoId,
      data,
    }: {
      turnoId: number
      data: ActualizarAsistenciaDto
    }) => asistenciasService.registrarActualizar(turnoId, data),
    onSuccess: (_, variables) => {
      // Invalidate both asistencias and the specific turno to refresh its asistencia data
      queryClient.invalidateQueries({ queryKey: ASISTENCIAS_KEYS.all })
      queryClient.invalidateQueries({
        queryKey: TURNOS_KEYS.detail(variables.turnoId),
      })
      queryClient.invalidateQueries({ queryKey: TURNOS_KEYS.all })
    },
  })
}
