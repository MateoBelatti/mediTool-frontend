import { useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { Download, Eye, FileText, Trash2, Upload } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/shared/components/Button/Button'
import { Modal } from '@/shared/components/Modal/Modal'
import type { DocumentoPaciente } from '../../types/documento.types'
import styles from './DocumentManager.module.css'

const MAX_ARCHIVO_BYTES = 10 * 1024 * 1024
const EXTENSIONES_PERMITIDAS = ['.pdf', '.doc', '.docx']

interface DocumentManagerProps {
  documentos: DocumentoPaciente[]
  isLoading?: boolean
  isUploading?: boolean
  isDeleting?: boolean
  errorMessage?: string | null
  onUpload: (archivo: File) => void
  onDelete: (documento: DocumentoPaciente) => void
  onPreview: (documento: DocumentoPaciente) => void
  onDownload: (documento: DocumentoPaciente) => void
  emptyMessage?: string
}

const formatTamano = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatFecha = (fecha: string) => {
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return 'Fecha desconocida'
  return format(date, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })
}

const obtenerExtension = (nombre: string) => {
  const indice = nombre.lastIndexOf('.')
  return indice >= 0 ? nombre.slice(indice).toLowerCase() : ''
}

export const DocumentManager = ({
  documentos,
  isLoading = false,
  isUploading = false,
  isDeleting = false,
  errorMessage,
  onUpload,
  onDelete,
  onPreview,
  onDownload,
  emptyMessage = 'Todavía no hay documentos cargados.',
}: DocumentManagerProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [documentoAEliminar, setDocumentoAEliminar] =
    useState<DocumentoPaciente | null>(null)

  const seleccionarArchivo = (archivo?: File) => {
    if (!archivo) return

    const extension = obtenerExtension(archivo.name)
    if (!EXTENSIONES_PERMITIDAS.includes(extension)) {
      setError('Solo se permiten archivos PDF o Word (.doc, .docx).')
      return
    }

    if (archivo.size > MAX_ARCHIVO_BYTES) {
      setError('El archivo supera el tamaño máximo permitido de 10 MB.')
      return
    }

    setError(null)
    onUpload(archivo)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    if (isUploading) return
    seleccionarArchivo(event.dataTransfer.files[0])
  }

  const confirmarEliminacion = () => {
    if (!documentoAEliminar) return
    onDelete(documentoAEliminar)
    setDocumentoAEliminar(null)
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ''} ${isUploading ? styles.disabled : ''}`}
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          if (!isUploading) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            if (!isUploading) inputRef.current?.click()
          }
        }}
      >
        <div className={styles.dropzoneIcon}>
          {isUploading ? (
            <span className={styles.spinner} />
          ) : (
            <Upload size={24} />
          )}
        </div>
        <div className={styles.dropzoneText}>
          <strong>
            {isUploading ? 'Subiendo documento...' : 'Subir documento'}
          </strong>
          <span>PDF o Word (.doc, .docx) · máximo 10 MB</span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          disabled={isUploading}
          onClick={(event) => {
            event.stopPropagation()
            inputRef.current?.click()
          }}
        >
          Elegir archivo
        </Button>
        <input
          ref={inputRef}
          className={styles.hiddenInput}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          disabled={isUploading}
          onChange={(event) => {
            seleccionarArchivo(event.target.files?.[0])
            event.target.value = ''
          }}
        />
      </div>

      {(error || errorMessage) && (
        <p className={styles.error} role="alert">
          {error || errorMessage}
        </p>
      )}

      {isLoading ? (
        <p className={styles.state}>Cargando documentos...</p>
      ) : documentos.length === 0 ? (
        <div className={styles.empty}>
          <FileText size={40} />
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {documentos.map((documento) => (
            <li key={documento.id} className={styles.item}>
              <div className={styles.fileIcon}>
                <FileText size={22} />
              </div>

              <div className={styles.info}>
                <div className={styles.nameRow}>
                  <span
                    className={styles.name}
                    title={documento.nombreOriginal}
                  >
                    {documento.nombreOriginal}
                  </span>
                  <span className={styles.badge}>
                    {documento.extension.replace('.', '').toUpperCase()}
                  </span>
                </div>
                <div className={styles.meta}>
                  <span>{formatFecha(documento.fechaSubida)}</span>
                  <span className={styles.separator}>·</span>
                  <span>{documento.profesionalNombre || 'Profesional'}</span>
                  <span className={styles.separator}>·</span>
                  <span>{formatTamano(documento.tamanoBytes)}</span>
                </div>
              </div>

              <div className={styles.actions}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPreview(documento)}
                  leftIcon={<Eye size={16} />}
                >
                  Previsualizar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload(documento)}
                  leftIcon={<Download size={16} />}
                >
                  Descargar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDocumentoAEliminar(documento)}
                  leftIcon={<Trash2 size={16} />}
                >
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={documentoAEliminar !== null}
        onClose={() => setDocumentoAEliminar(null)}
        title="Eliminar documento"
      >
        <div className={styles.confirm}>
          <p>
            ¿Seguro que querés eliminar{' '}
            <strong>{documentoAEliminar?.nombreOriginal}</strong>? Esta acción
            no se puede deshacer.
          </p>
          <div className={styles.confirmActions}>
            <Button
              variant="secondary"
              onClick={() => setDocumentoAEliminar(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmarEliminacion}
              isLoading={isDeleting}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
