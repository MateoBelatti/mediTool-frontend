export interface DocumentoPaciente {
  id: number
  pacienteId: number
  profesionalId: number
  profesionalNombre?: string | null
  nombreOriginal: string
  extension: string
  contentType: string
  tamanoBytes: number
  fechaSubida: string
}
