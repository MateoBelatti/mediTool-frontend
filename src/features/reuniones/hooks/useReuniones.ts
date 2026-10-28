import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reunionesService } from '../services/reuniones.service'
import type {
  ReunionCreateDto,
  ReunionUpdateDto,
} from '../schemas/reuniones.schema'

export const REUNIONES_KEYS = {
  all: ['reuniones'] as const,
  detail: (id: number) => [...REUNIONES_KEYS.all, 'detail', id] as const,
  byProfesional: (profesionalId: number) =>
    [...REUNIONES_KEYS.all, 'profesional', profesionalId] as const,
}

export const useReuniones = () =>
  useQuery({
    queryKey: REUNIONES_KEYS.all,
    queryFn: () => reunionesService.getAll(),
  })

export const useReunionById = (id: number) =>
  useQuery({
    queryKey: REUNIONES_KEYS.detail(id),
    queryFn: () => reunionesService.getById(id),
    enabled: !!id,
  })

export const useReunionesByProfesionalId = (profesionalId: number) =>
  useQuery({
    queryKey: REUNIONES_KEYS.byProfesional(profesionalId),
    queryFn: () => reunionesService.getByProfesionalId(profesionalId),
    enabled: !!profesionalId,
  })

export const useCreateReunion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ReunionCreateDto) => reunionesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REUNIONES_KEYS.all })
    },
  })
}

export const useUpdateReunion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReunionUpdateDto }) =>
      reunionesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: REUNIONES_KEYS.all })
      queryClient.invalidateQueries({
        queryKey: REUNIONES_KEYS.detail(variables.id),
      })
    },
  })
}

export const useDeleteReunion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => reunionesService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: REUNIONES_KEYS.all })
      queryClient.invalidateQueries({ queryKey: REUNIONES_KEYS.detail(id) })
    },
  })
}
