import {
  FileText,
  User as UserIcon,
  Calendar,
  Clock,
  Pencil,
} from 'lucide-react'
import { Modal } from '@/shared/components/Modal/Modal'
import { Button } from '@/shared/components/Button/Button'
import type { InformeWithPaciente } from '../InformesGrid/InformesGrid'
import styles from './InformeDetailModal.module.css'

interface InformeDetailModalProps {
  isOpen: boolean
  onClose: () => void
  informe: InformeWithPaciente | null
  onEdit: (informe: InformeWithPaciente) => void
}

export const InformeDetailModal = ({
  isOpen,
  onClose,
  informe,
  onEdit,
}: InformeDetailModalProps) => {
  if (!informe) return null

  const formatFecha = (fechaString: string) => {
    if (fechaString.length === 10) {
      const [year, month, day] = fechaString.split('-')
      return `${day}/${month}/${year}`
    }
    return new Date(fechaString).toLocaleDateString()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle del Informe">
      <div className={styles.container}>
        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <UserIcon size={18} className={styles.icon} />
            <div>
              <p className={styles.label}>Paciente</p>
              <p className={styles.value}>
                {informe.pacienteData
                  ? `${informe.pacienteData.nombre || ''} ${informe.pacienteData.apellido || ''}`
                  : 'Paciente Desconocido'}
              </p>
            </div>
          </div>

          <div className={styles.infoRow}>
            <Calendar size={18} className={styles.icon} />
            <div>
              <p className={styles.label}>Fecha</p>
              <p className={styles.value}>{formatFecha(informe.fecha)}</p>
            </div>
          </div>

          <div className={styles.infoRow}>
            <FileText size={18} className={styles.icon} />
            <div>
              <p className={styles.label}>Tipo</p>
              <p className={styles.value}>{informe.tipo || 'Sin tipo'}</p>
            </div>
          </div>

          {informe.turnoId && (
            <div className={styles.infoRow}>
              <Clock size={18} className={styles.icon} />
              <div>
                <p className={styles.label}>Turno</p>
                <p className={styles.value}>Turno #{informe.turnoId}</p>
              </div>
            </div>
          )}

          <div className={styles.infoRow}>
            <div className={styles.statusBadge}>
              {informe.estado || 'Sin estado'}
            </div>
          </div>
        </div>

        <div className={styles.contenidoSection}>
          <h3 className={styles.sectionTitle}>Contenido</h3>
          <p className={styles.contenido}>
            {informe.contenido || 'Este informe no tiene contenido.'}
          </p>
        </div>

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={() => onEdit(informe)}
            leftIcon={<Pencil size={16} />}
          >
            Editar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
