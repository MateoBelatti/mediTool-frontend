export interface CrearTurnoFijoDto {
  pacienteId: number
  profesionalId: number
  diaSemana: number
  hora: string
  duracionMin: number
  fechaInicio: string
  fechaFin?: string
  activo?: boolean
}

export interface EditarTurnoFijoDto {
  diaSemana: number
  hora: string
  duracionMin: number
  fechaFin?: string
  activo: boolean
}

export interface TurnoFijo {
  id: number
  pacienteId: number
  paciente?: {
    id: number
    nombre: string
    apellido: string
  }
  profesionalId: number
  diaSemana: number
  hora: string
  duracionMin: number
  fechaInicio: string
  fechaFin?: string
  activo: boolean
}
