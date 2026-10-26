import { Calendar, Clock, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Modal } from '@/shared/components/Modal/Modal'
import { Button } from '@/shared/components/Button/Button'
import type { ReunionResponseDto } from '../../schemas/reuniones.schema'
import styles from './ReunionDetailModal.module.css'

interface ReunionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  reunion: ReunionResponseDto | null
}

export const ReunionDetailModal = ({
  isOpen,
  onClose,
  reunion,
}: ReunionDetailModalProps) => {
  if (!reunion) return null

  const fecha = new Date(reunion.fechaHora)
  const fechaTexto = format(fecha, "EEEE d 'de' MMMM 'de' yyyy", {
    locale: es,
  })
  const horaTexto = format(fecha, 'HH:mm')
  const creadaEl = reunion.createdAt
    ? format(
        new Date(reunion.createdAt),
        "d 'de' MMMM 'de' yyyy 'a las' HH:mm",
        { locale: es }
      )
    : null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de la Reunión">
      <div className={styles.container}>
        <h3 className={styles.reunionTitle}>{reunion.titulo}</h3>

        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <Calendar size={18} className={styles.icon} />
            <div>
              <p className={styles.label}>Fecha y hora</p>
              <p className={styles.value}>
                {fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1)} a las{' '}
                {horaTexto}
              </p>
            </div>
          </div>

          <div className={styles.infoRow}>
            <MapPin size={18} className={styles.icon} />
            <div>
              <p className={styles.label}>Modalidad</p>
              <p className={styles.value}>
                {reunion.modalidad || 'No definida'}
              </p>
            </div>
          </div>

          {creadaEl && (
            <div className={styles.infoRow}>
              <Clock size={18} className={styles.icon} />
              <div>
                <p className={styles.label}>Creada el</p>
                <p className={styles.value}>{creadaEl}</p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.descripcionSection}>
          <h3 className={styles.sectionTitle}>Descripción</h3>
          <p className={styles.descripcion}>
            {reunion.descripcion || 'Esta reunión no tiene descripción.'}
          </p>
        </div>

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
