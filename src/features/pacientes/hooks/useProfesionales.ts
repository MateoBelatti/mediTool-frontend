import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profesionalService } from '../services/profesional.service'
import type {
  ProfesionalCreateDto,
  ProfesionalUpdateDto,
} from '../types/profesional.types'

export const useProfesionales = (id?: number) => {
  const queryClient = useQueryClient()

  const getProfesionales = useQuery({
    queryKey: ['profesionales'],
    queryFn: () => profesionalService.getAll(),
  })

  // Obtener datos del profesional
  const getProfesional = useQuery({
    queryKey: ['profesional', id],
    queryFn: () => profesionalService.getById(id!),
    enabled: !!id,
  })

  const createProfesional = useMutation({
    mutationFn: (data: ProfesionalCreateDto) => profesionalService.create(data),
  })

  const updateProfesional = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProfesionalUpdateDto }) =>
      profesionalService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profesional', variables.id] })
    },
  })

  const deleteProfesional = useMutation({
    mutationFn: (id: number) => profesionalService.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['profesional', id] })
    },
  })

  const vincularPaciente = useMutation({
    mutationFn: ({ id, pacienteId }: { id: number; pacienteId: number }) =>
      profesionalService.vincularPaciente(id, pacienteId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['profesional', variables.id, 'pacientes'],
      })
    },
  })

  const desvincularPaciente = useMutation({
    mutationFn: ({ id, pacienteId }: { id: number; pacienteId: number }) =>
      profesionalService.desvincularPaciente(id, pacienteId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pacientes'],
      })
      queryClient.invalidateQueries({
        queryKey: ['profesional', variables.id, 'pacientes'],
      })
      queryClient.invalidateQueries({
        queryKey: ['paciente', variables.pacienteId, 'profesionales'],
      })
    },
  })

  return {
    // Queries
    profesional: getProfesional.data,
    isLoading: getProfesional.isLoading,
    error: getProfesional.error,

    // Mutations
    create: createProfesional.mutate,
    isCreating: createProfesional.isPending,

    update: updateProfesional.mutate,
    isUpdating: updateProfesional.isPending,

    remove: deleteProfesional.mutate,
    isDeleting: deleteProfesional.isPending,

    vincularPaciente: vincularPaciente.mutate,
    isVinculando: vincularPaciente.isPending,

    desvincularPaciente: desvincularPaciente.mutate,
    isDesvinculando: desvincularPaciente.isPending,

    profesionales: getProfesionales.data,
    isLoadingProfesionales: getProfesionales.isLoading,
  }
}
