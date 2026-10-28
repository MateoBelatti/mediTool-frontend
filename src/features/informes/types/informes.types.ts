export interface InformeCreateDto {
  pacienteId?: number
  profesionalId: number
  turnoId?: number | null
  fecha: string
  tipo?: string
  contenido?: string
  estado?: string
}

export interface InformeUpdateDto {
  pacienteId?: number
  profesionalId: number
  turnoId?: number | null
  fecha: string
  tipo?: string
  contenido?: string
  estado?: string
}

export interface InformeResponseDto {
  id: number
  pacienteId?: number | null
  profesionalId: number
  turnoId?: number | null
  fecha: string
  tipo?: string | null
  contenido?: string | null
  estado?: string | null
  createdAt?: string | null
}
