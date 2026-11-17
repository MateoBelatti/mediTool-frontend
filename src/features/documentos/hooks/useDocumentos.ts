import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { documentosService } from '../services/documento.service'

export const DOCUMENTOS_KEYS = {
  all: ['documentos'] as const,
  byPaciente: (pacienteId: number) =>
    [...DOCUMENTOS_KEYS.all, 'paciente', pacienteId] as const,
}

export const useDocumentosPaciente = (pacienteId: number) =>
  useQuery({
    queryKey: DOCUMENTOS_KEYS.byPaciente(pacienteId),
    queryFn: () => documentosService.getByPaciente(pacienteId),
    enabled: pacienteId > 0,
  })

export const useUploadDocumento = (pacienteId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (archivo: File) =>
      documentosService.upload(pacienteId, archivo),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DOCUMENTOS_KEYS.byPaciente(pacienteId),
      })
    },
  })
}

export const useDeleteDocumento = (pacienteId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (documentoId: number) =>
      documentosService.delete(pacienteId, documentoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DOCUMENTOS_KEYS.byPaciente(pacienteId),
      })
    },
  })
}
