import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { turnosService } from '../services/turnos.service'
import { type CrearTurnoDto, EstadoTurno } from '../schemas/turnos.schema'

export const TURNOS_KEYS = {
  all: ['turnos'] as const,
  detail: (id: number) => [...TURNOS_KEYS.all, 'detail', id] as const,
  agenda: (params: { desde: string; hasta: string; profesionalId?: number }) =>
    [...TURNOS_KEYS.all, 'agenda', params] as const,
}

export const useAgendaTurnos = (params: {
  desde: string
  hasta: string
  profesionalId?: number
}) =>
  useQuery({
    queryKey: TURNOS_KEYS.agenda(params),
    queryFn: () => turnosService.getAgenda(params),
    enabled: !!params.desde && !!params.hasta,
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
