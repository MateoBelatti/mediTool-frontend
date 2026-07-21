import React, { useState, useMemo } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePacientes } from '@/features/pacientes/hooks/usePacientes'
import { useInformesByProfesionalId } from '@/features/informes/hooks/useInformes'
import { InformesFilters } from '@/features/informes/components/InformesFilters/InformesFilters'
import {
  InformesGrid,
  type InformeWithPaciente,
} from '@/features/informes/components/InformesGrid/InformesGrid'
import { InformeFormModal } from '@/features/informes/components/InformeFormModal/InformeFormModal'
import styles from './InformesPage.module.css'

export const InformesPage = () => {
  const { user } = useAuth()
  const profesionalId = user?.id ? parseInt(user.id) : 0

  const { data: informesData, isLoading: isLoadingInformes } =
    useInformesByProfesionalId(profesionalId)
  const { pacientes } = usePacientes()

  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [pacienteSearch, setPacienteSearch] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [informeToEdit, setInformeToEdit] =
    useState<InformeWithPaciente | null>(null)

  // Enriquecer informes con datos del paciente
  const informes = useMemo(() => {
    if (!informesData || !pacientes)
      return informesData as InformeWithPaciente[]

    return informesData.map((informe) => {
      if (informe.pacienteId) {
        const paciente = pacientes.find((p) => p.id === informe.pacienteId)
        if (paciente) {
          return {
            ...informe,
            pacienteData: {
              nombre: paciente.nombre,
              apellido: paciente.apellido,
              dni: paciente.dni,
            },
          }
        }
      }
      return informe
    }) as InformeWithPaciente[]
  }, [informesData, pacientes])

  // Filtrado de servidor (fechas) - implementado localmente por simplicidad
  const informesFiltrados = useMemo(() => {
    if (!informes) return []
    let filtered = informes

    if (fechaDesde) {
      const desdeDate = new Date(fechaDesde)
      filtered = filtered.filter((i) => new Date(i.fecha) >= desdeDate)
    }

    if (fechaHasta) {
      const hastaDate = new Date(fechaHasta)
      filtered = filtered.filter((i) => new Date(i.fecha) <= hastaDate)
    }

    return filtered
  }, [informes, fechaDesde, fechaHasta])

  const handleNewInforme = () => {
    setInformeToEdit(null)
    setIsModalOpen(true)
  }

  const handleEditInforme = (informe: InformeWithPaciente) => {
    setInformeToEdit(informe)
    setIsModalOpen(true)
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <InformesFilters
          fechaDesde={fechaDesde}
          fechaHasta={fechaHasta}
          onFechaDesdeChange={setFechaDesde}
          onFechaHastaChange={setFechaHasta}
          pacienteSearch={pacienteSearch}
          onPacienteSearchChange={setPacienteSearch}
          onNewInformeClick={handleNewInforme}
        />

        <InformesGrid
          informes={informesFiltrados}
          isLoading={isLoadingInformes}
          onEditClick={handleEditInforme}
          pacienteSearch={pacienteSearch}
        />
      </div>

      <InformeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        informeToEdit={informeToEdit}
      />
    </div>
  )
}
