import { useEffect, useRef, useState } from 'react'
import { DocumentManager } from '../DocumentManager/DocumentManager'
import { DocumentoPreviewModal } from '../DocumentoPreviewModal/DocumentoPreviewModal'
import {
  useDeleteDocumento,
  useDocumentosPaciente,
  useUploadDocumento,
} from '../../hooks/useDocumentos'
import { documentosService } from '../../services/documento.service'
import type { DocumentoPaciente } from '../../types/documento.types'

interface DocumentosPacienteProps {
  pacienteId: number
}

const descargarBlob = (blob: Blob, nombreArchivo: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nombreArchivo
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export const DocumentosPaciente = ({ pacienteId }: DocumentosPacienteProps) => {
  const { data, isLoading, error } = useDocumentosPaciente(pacienteId)
  const upload = useUploadDocumento(pacienteId)
  const remove = useDeleteDocumento(pacienteId)
  const [actionError, setActionError] = useState<string | null>(null)
  const [documentoPreview, setDocumentoPreview] =
    useState<DocumentoPaciente | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const previewRequestRef = useRef(0)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleUpload = (archivo: File) => {
    setActionError(null)
    upload.mutate(archivo, {
      onError: () => setActionError('No se pudo subir el documento.'),
    })
  }

  const handleDelete = (documento: DocumentoPaciente) => {
    setActionError(null)
    remove.mutate(documento.id, {
      onError: () => setActionError('No se pudo eliminar el documento.'),
    })
  }

  const cerrarPreview = () => {
    previewRequestRef.current += 1
    setDocumentoPreview(null)
    setPreviewUrl(null)
    setIsLoadingPreview(false)
    setPreviewError(null)
  }

  const handlePreview = async (documento: DocumentoPaciente) => {
    const requestId = ++previewRequestRef.current

    setActionError(null)
    setPreviewError(null)
    setDocumentoPreview(documento)
    setPreviewUrl(null)

    if (documento.extension !== '.pdf') {
      setIsLoadingPreview(false)
      return
    }

    setIsLoadingPreview(true)

    try {
      const blob = await documentosService.descargar(pacienteId, documento.id)
      if (previewRequestRef.current !== requestId) return
      setPreviewUrl(URL.createObjectURL(blob))
    } catch {
      if (previewRequestRef.current === requestId) {
        setPreviewError('No se pudo cargar la previsualización.')
      }
    } finally {
      if (previewRequestRef.current === requestId) {
        setIsLoadingPreview(false)
      }
    }
  }

  const descargarDocumento = async (documento: DocumentoPaciente) => {
    const blob = await documentosService.descargar(pacienteId, documento.id)
    descargarBlob(blob, documento.nombreOriginal)
  }

  const handleDownload = async (documento: DocumentoPaciente) => {
    setActionError(null)

    try {
      await descargarDocumento(documento)
    } catch {
      setActionError('No se pudo descargar el documento.')
    }
  }

  const handleDownloadPreview = async () => {
    if (!documentoPreview) return

    setPreviewError(null)

    try {
      await descargarDocumento(documentoPreview)
    } catch {
      setPreviewError('No se pudo descargar el documento.')
    }
  }

  const errorMessage =
    actionError ?? (error ? 'No se pudieron cargar los documentos.' : null)

  return (
    <>
      <DocumentManager
        documentos={data ?? []}
        isLoading={isLoading}
        isUploading={upload.isPending}
        isDeleting={remove.isPending}
        errorMessage={errorMessage}
        onUpload={handleUpload}
        onDelete={handleDelete}
        onPreview={handlePreview}
        onDownload={handleDownload}
      />
      <DocumentoPreviewModal
        documento={documentoPreview}
        previewUrl={previewUrl}
        isLoading={isLoadingPreview}
        errorMessage={previewError}
        onClose={cerrarPreview}
        onDownload={handleDownloadPreview}
      />
    </>
  )
}
