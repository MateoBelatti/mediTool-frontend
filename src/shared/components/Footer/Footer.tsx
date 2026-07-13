import React from 'react'
import styles from './Footer.module.css'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          &copy; {currentYear} MediTool. All rights reserved.
        </p>
        <p className={styles.credits}>
          Created by <span className={styles.author}>Swer17</span>
        </p>
      </div>
    </footer>
  )
}
