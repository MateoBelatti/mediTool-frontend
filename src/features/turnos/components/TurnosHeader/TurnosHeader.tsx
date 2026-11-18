import styles from './TurnosHeader.module.css'

interface TurnosHeaderProps {
  activeTab: 'fijos' | 'sueltos'
  onTabChange: (tab: 'fijos' | 'sueltos') => void
}

export const TurnosHeader = ({ activeTab, onTabChange }: TurnosHeaderProps) => {
  return (
    <header className={styles.topHeader}>
      <h1 className={styles.title}>Turnos</h1>

      <div className={styles.modeTabs}>
        <button
          type="button"
          className={`${styles.modeTab} ${activeTab === 'fijos' ? styles.modeTabActive : ''}`}
          onClick={() => onTabChange('fijos')}
        >
          Turnos Fijos
        </button>
        <button
          type="button"
          className={`${styles.modeTab} ${activeTab === 'sueltos' ? styles.modeTabActive : ''}`}
          onClick={() => onTabChange('sueltos')}
        >
          Turnos Sueltos
        </button>
      </div>
    </header>
  )
}
