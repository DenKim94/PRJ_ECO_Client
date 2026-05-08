// src/components/Logo.tsx
import React from 'react';
import styles from './AppLogo.module.scss';

const gitHubRepoUrl = 'https://github.com/DenKim94/PRJ_ECO_Client';

type LogoSize = 'xs' | 's' | 'm' | 'l' | 'xl';

interface LogoProps{
  src: string;          // Pfad oder importiertes Bild
  alt?: string;
  size?: LogoSize;      // Standard: 'md'
};

const sizeMap: Record<LogoSize, { width: number; height: number }> = {
  xs: { width: 24, height: 24 },  
  s: { width: 32, height: 32 },
  m: { width: 46, height: 46 },
  l: { width: 84, height: 84 },
  xl: { width: 120, height: 120 },
};

export const AppLogo: React.FC<LogoProps> = ({
  src,
  alt = 'App-Logo',
  size = 'm',
}) => {
  const { width, height } = sizeMap[size];

  return (
    <div className={styles.logoContainer}>
      <a 
        href={gitHubRepoUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Zum GitHub Repository" // Gut für die Barrierefreiheit (Screenreader)
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={styles.logo}
        />
      </a>
    </div>
  )
};
