import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { asistenciasService } from '../services/asistencias.service'
import { ActualizarAsistenciaDto } from '../schemas/asistencias.schema'

export const ASISTENCIAS_KEYS = {
  all: ['asistencias'] as const,
  byTurno: (turnoId: number) =>
    [...ASISTENCIAS_KEYS.all, 'turno', turnoId] as const,
  facturables: (params: { pacienteId: number; desde: string; hasta: string }) =>
    [...ASISTENCIAS_KEYS.all, 'facturables', params] as const,
  resumenPorTurnoFijo: (turnoFijoId: number) =>
    [...ASISTENCIAS_KEYS.all, 'resumen', turnoFijoId] as const,
}

export const useAsistenciaByTurno = (turnoId: number) =>
  useQuery({
    queryKey: ASISTENCIAS_KEYS.byTurno(turnoId),
    queryFn: () => asistenciasService.getByTurno(turnoId),
    enabled: !!turnoId,
  })

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

export const useRegistrarAsistencia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      turnoId,
      params,
    }: {
      turnoId: number
      params: {
        asistio: boolean
        justificada?: boolean
        observaciones?: string
      }
    }) => asistenciasService.registrar(turnoId, params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ASISTENCIAS_KEYS.byTurno(variables.turnoId),
      })
      queryClient.invalidateQueries({ queryKey: ASISTENCIAS_KEYS.all })
    },
  })
}

export const useUpdateAsistencia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      turnoId,
      data,
    }: {
      turnoId: number
      data: ActualizarAsistenciaDto
    }) => asistenciasService.update(turnoId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ASISTENCIAS_KEYS.byTurno(variables.turnoId),
      })
      queryClient.invalidateQueries({ queryKey: ASISTENCIAS_KEYS.all })
    },
  })
}
