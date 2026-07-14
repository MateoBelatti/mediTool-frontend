import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pacienteService } from '../services/paciente.service'
import type {
  PacienteCreateDto,
  PacienteUpdateDto,
} from '../types/paciente.types'

export const usePacientes = (id?: number) => {
  const queryClient = useQueryClient()

  const getAllPacientes = useQuery({
    queryKey: ['pacientes'],
    queryFn: pacienteService.getAll,
  })

  const getPaciente = useQuery({
    queryKey: ['paciente', id],
    queryFn: () => pacienteService.getById(id!),
    enabled: !!id,
  })

  const createPaciente = useMutation({
    mutationFn: (data: PacienteCreateDto) => pacienteService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] })
    },
  })

  const updatePaciente = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PacienteUpdateDto }) =>
      pacienteService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['paciente', variables.id] })
    },
  })

  const deletePaciente = useMutation({
    mutationFn: (id: number) => pacienteService.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['paciente', id] })
      queryClient.invalidateQueries({ queryKey: ['pacientes'] })
    },
  })

  return {
    pacientes: getAllPacientes.data,
    isLoadingPacientes: getAllPacientes.isLoading,
    paciente: getPaciente.data,
    isLoading: getPaciente.isLoading,
    error: getPaciente.error,
    create: createPaciente.mutate,
    isCreating: createPaciente.isPending,
    update: updatePaciente.mutate,
    isUpdating: updatePaciente.isPending,
    delete: deletePaciente.mutate,
    isDeleting: deletePaciente.isPending,
  }
}
