import { Calendar, Clock, MapPin, Users, Pencil } from 'lucide-react'
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
  onEdit?: (reunion: ReunionResponseDto) => void
  puedeEditar?: boolean
}

export const ReunionDetailModal = ({
  isOpen,
  onClose,
  reunion,
  onEdit,
  puedeEditar = false,
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
  const profesionales = reunion.profesionales ?? []

  const modalidadLower = (reunion.modalidad || '').toLowerCase()
  const modalidadBadgeClass = modalidadLower.includes('presencial')
    ? styles.badgePresencial
    : modalidadLower.includes('virtual')
      ? styles.badgeVirtual
      : styles.badgeDefault

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de la reunión">
      <div className={styles.container}>
        <div className={styles.headerInfo}>
          <div className={styles.titleRow}>
            <h3 className={styles.reunionTitle}>{reunion.titulo}</h3>
            {reunion.modalidad && (
              <span className={`${styles.badge} ${modalidadBadgeClass}`}>
                {reunion.modalidad}
              </span>
            )}
          </div>
          <div className={styles.datetimeHighlight}>
            <Calendar size={18} className={styles.highlightIcon} />
            <span className={styles.datetimeText}>
              {fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1)} a las{' '}
              {horaTexto} hs
            </span>
          </div>
        </div>

        <div className={styles.descripcionSection}>
          <h4 className={styles.sectionTitle}>Descripción / Temas a tratar</h4>
          <div className={styles.descripcionBox}>
            {reunion.descripcion?.trim() ? (
              <p className={styles.descripcion}>{reunion.descripcion}</p>
            ) : (
              <p className={styles.emptyDescripcion}>
                Esta reunión no tiene una descripción especificada.
              </p>
            )}
          </div>
        </div>

        <div className={styles.detailsGrid}>
          {reunion.modalidad && (
            <div className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <MapPin size={16} className={styles.detailIcon} />
                <span className={styles.detailLabel}>Modalidad</span>
              </div>
              <p className={styles.detailValue}>{reunion.modalidad}</p>
            </div>
          )}

          {creadaEl && (
            <div className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <Clock size={16} className={styles.detailIcon} />
                <span className={styles.detailLabel}>Creada</span>
              </div>
              <p className={styles.detailValue}>{creadaEl}</p>
            </div>
          )}
        </div>

        <div className={styles.profesionalesSection}>
          <div className={styles.detailHeader}>
            <Users size={16} className={styles.detailIcon} />
            <h4 className={styles.sectionTitle}>
              Profesionales participantes ({profesionales.length})
            </h4>
          </div>

          {profesionales.length > 0 ? (
            <div className={styles.profesionalesChips}>
              {profesionales.map((profesional, idx) => {
                const iniciales =
                  `${profesional.nombre?.[0] ?? ''}${profesional.apellido?.[0] ?? ''}`.toUpperCase() ||
                  'P'
                const avatarColors = [
                  styles.avatarGreen,
                  styles.avatarBrown,
                  styles.avatarBlue,
                  styles.avatarPurple,
                ]
                const colorClass = avatarColors[idx % avatarColors.length]

                return (
                  <div key={profesional.id} className={styles.profesionalChip}>
                    <div className={`${styles.avatar} ${colorClass}`}>
                      {iniciales}
                    </div>
                    <span className={styles.profesionalNombre}>
                      {profesional.apellido}, {profesional.nombre}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className={styles.emptyProfesionales}>
              No hay profesionales asignados.
            </p>
          )}
        </div>

        <div className={styles.actions}>
          {puedeEditar && onEdit && (
            <Button
              variant="outline"
              leftIcon={<Pencil size={16} />}
              onClick={() => {
                onClose()
                onEdit(reunion)
              }}
            >
              Editar reunión
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
