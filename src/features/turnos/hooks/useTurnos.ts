import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { turnosService } from '../services/turnos.service'
import { type CrearTurnoDto, EstadoTurno } from '../types/turnos.types'

export const TURNOS_KEYS = {
  historialFijo: (turnoFijoId: number) => [...TURNOS_KEYS.all, 'historial', turnoFijoId] as const,
  all: ['turnos'] as const,
  detail: (id: number) => [...TURNOS_KEYS.all, 'detail', id] as const,
  agenda: (params: {
    desde: string
    hasta: string
    profesionalId: number
    page?: number
    pageSize?: number
  }) => [...TURNOS_KEYS.all, 'agenda', params] as const,
}

export const useAgendaTurnos = (params: {
  desde: string
  hasta: string
  profesionalId: number
  page?: number
  pageSize?: number
}) =>
  useQuery({
    queryKey: TURNOS_KEYS.agenda(params),
    queryFn: () => turnosService.getAgenda(params),
    enabled: !!params.desde && !!params.hasta && !!params.profesionalId,
  })

export const useHistorialTurnoFijo = (turnoFijoId: number | null) =>
  useQuery({
    queryKey: TURNOS_KEYS.historialFijo(turnoFijoId!),
    queryFn: () => turnosService.getHistorialByTurnoFijo(turnoFijoId!),
    enabled: !!turnoFijoId,
  })

export const useTurnoById = (id: number) =>
  useQuery({
    queryKey: TURNOS_KEYS.detail(id),
    queryFn: () => turnosService.getById(id),
    enabled: !!id,
  })

export const useCreateTurnoSuelto = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CrearTurnoDto) => turnosService.createSuelto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TURNOS_KEYS.all })
    },
  })
}

export const useReprogramarTurno = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      nuevaFechaHora,
    }: {
      id: number
      nuevaFechaHora: string
    }) => turnosService.reprogramar(id, nuevaFechaHora),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TURNOS_KEYS.all })
      queryClient.invalidateQueries({
        queryKey: TURNOS_KEYS.detail(variables.id),
      })
    },
  })
}

export const useCambiarEstadoTurno = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      nuevoEstado,
    }: {
      id: number
      nuevoEstado: EstadoTurno
    }) => turnosService.cambiarEstado(id, nuevoEstado),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TURNOS_KEYS.all })
      queryClient.invalidateQueries({
        queryKey: TURNOS_KEYS.detail(variables.id),
      })
    },
  })
}

export const useGenerarMasivoTurnos = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (hastaFecha: string) => turnosService.generarMasivo(hastaFecha),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TURNOS_KEYS.all })
    },
  })
}

export const ASISTENCIAS_KEYS = {
  all: ['asistencias'] as const,
  facturables: (params: { pacienteId: number; desde: string; hasta: string }) =>
    [...ASISTENCIAS_KEYS.all, 'facturables', params] as const,
  resumenPorTurnoFijo: (turnoFijoId: number) =>
    [...ASISTENCIAS_KEYS.all, 'resumen', turnoFijoId] as const,
}

export const useTurnosFacturables = (params: {
  pacienteId: number
  desde: string
  hasta: string
}) =>
  useQuery({
    queryKey: ASISTENCIAS_KEYS.facturables(params),
    queryFn: () => turnosService.getFacturables(params),
    enabled: !!params.pacienteId && !!params.desde && !!params.hasta,
  })

export const useResumenPorTurnoFijo = (turnoFijoId: number) =>
  useQuery({
    queryKey: ASISTENCIAS_KEYS.resumenPorTurnoFijo(turnoFijoId),
    queryFn: () => turnosService.getResumenPorTurnoFijo(turnoFijoId),
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
      data: import('../types/turnos.types').ActualizarAsistenciaDto
    }) => turnosService.registrarActualizarAsistencia(turnoId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ASISTENCIAS_KEYS.all })
      queryClient.invalidateQueries({
        queryKey: TURNOS_KEYS.detail(variables.turnoId),
      })
      queryClient.invalidateQueries({ queryKey: TURNOS_KEYS.all })
    },
  })
}
