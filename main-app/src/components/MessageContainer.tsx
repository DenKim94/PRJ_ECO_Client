import styles from './MessageContainer.module.scss';

interface MessageContainerProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  isVisible?: boolean;
}

export const MessageContainer = ({ message, type = 'info', isVisible = true }: MessageContainerProps) => {
  if (!isVisible) return null;

  return (
    <div className={`${styles.messageContainer} ${styles[type]}`} role="alert">
        {message}
    </div>
  )
}