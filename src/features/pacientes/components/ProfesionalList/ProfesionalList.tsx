import { IdCard, Mail, Phone, Stethoscope } from 'lucide-react'
import type { Profesional } from '../../types/profesional.types'
import styles from './ProfesionalList.module.css'

interface ProfesionalListProps {
  profesionales: Profesional[]
}

export const ProfesionalList = ({ profesionales }: ProfesionalListProps) => {
  if (profesionales.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Stethoscope size={48} className={styles.emptyIcon} />
        <p>Todavía no hay profesionales cargados</p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {profesionales.map((profesional) => (
        <article key={profesional.id} className={styles.card}>
          <div className={styles.header}>
            <div className={styles.avatar} aria-hidden="true">
              {profesional.nombre.charAt(0)}
              {profesional.apellido.charAt(0)}
            </div>
            <div className={styles.info}>
              <h3>
                {profesional.nombre} {profesional.apellido}
              </h3>
              {profesional.matricula && (
                <span className={styles.badge}>
                  Matrícula: {profesional.matricula}
                </span>
              )}
            </div>
          </div>

          <div className={styles.body}>
            {profesional.prestacion && (
              <div className={styles.row}>
                <Stethoscope size={16} />
                <span>{profesional.prestacion}</span>
              </div>
            )}
            {profesional.email && (
              <div className={styles.row}>
                <Mail size={16} />
                <span>{profesional.email}</span>
              </div>
            )}
            {profesional.telefono && (
              <div className={styles.row}>
                <Phone size={16} />
                <span>{profesional.telefono}</span>
              </div>
            )}
            {profesional.registroPrestadores && (
              <div className={styles.row}>
                <IdCard size={16} />
                <span>Registro: {profesional.registroPrestadores}</span>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
