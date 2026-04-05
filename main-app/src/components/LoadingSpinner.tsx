import styles from "./LoadingSpinner.module.scss";

export const LoadingSpinner = ({isActive, message, sxContainer, sxSpinner} : {
  isActive: boolean, 
  message: string, 
  sxContainer?: React.CSSProperties,
  sxSpinner?: React.CSSProperties,
}) => {

    if (!isActive) return null;

  return (
    <div className={styles.spinnerContainer} style={sxContainer}>
        <div 
          className={styles.spinner} 
          role="status" 
          aria-label="Inhalt wird geladen..."
          aria-live="polite"
          style={sxSpinner}
        />
        <p className={styles.spinnerMessage}>{message}</p>
    </div>
  );
};