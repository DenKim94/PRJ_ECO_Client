import styles from "./PopUp.module.scss";
import { useEffect, useState } from 'react';

export type PopUpMessageTypes = 'success' | 'error' | 'info' | 'warning';

export interface PopUpProps {
    isActive: boolean;
    type: PopUpMessageTypes;
    duration?: number; // Optional, Zeit in ms bis zum automatischen Schließen
    message: string;
    sx?: React.CSSProperties;
};

export const PopUp = ({isActive, type, duration=6000, message, sx} : PopUpProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => setIsClosing(true), duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (!isActive || isUnmounted) return null;

  return (
    <div 
      className={`
        ${styles.popUp} 
        ${styles[type]} 
        ${isClosing ? styles.isClosing : ''}
      `}
      style={sx}
      role="alert"
      onAnimationEnd={() => isClosing && setIsUnmounted(true)}
    >
      <div className={styles.content}>
        {message}
      </div>
      <button 
        className={styles.closeBtn} 
        onClick={() => setIsClosing(true)} 
        aria-label="Schließen"
      >
        ×
      </button>
    </div>
  );
};