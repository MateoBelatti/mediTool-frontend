import { apiClient } from '@/shared/api/apiClient'
import type {
  ReunionCreateDto,
  ReunionUpdateDto,
  ReunionResponseDto,
} from '../schemas/reuniones.schema'

export const reunionesService = {
  getAll: async (): Promise<ReunionResponseDto[]> => {
    const response = await apiClient.get<ReunionResponseDto[]>('/Reunion')
    return response.data
  },
  getById: async (id: number): Promise<ReunionResponseDto> => {
    const response = await apiClient.get<ReunionResponseDto>(`/Reunion/${id}`)
    return response.data
  },
  getByProfesionalId: async (
    profesionalId: number
  ): Promise<ReunionResponseDto[]> => {
    const response = await apiClient.get<ReunionResponseDto[]>(
      `/Reunion/profesional/${profesionalId}`
    )
    return response.data
  },
  create: async (data: ReunionCreateDto): Promise<ReunionResponseDto> => {
    const response = await apiClient.post<ReunionResponseDto>('/Reunion', data)
    return response.data
  },
  update: async (
    id: number,
    data: ReunionUpdateDto
  ): Promise<ReunionResponseDto> => {
    const response = await apiClient.put<ReunionResponseDto>(
      `/Reunion/${id}`,
      data
    )
    return response.data
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/Reunion/${id}`)
  },
}
