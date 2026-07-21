export interface InformeCreateDto {
  pacienteId?: number
  profesionalId: number
  fecha: string
  tipo?: string
  contenido?: string
  estado?: string
}

export interface InformeUpdateDto {
  pacienteId?: number
  profesionalId: number
  fecha: string
  tipo?: string
  contenido?: string
  estado?: string
}
