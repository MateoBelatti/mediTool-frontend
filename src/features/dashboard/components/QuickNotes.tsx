import { useState } from 'react'
import { StickyNote } from 'lucide-react'
import styles from './QuickNotes.module.css'

const NOTES_STORAGE_KEY = 'mediTool_quickNotes'

export const QuickNotes = () => {
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem(NOTES_STORAGE_KEY) || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value
    setNotes(newNotes)
    localStorage.setItem(NOTES_STORAGE_KEY, newNotes)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StickyNote size={20} className={styles.icon} />
        <h3>Notas Rápidas</h3>
      </div>
      <textarea
        className={styles.textarea}
        value={notes}
        onChange={handleChange}
        placeholder="Escribe recordatorios o notas rápidas aquí... (Se guardan automáticamente)"
      />
    </div>
  )
}
