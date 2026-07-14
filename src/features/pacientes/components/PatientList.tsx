import React from 'react'
import type { Paciente } from '../types/paciente.types'
import styles from './PatientList.module.css'
import { User, Calendar, Phone, Mail } from 'lucide-react'

interface PatientListProps {
  pacientes: Paciente[]
  onEdit?: (paciente: Paciente) => void
  onVincular?: (pacienteId: number) => void
  isVinculando?: boolean
  modo: 'todos' | 'mis-pacientes'
}

export const PatientList: React.FC<PatientListProps> = ({
  pacientes,
  onEdit,
  onVincular,
  isVinculando,
  modo,
}) => {
  if (pacientes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <User size={48} className={styles.emptyIcon} />
        <p>No se encontraron pacientes.</p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {pacientes.map((paciente) => (
        <div key={paciente.id} className={styles.card}>
          <div className={styles.header}>
            <div className={styles.avatar}>
              {paciente.nombre.charAt(0)}
              {paciente.apellido.charAt(0)}
            </div>
            <div className={styles.info}>
              <h3>
                {paciente.nombre} {paciente.apellido}
              </h3>
              {paciente.dni && (
                <span className={styles.badge}>DNI: {paciente.dni}</span>
              )}
            </div>
          </div>

          <div className={styles.body}>
            {paciente.email && (
              <div className={styles.row}>
                <Mail size={16} />
                <span>{paciente.email}</span>
              </div>
            )}
            {paciente.telefono && (
              <div className={styles.row}>
                <Phone size={16} />
                <span>{paciente.telefono}</span>
              </div>
            )}
            {paciente.fechaNacimiento && (
              <div className={styles.row}>
                <Calendar size={16} />
                <span>{paciente.fechaNacimiento}</span>
              </div>
            )}
          </div>

          <div className={styles.footer}>
            {modo === 'mis-pacientes' && onEdit && (
              <button
                className={styles.editBtn}
                onClick={() => onEdit(paciente)}
              >
                Ver / Editar
              </button>
            )}

            {modo === 'todos' && onVincular && (
              <button
                className={styles.vincularBtn}
                onClick={() => onVincular(paciente.id)}
                disabled={isVinculando}
              >
                {isVinculando ? 'Vinculando...' : 'Vincular a mis pacientes'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
