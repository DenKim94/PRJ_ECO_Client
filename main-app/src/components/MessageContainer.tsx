import styles from './MessageContainer.module.scss';

export interface MessageContainerProps {
  message: string;
  type?: 'error' | 'success' | 'info' | 'warning';
  isVisible?: boolean;
  sx?: React.CSSProperties;
}

export const MessageContainer = ({ message, type = 'info', isVisible = true, sx }: MessageContainerProps) => {
  if (!isVisible) return null;

  return (
    <div className={`${styles.messageContainer} ${styles[type]}`} role="alert" style={sx}>
        {message}
    </div>
  )
}