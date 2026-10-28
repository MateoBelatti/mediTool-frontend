import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificacionesService } from '../services/notificaciones.service'
import type {
  NotificacionesQueryParams,
  Notificacion,
} from '../types/notificaciones.types'
import type { PageResult } from '@/shared/types/pagination.types'

export const NOTIFICACIONES_KEYS = {
  all: ['notificaciones'] as const,
  count: () => [...NOTIFICACIONES_KEYS.all, 'count'] as const,
  list: (params?: NotificacionesQueryParams) =>
    [...NOTIFICACIONES_KEYS.all, 'list', params] as const,
}

export const useNotificacionesCount = () => {
  return useQuery({
    queryKey: NOTIFICACIONES_KEYS.count(),
    queryFn: () => notificacionesService.getCountNoLeidas(),
    refetchInterval: 60000, // Cada 1 minuto
    staleTime: 30000,
  })
}

export const useNotificaciones = (params?: NotificacionesQueryParams) => {
  return useQuery({
    queryKey: NOTIFICACIONES_KEYS.list(params),
    queryFn: () => notificacionesService.getMias(params),
  })
}

export const useMarcarComoLeida = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => notificacionesService.marcarComoLeida(id),
    onMutate: async (id: number) => {
      // Cancelar refetches salientes para no sobreescribir actualización optimista
      await queryClient.cancelQueries({ queryKey: NOTIFICACIONES_KEYS.all })

      // Snapshot previo del contador
      const previousCount = queryClient.getQueryData<number>(
        NOTIFICACIONES_KEYS.count()
      )

      // Actualizar contador optimista si era mayor a 0
      queryClient.setQueryData<number>(NOTIFICACIONES_KEYS.count(), (old) => {
        if (typeof old === 'number' && old > 0) {
          return old - 1
        }
        return old ?? 0
      })

      // Actualizar listas en caché
      queryClient.setQueriesData<PageResult<Notificacion>>(
        { queryKey: NOTIFICACIONES_KEYS.all },
        (oldData) => {
          if (!oldData?.items) return oldData
          return {
            ...oldData,
            items: oldData.items.map((item) =>
              item.id === id ? { ...item, leida: true } : item
            ),
          }
        }
      )

      return { previousCount }
    },
    onError: (_err, _id, context) => {
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          NOTIFICACIONES_KEYS.count(),
          context.previousCount
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICACIONES_KEYS.all })
    },
  })
}

export const useMarcarTodasComoLeidas = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificacionesService.marcarTodasComoLeidas(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICACIONES_KEYS.all })

      const previousCount = queryClient.getQueryData<number>(
        NOTIFICACIONES_KEYS.count()
      )

      queryClient.setQueryData<number>(NOTIFICACIONES_KEYS.count(), 0)

      queryClient.setQueriesData<PageResult<Notificacion>>(
        { queryKey: NOTIFICACIONES_KEYS.all },
        (oldData) => {
          if (!oldData?.items) return oldData
          return {
            ...oldData,
            items: oldData.items.map((item) => ({ ...item, leida: true })),
          }
        }
      )

      return { previousCount }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          NOTIFICACIONES_KEYS.count(),
          context.previousCount
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICACIONES_KEYS.all })
    },
  })
}
