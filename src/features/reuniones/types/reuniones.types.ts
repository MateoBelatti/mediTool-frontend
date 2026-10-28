export interface ReunionCreateDto {
  titulo: string
  fechaHora: string
  modalidad?: string
  descripcion?: string
  profesionalId: number
}

export interface ReunionUpdateDto {
  titulo: string
  fechaHora: string
  modalidad?: string
  descripcion?: string
  profesionalId: number
}
