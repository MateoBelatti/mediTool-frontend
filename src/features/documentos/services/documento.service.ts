import { apiClient } from '@/shared/api/apiClient'
import type { DocumentoPaciente } from '../types/documento.types'

export const documentosService = {
  getByPaciente: async (pacienteId: number): Promise<DocumentoPaciente[]> => {
    const response = await apiClient.get<DocumentoPaciente[]>(
      `/Paciente/${pacienteId}/documentos`
    )
    return response.data
  },

  upload: async (
    pacienteId: number,
    archivo: File
  ): Promise<DocumentoPaciente> => {
    const formData = new FormData()
    formData.append('archivo', archivo)

    const response = await apiClient.post<DocumentoPaciente>(
      `/Paciente/${pacienteId}/documentos`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  },

  descargar: async (pacienteId: number, documentoId: number): Promise<Blob> => {
    const response = await apiClient.get<Blob>(
      `/Paciente/${pacienteId}/documentos/${documentoId}/archivo`,
      { responseType: 'blob' }
    )
    return response.data
  },

  delete: async (pacienteId: number, documentoId: number): Promise<void> => {
    await apiClient.delete(`/Paciente/${pacienteId}/documentos/${documentoId}`)
  },
}
