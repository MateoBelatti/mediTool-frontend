import { apiClient } from '@/shared/api/apiClient'
import type {
  Profesional,
  ProfesionalCreateDto,
  ProfesionalUpdateDto,
} from '../types/profesional.types'
import type { Paciente } from '../types/paciente.types'

export const profesionalService = {
  async getById(id: number): Promise<Profesional> {
    const response = await apiClient.get<Profesional>(`/Profesional/${id}`)
    return response.data
  },

  async create(data: ProfesionalCreateDto): Promise<Profesional> {
    const response = await apiClient.post<Profesional>('/Profesional', data)
    return response.data
  },

  async update(id: number, data: ProfesionalUpdateDto): Promise<Profesional> {
    const response = await apiClient.put<Profesional>(
      `/Profesional/${id}`,
      data
    )
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/Profesional/${id}`)
  },

  async vincularPaciente(id: number, pacienteId: number): Promise<void> {
    await apiClient.post(`/Profesional/${id}/pacientes/${pacienteId}`)
  },

  async getPacientesVinculados(id: number): Promise<Paciente[]> {
    const response = await apiClient.get<Paciente[]>(
      `/Profesional/${id}/pacientes`
    )
    return response.data
  },
}
