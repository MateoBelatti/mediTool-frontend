import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { informesService } from '../services/informes.service'
import type {
  InformeCreateDto,
  InformeUpdateDto,
} from '../schemas/informes.schema'

export const INFORMES_KEYS = {
  all: ['informes'] as const,
  detail: (id: number) => [...INFORMES_KEYS.all, 'detail', id] as const,
  byProfesional: (profesionalId: number) =>
    [...INFORMES_KEYS.all, 'profesional', profesionalId] as const,
}

export const useInformes = () =>
  useQuery({
    queryKey: INFORMES_KEYS.all,
    queryFn: () => informesService.getAll(),
  })

export const useInformeById = (id: number) =>
  useQuery({
    queryKey: INFORMES_KEYS.detail(id),
    queryFn: () => informesService.getById(id),
    enabled: !!id,
  })

export const useInformesByProfesionalId = (profesionalId: number) =>
  useQuery({
    queryKey: INFORMES_KEYS.byProfesional(profesionalId),
    queryFn: () => informesService.getByProfesionalId(profesionalId),
    enabled: !!profesionalId,
  })

export const useCreateInforme = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: InformeCreateDto) => informesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INFORMES_KEYS.all })
    },
  })
}

export const useUpdateInforme = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: InformeUpdateDto }) =>
      informesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: INFORMES_KEYS.all })
      queryClient.invalidateQueries({
        queryKey: INFORMES_KEYS.detail(variables.id),
      })
    },
  })
}

export const useDeleteInforme = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => informesService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: INFORMES_KEYS.all })
      queryClient.invalidateQueries({ queryKey: INFORMES_KEYS.detail(id) })
    },
  })
}
