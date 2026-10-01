import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pacienteService } from '../services/paciente.service'
import type {
  PacienteCreateDto,
  PacienteUpdateDto,
} from '../types/paciente.types'
import type { PaginationParams } from '@/shared/types/pagination.types'

export const usePacientes = (id?: number, params?: PaginationParams) => {
  const queryClient = useQueryClient()

  const getAllPacientes = useQuery({
    queryKey: ['pacientes', params],
    queryFn: () => pacienteService.getAll(params),
  })

  const getVinculados = useQuery({
    queryKey: ['pacientes', 'vinculados', params],
    queryFn: () => pacienteService.getVinculados(params),
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
    pacientesVinculados: getVinculados.data,
    isLoadingVinculados: getVinculados.isLoading,
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
