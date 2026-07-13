import React, { InputHTMLAttributes } from 'react'
import styles from './InputField.module.css'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`

    return (
      <div className={`${styles.container} ${className || ''}`}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          {...props}
        />
        {/* Espacio preparado para mostrar errores futuros */}
        <div className={styles.errorContainer}>
          {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
      </div>
    )
  }
)

InputField.displayName = 'InputField'
