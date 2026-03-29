import styles from "./LoadingSpinner.module.scss";

export const LoadingSpinner = ({isActive, message} : {isActive: boolean, message: string}) => {
    if (!isActive) return null;

  return (
    <div className={styles.spinnerContainer}>
        <div 
        className={styles.spinner} 
        // Wichtige Attribute für Barrierefreiheit (Screenreader)
        role="status" 
        aria-label="Inhalt wird geladen..."
        aria-live="polite"
        />
        <p className={styles.spinnerMessage}>{message}</p>
    </div>
  );
};