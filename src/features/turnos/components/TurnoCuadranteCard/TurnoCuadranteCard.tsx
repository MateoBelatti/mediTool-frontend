import type { Turno } from '../../types/turnos.types'
import { EstadoTurno } from '../../types/turnos.types'
import styles from './TurnoCuadranteCard.module.css'

interface TurnoCuadranteCardProps {
  turno: Turno
  onClick: (turno: Turno) => void
  showHora?: boolean
  showPaciente?: boolean
}

const DIAS_CORTOS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
const MESES_CORTOS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
]

const ESTADO_LABELS: Record<EstadoTurno, string> = {
  [EstadoTurno.Pendiente]: 'PENDIENTE',
  [EstadoTurno.Presente]: 'PRESENTE',
  [EstadoTurno.Cancelado]: 'CANCELADO',
  [EstadoTurno.Reprogramado]: 'REPROGRAMADO',
  [EstadoTurno.Ausente]: 'AUSENTE',
}

const ESTADO_CLASSES: Record<EstadoTurno, string> = {
  [EstadoTurno.Pendiente]: styles.badgePendiente,
  [EstadoTurno.Presente]: styles.badgePresente,
  [EstadoTurno.Cancelado]: styles.badgeCancelado,
  [EstadoTurno.Reprogramado]: styles.badgeReprogramado,
  [EstadoTurno.Ausente]: styles.badgeAusente,
}

export const TurnoCuadranteCard = ({
  turno,
  onClick,
  showHora = false,
  showPaciente = false,
}: TurnoCuadranteCardProps) => {
  const date = new Date(turno.fechaHora)
  const diaSem = DIAS_CORTOS[date.getDay()] ?? ''
  const mes = MESES_CORTOS[date.getMonth()] ?? ''
  const diaNum = date.getDate()
  const horaStr = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  const estadoBadgeClass = ESTADO_CLASSES[turno.estado] || styles.badgePendiente
  const estadoLabel = ESTADO_LABELS[turno.estado] || turno.estado

  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => onClick(turno)}
      title="Ver detalle del turno"
    >
      <div className={styles.header}>
        <span className={styles.headerDate}>
          {diaSem} · {mes}
        </span>
      </div>

      <div className={styles.dayNumber}>{diaNum}</div>

      {showPaciente && turno.paciente && (
        <div className={styles.pacienteName}>
          {turno.paciente.nombre} {turno.paciente.apellido}
        </div>
      )}

      {showHora && (
        <div className={styles.horaInfo}>
          {horaStr} ({turno.duracionMin} min)
        </div>
      )}

      <div className={styles.footer}>
        <span className={`${styles.badge} ${estadoBadgeClass}`}>
          {estadoLabel}
        </span>
      </div>
    </button>
  )
}
