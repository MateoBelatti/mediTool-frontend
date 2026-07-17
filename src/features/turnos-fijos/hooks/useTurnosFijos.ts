import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { turnosFijosService } from '../services/turnosFijos.service'
import type {
  CrearTurnoFijoDto,
  EditarTurnoFijoDto,
} from '../schemas/turnos-fijos.schema'

export const TURNOS_FIJOS_KEYS = {
  all: ['turnosFijos'] as const,
  byProfesional: (profesionalId: number) =>
    [...TURNOS_FIJOS_KEYS.all, 'profesional', profesionalId] as const,
}

export const useTurnosFijosByProfesional = (profesionalId: number) =>
  useQuery({
    queryKey: TURNOS_FIJOS_KEYS.byProfesional(profesionalId),
    queryFn: () => turnosFijosService.getByProfesional(profesionalId),
    enabled: !!profesionalId,
  })

export const useCreateTurnoFijo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CrearTurnoFijoDto) => turnosFijosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TURNOS_FIJOS_KEYS.all })
    },
  })
}

export const useUpdateTurnoFijo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EditarTurnoFijoDto }) =>
      turnosFijosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TURNOS_FIJOS_KEYS.all })
    },
  })
}

export const useDeleteTurnoFijo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => turnosFijosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TURNOS_FIJOS_KEYS.all })
    },
  })
}
