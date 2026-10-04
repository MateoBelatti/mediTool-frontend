import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { Paciente } from '../types/paciente.types'
import styles from './PatientList.module.css'
import { User, Calendar, Phone, Mail } from 'lucide-react'

interface PatientListProps {
  pacientes: Paciente[]
  onEdit?: (paciente: Paciente) => void
  isAdmin?: boolean
}

export const PatientList: React.FC<PatientListProps> = ({
  pacientes,
  onEdit,
  isAdmin,
}) => {
  const navigate = useNavigate()

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
            <button
              className={styles.editBtn}
              onClick={() => navigate(`/pacientes/${paciente.id}`)}
              style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#0f172a' }}
            >
              Ver Perfil
            </button>

            {isAdmin && onEdit && (
              <button
                className={styles.editBtn}
                onClick={() => onEdit(paciente)}
              >
                Administrar
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
