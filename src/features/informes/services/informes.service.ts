import { apiClient } from '@/shared/api/apiClient'
import type {
  InformeCreateDto,
  InformeUpdateDto,
  InformeResponseDto,
} from '../schemas/informes.schema'

export const informesService = {
  getAll: async (): Promise<InformeResponseDto[]> => {
    const response = await apiClient.get<InformeResponseDto[]>('/Informe')
    return response.data
  },
  getById: async (id: number): Promise<InformeResponseDto> => {
    const response = await apiClient.get<InformeResponseDto>(`/Informe/${id}`)
    return response.data
  },
  getByProfesionalId: async (
    profesionalId: number
  ): Promise<InformeResponseDto[]> => {
    const response = await apiClient.get<InformeResponseDto[]>(
      `/Informe/profesional/${profesionalId}`
    )
    return response.data
  },
  create: async (data: InformeCreateDto): Promise<InformeResponseDto> => {
    const response = await apiClient.post<InformeResponseDto>('/Informe', data)
    return response.data
  },
  update: async (
    id: number,
    data: InformeUpdateDto
  ): Promise<InformeResponseDto> => {
    const response = await apiClient.put<InformeResponseDto>(
      `/Informe/${id}`,
      data
    )
    return response.data
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/Informe/${id}`)
  },
}
