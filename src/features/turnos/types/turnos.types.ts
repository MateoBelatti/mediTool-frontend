export enum EstadoTurno {
  Pendiente = 0,
  Presente = 1,
  Cancelado = 2,
  Reprogramado = 3,
  Ausente = 4,
}

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
}
