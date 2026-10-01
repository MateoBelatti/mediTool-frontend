export const EstadoTurno = {
  Pendiente: 'Pendiente',
  Presente: 'Presente',
  Cancelado: 'Cancelado',
  Reprogramado: 'Reprogramado',
  Ausente: 'Ausente',
} as const

export type EstadoTurno = (typeof EstadoTurno)[keyof typeof EstadoTurno]

export interface CrearTurnoDto {
  turnoFijoId?: number
  pacienteId: number
  profesionalId: number
  fechaHora: string
  duracionMin: number
  estado?: EstadoTurno
}

export interface PacienteBasico {
  id: number
  nombre: string
  apellido: string
  dni?: string
}

export interface Turno {
  id: number
  turnoFijoId?: number | null
  pacienteId: number
  paciente?: PacienteBasico
  profesionalId: number
  fechaHora: string
  duracionMin: number
  estado: EstadoTurno
  justificada?: boolean
  facturable?: boolean
  fechaRegistroAsistencia?: string | null
  observaciones?: string | null
}
