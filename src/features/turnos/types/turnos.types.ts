export enum EstadoTurno {
  Pendiente = 0,
  Completado = 1,
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
