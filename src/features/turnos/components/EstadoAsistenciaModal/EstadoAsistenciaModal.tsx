import React, { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { X } from 'lucide-react'
import { type Turno, EstadoTurno } from '@/features/turnos/types/turnos.types'
import styles from './EstadoAsistenciaModal.module.css'

interface EstadoAsistenciaModalProps {
  isOpen: boolean
  onClose: () => void
  turno: Turno | null
  onSave: (
    estado: EstadoTurno,
    justificada?: boolean,
    observaciones?: string
  ) => void
}

interface EstadoAsistenciaFormProps {
  turno: Turno
  onClose: () => void
  onSave: (
    estado: EstadoTurno,
    justificada?: boolean,
    observaciones?: string
  ) => void
}

const EstadoAsistenciaForm: React.FC<EstadoAsistenciaFormProps> = ({
  turno,
  onClose,
  onSave,
}) => {
  const isAusenteInicial = turno.estado === EstadoTurno.Ausente
  const estadoInicial = isAusenteInicial
    ? EstadoTurno.Ausente
    : EstadoTurno.Presente

  const [selectedEstado, setSelectedEstado] =
    useState<EstadoTurno>(estadoInicial)
  const [justificada, setJustificada] = useState(turno.justificada ?? false)
  const [facturable, setFacturable] = useState<boolean>(() => {
    if (typeof turno.facturable === 'boolean') {
      return turno.facturable
    }
    return (
      estadoInicial === EstadoTurno.Presente || (turno.justificada ?? false)
    )
  })
  const [observaciones, setObservaciones] = useState(turno.observaciones || '')

  const handleEstadoChange = (nuevoEstado: EstadoTurno) => {
    setSelectedEstado(nuevoEstado)
    if (nuevoEstado === EstadoTurno.Presente) {
      setFacturable(true)
    } else {
      setFacturable(justificada)
    }
  }

  const handleJustificadaToggle = () => {
    const nuevoJustificada = !justificada
    setJustificada(nuevoJustificada)
    if (selectedEstado === EstadoTurno.Ausente) {
      setFacturable(nuevoJustificada)
    }
  }

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(
      selectedEstado,
      selectedEstado === EstadoTurno.Ausente ? justificada : false,
      observaciones.trim() ? observaciones.trim() : undefined
    )
  }

  const fechaTurno = new Date(turno.fechaHora)
  const diaTexto = format(fechaTurno, 'EEEE dd/MM', { locale: es })
  const diaCapitalizado = diaTexto.charAt(0).toUpperCase() + diaTexto.slice(1)
  const horaTexto = format(fechaTurno, 'HH:mm')

  const estadoTexto =
    turno.estado === EstadoTurno.Pendiente
      ? 'sin registrar'
      : turno.estado === EstadoTurno.Presente
        ? 'Presente'
        : turno.estado === EstadoTurno.Ausente
          ? turno.justificada
            ? 'Ausente (justificada)'
            : 'Ausente'
          : turno.estado

  const pacienteNombre = turno.paciente
    ? `${turno.paciente.nombre} ${turno.paciente.apellido}`
    : `Paciente #${turno.pacienteId}`

  return (
    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <h3 className={styles.pacienteTitle}>{pacienteNombre}</h3>
          <p className={styles.subtitle}>
            {diaCapitalizado} · {horaTexto} hs ·{' '}
            <span className={styles.estadoLabel}>{estadoTexto}</span>
          </p>
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSaveClick} className={styles.body}>
        <div className={styles.estadosRow}>
          <button
            type="button"
            className={`${styles.estadoBtn} ${
              selectedEstado === EstadoTurno.Presente
                ? styles.estadoBtnPresenteActive
                : ''
            }`}
            onClick={() => handleEstadoChange(EstadoTurno.Presente)}
          >
            Presente
          </button>
          <button
            type="button"
            className={`${styles.estadoBtn} ${
              selectedEstado === EstadoTurno.Ausente
                ? styles.estadoBtnAusenteActive
                : ''
            }`}
            onClick={() => handleEstadoChange(EstadoTurno.Ausente)}
          >
            Ausente
          </button>
        </div>

        <div className={styles.justificadaRow}>
          <button
            type="button"
            className={`${styles.justificadaBtn} ${
              justificada ? styles.justificadaBtnActive : ''
            }`}
            onClick={handleJustificadaToggle}
          >
            Justificada
          </button>
        </div>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={facturable}
            onChange={(e) => setFacturable(e.target.checked)}
            className={styles.checkboxInput}
          />
          <span>Facturable</span>
        </label>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Observaciones..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className={styles.observacionesInput}
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Guardar
        </button>
      </form>
    </div>
  )
}

export const EstadoAsistenciaModal: React.FC<EstadoAsistenciaModalProps> = ({
  isOpen,
  onClose,
  turno,
  onSave,
}) => {
  if (!isOpen || !turno) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <EstadoAsistenciaForm
        key={turno.id}
        turno={turno}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  )
}
