import {
  CalendarDays,
  CalendarClock,
  ClipboardList,
  Clock,
  FileText,
  UserRound,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Modal } from '@/shared/components/Modal/Modal'
import type { HistorialEvento } from '../../types/historial.types'
import styles from './HistorialEventoModal.module.css'

interface HistorialEventoModalProps {
  isOpen: boolean
  onClose: () => void
  evento: HistorialEvento | null
}

const formatFecha = (fecha: string) => {
  if (fecha.length === 10) {
    const [year, month, day] = fecha.split('-')
    return `${day}/${month}/${year}`
  }

  return format(new Date(fecha), 'dd/MM/yyyy', { locale: es })
}

const formatHora = (fecha: string) =>
  format(new Date(fecha), 'HH:mm', { locale: es })

export const HistorialEventoModal = ({
  isOpen,
  onClose,
  evento,
}: HistorialEventoModalProps) => {
  if (!evento) return null

  const esTurno = Boolean(evento.turno)
  const titulo = esTurno ? 'Detalle de la consulta' : 'Detalle del informe'
  const profesional = evento.profesional ?? evento.turno?.profesional

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titulo} size="lg">
      <div className={styles.container}>
        {evento.turno && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <CalendarClock size={18} />
              Turno
            </h3>

            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <CalendarDays size={16} className={styles.icon} />
                <div>
                  <span className={styles.label}>Fecha</span>
                  <span className={styles.value}>
                    {formatFecha(evento.turno.fechaHora)}
                  </span>
                </div>
              </div>

              <div className={styles.infoRow}>
                <Clock size={16} className={styles.icon} />
                <div>
                  <span className={styles.label}>Horario</span>
                  <span className={styles.value}>
                    {formatHora(evento.turno.fechaHora)} hs ·{' '}
                    {evento.turno.duracionMin} minutos
                  </span>
                </div>
              </div>

              <div className={styles.infoRow}>
                <UserRound size={16} className={styles.icon} />
                <div>
                  <span className={styles.label}>Profesional</span>
                  <span className={styles.value}>
                    {profesional
                      ? `${profesional.nombre} ${profesional.apellido}`
                      : 'No registrado'}
                  </span>
                </div>
              </div>

              <div className={styles.infoRow}>
                <ClipboardList size={16} className={styles.icon} />
                <div>
                  <span className={styles.label}>Estado</span>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[evento.turno.estado.toLowerCase()] ?? ''
                    }`}
                  >
                    {evento.turno.estado}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.extraInfo}>
              <div className={styles.extraItem}>
                <span className={styles.label}>Asistencia</span>
                <span className={styles.value}>
                  {evento.turno.justificada ? 'Justificada' : 'Sin justificar'}
                  {' · '}
                  {evento.turno.facturable ? 'Facturable' : 'No facturable'}
                </span>
              </div>

              {evento.turno.fechaRegistroAsistencia && (
                <div className={styles.extraItem}>
                  <span className={styles.label}>Registro de asistencia</span>
                  <span className={styles.value}>
                    {formatFecha(evento.turno.fechaRegistroAsistencia)}
                  </span>
                </div>
              )}

              <div className={styles.extraItem}>
                <span className={styles.label}>Observaciones</span>
                <span className={styles.value}>
                  {evento.turno.observaciones || 'Sin observaciones.'}
                </span>
              </div>
            </div>
          </section>
        )}

        {evento.informe && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <FileText size={18} />
              Informe
            </h3>

            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <CalendarDays size={16} className={styles.icon} />
                <div>
                  <span className={styles.label}>Fecha</span>
                  <span className={styles.value}>
                    {formatFecha(evento.informe.fecha)}
                  </span>
                </div>
              </div>

              <div className={styles.infoRow}>
                <FileText size={16} className={styles.icon} />
                <div>
                  <span className={styles.label}>Tipo</span>
                  <span className={styles.value}>
                    {evento.informe.tipo || 'Sin tipo'}
                  </span>
                </div>
              </div>

              <div className={styles.infoRow}>
                <UserRound size={16} className={styles.icon} />
                <div>
                  <span className={styles.label}>Profesional</span>
                  <span className={styles.value}>
                    {profesional
                      ? `${profesional.nombre} ${profesional.apellido}`
                      : 'No registrado'}
                  </span>
                </div>
              </div>

              <div className={styles.infoRow}>
                <ClipboardList size={16} className={styles.icon} />
                <div>
                  <span className={styles.label}>Estado</span>
                  <span className={styles.value}>
                    {evento.informe.estado || 'Sin estado'}
                  </span>
                </div>
              </div>
            </div>

            {evento.informe.turnoId && (
              <p className={styles.turnoRef}>
                Informe asociado al turno #{evento.informe.turnoId}
              </p>
            )}

            <div className={styles.contenido}>
              <span className={styles.label}>Contenido</span>
              <p className={styles.contenidoTexto}>
                {evento.informe.contenido || 'Este informe no tiene contenido.'}
              </p>
            </div>
          </section>
        )}
      </div>
    </Modal>
  )
}
