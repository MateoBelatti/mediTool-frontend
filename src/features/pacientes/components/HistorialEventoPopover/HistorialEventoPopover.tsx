import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  CalendarDays,
  ClipboardList,
  Clock,
  FileText,
  UserRound,
  X,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { HistorialEvento } from '../../types/historial.types'
import styles from './HistorialEventoPopover.module.css'

interface HistorialEventoPopoverProps {
  evento: HistorialEvento
  anchorRect: DOMRect
  onClose: () => void
}

const MARGEN = 12

const formatFecha = (fecha: string) => {
  if (fecha.length === 10) {
    const [year, month, day] = fecha.split('-')
    return `${day}/${month}/${year}`
  }

  return format(new Date(fecha), 'dd/MM/yyyy', { locale: es })
}

export const HistorialEventoPopover = ({
  evento,
  anchorRect,
  onClose,
}: HistorialEventoPopoverProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  const esTurno = Boolean(evento.turno)
  const profesional = evento.profesional ?? evento.turno?.profesional
  const fechaRef = esTurno
    ? (evento.turno?.fechaHora ?? evento.fechaHora)
    : (evento.informe?.fecha ?? evento.fechaHora)
  const hora =
    esTurno && evento.turno
      ? format(new Date(evento.turno.fechaHora), 'HH:mm', { locale: es })
      : null

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const { offsetWidth: width, offsetHeight: height } = el
    const maxLeft = vw - width - MARGEN
    const maxTop = vh - height - MARGEN

    const clampTop = (value: number) =>
      Math.max(MARGEN, Math.min(value, Math.max(MARGEN, maxTop)))

    const rightOfCard = anchorRect.right + MARGEN
    if (rightOfCard <= maxLeft) {
      setPos({ top: clampTop(anchorRect.top), left: rightOfCard })
      return
    }

    const leftOfCard = anchorRect.left - width - MARGEN
    if (leftOfCard >= MARGEN) {
      setPos({ top: clampTop(anchorRect.top), left: leftOfCard })
      return
    }

    const left = Math.max(MARGEN, Math.min(anchorRect.left, maxLeft))
    let top = anchorRect.bottom + MARGEN

    if (top > maxTop) {
      top = anchorRect.top - height - MARGEN
    }

    setPos({ top: clampTop(top), left })
  }, [anchorRect])

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null
      if (target && ref.current?.contains(target)) return
      if (target?.closest('[data-historial-card]')) return
      onClose()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const handleScroll = (e: Event) => {
      if (e.target instanceof Node && ref.current?.contains(e.target)) return
      onClose()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', onClose)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', onClose)
    }
  }, [onClose])

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-label={esTurno ? 'Detalle de la consulta' : 'Detalle del informe'}
      className={styles.popover}
      style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999 }}
    >
      <button
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Cerrar detalle"
      >
        <X size={16} />
      </button>

      <div className={styles.header}>
        <span
          className={`${styles.headerIcon} ${
            esTurno ? styles.iconTurno : styles.iconInforme
          }`}
        >
          {esTurno ? <CalendarDays size={16} /> : <FileText size={16} />}
        </span>
        <div className={styles.headerText}>
          <span className={styles.title}>
            {esTurno ? 'Consulta' : evento.informe?.tipo || 'Informe'}
          </span>
          <span className={styles.subtitle}>
            {formatFecha(fechaRef)}
            {hora ? ` · ${hora} hs` : ''}
          </span>
        </div>
      </div>

      <div className={styles.rows}>
        {esTurno && evento.turno && (
          <>
            <div className={styles.row}>
              <span className={styles.label}>
                <Clock size={13} /> Duración
              </span>
              <span className={styles.value}>
                {evento.turno.duracionMin} min
              </span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>
                <ClipboardList size={13} /> Estado
              </span>
              <span
                className={`${styles.statusBadge} ${
                  styles[evento.turno.estado.toLowerCase()] ?? ''
                }`}
              >
                {evento.turno.estado}
              </span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Asistencia</span>
              <span className={styles.value}>
                {evento.turno.justificada ? 'Justificada' : 'Sin justificar'}
                {' · '}
                {evento.turno.facturable ? 'Facturable' : 'No facturable'}
              </span>
            </div>
          </>
        )}

        <div className={styles.row}>
          <span className={styles.label}>
            <UserRound size={13} /> Profesional
          </span>
          <span className={styles.value}>
            {profesional
              ? `${profesional.nombre} ${profesional.apellido}`
              : 'No registrado'}
          </span>
        </div>

        {esTurno && evento.informe && (
          <div className={styles.row}>
            <span className={styles.label}>
              <FileText size={13} /> Informe
            </span>
            <span className={styles.value}>
              {evento.informe.tipo || 'Sin tipo'}
              {evento.informe.estado ? ` · ${evento.informe.estado}` : ''}
            </span>
          </div>
        )}

        {!esTurno && evento.informe && (
          <div className={styles.row}>
            <span className={styles.label}>
              <ClipboardList size={13} /> Estado
            </span>
            <span className={styles.value}>
              {evento.informe.estado || 'Sin estado'}
            </span>
          </div>
        )}

        {evento.turno?.observaciones && (
          <div className={styles.block}>
            <span className={styles.label}>Observaciones</span>
            <span className={styles.value}>{evento.turno.observaciones}</span>
          </div>
        )}

        {evento.informe?.contenido && (
          <div className={styles.block}>
            <span className={styles.label}>Contenido del informe</span>
            <span className={styles.value}>{evento.informe.contenido}</span>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
