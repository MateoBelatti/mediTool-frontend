import { apiClient } from '@/shared/api/apiClient'
import type {
  Profesional,
  ProfesionalCreateDto,
  ProfesionalUpdateDto,
} from '../types/profesional.types'

export const profesionalService = {
  async getAll(): Promise<Profesional[]> {
    const response = await apiClient.get<Profesional[]>('/Profesional')
    return response.data
  },

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

  async desvincularPaciente(id: number, pacienteId: number): Promise<void> {
    await apiClient.delete(`/Profesional/${id}/pacientes/${pacienteId}`)
  },
}
