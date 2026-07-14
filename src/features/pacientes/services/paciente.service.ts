import { apiClient } from '@/shared/api/apiClient'
import type {
  Paciente,
  PacienteCreateDto,
  PacienteUpdateDto,
} from '../types/paciente.types'

export const pacienteService = {
  async getAll(): Promise<Paciente[]> {
    const response = await apiClient.get<Paciente[]>('/Paciente')
    return response.data
  },

  async getById(id: number): Promise<Paciente> {
    const response = await apiClient.get<Paciente>(`/Paciente/${id}`)
    return response.data
  },

  async create(data: PacienteCreateDto): Promise<Paciente> {
    const response = await apiClient.post<Paciente>('/Paciente', data)
    return response.data
  },

  async update(id: number, data: PacienteUpdateDto): Promise<Paciente> {
    const response = await apiClient.put<Paciente>(`/Paciente/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/Paciente/${id}`)
  },
}
