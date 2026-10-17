export const TipoNotificacion = {
  Sistema: 0,
  TurnosSinAsistencia: 1,
  RecordatorioEnviado: 2,
  ErrorRecordatorio: 3,
} as const

export type TipoNotificacion =
  (typeof TipoNotificacion)[keyof typeof TipoNotificacion]

export interface Notificacion {
  id: number
  profesionalId: number
  tipo: TipoNotificacion
  titulo: string
  mensaje: string
  leida: boolean
  fechaCreacion: string
}

export interface CrearNotificacionDto {
  profesionalId: number
  tipo: TipoNotificacion
  titulo: string
  mensaje: string
}

export interface NotificacionesQueryParams {
  page?: number
  pageSize?: number
  soloNoLeidas?: boolean
  profesionalId?: number
}
