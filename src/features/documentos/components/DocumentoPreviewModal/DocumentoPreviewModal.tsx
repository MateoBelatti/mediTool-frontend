import { Download, FileText } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { Modal } from '@/shared/components/Modal/Modal'
import type { DocumentoPaciente } from '../../types/documento.types'
import styles from './DocumentoPreviewModal.module.css'

interface DocumentoPreviewModalProps {
  documento: DocumentoPaciente | null
  previewUrl: string | null
  isLoading: boolean
  errorMessage: string | null
  onClose: () => void
  onDownload: () => void
}

export const DocumentoPreviewModal = ({
  documento,
  previewUrl,
  isLoading,
  errorMessage,
  onClose,
  onDownload,
}: DocumentoPreviewModalProps) => {
  const esPdf = documento?.extension === '.pdf'

  return (
    <Modal
      isOpen={documento !== null}
      onClose={onClose}
      title={
        documento
          ? `Previsualización: ${documento.nombreOriginal}`
          : 'Previsualización'
      }
      size="lg"
    >
      {documento && (
        <div className={styles.container}>
          {esPdf ? (
            isLoading ? (
              <div className={styles.state}>
                <span className={styles.spinner} />
                <p>Cargando previsualización...</p>
              </div>
            ) : previewUrl ? (
              <iframe
                className={styles.frame}
                src={previewUrl}
                title={`Previsualización de ${documento.nombreOriginal}`}
              />
            ) : (
              <div className={styles.state}>
                <FileText size={40} />
                <p>
                  {errorMessage ?? 'No se pudo cargar la previsualización.'}
                </p>
              </div>
            )
          ) : (
            <div className={styles.state}>
              <FileText size={40} />
              <p>
                La previsualización de Word no está disponible en el navegador.
              </p>
              <span>Podés descargar el archivo para verlo.</span>
            </div>
          )}

          {errorMessage && (esPdf ? previewUrl : true) && (
            <p className={styles.error} role="alert">
              {errorMessage}
            </p>
          )}

          <div className={styles.actions}>
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
            <Button onClick={onDownload} leftIcon={<Download size={16} />}>
              Descargar
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
