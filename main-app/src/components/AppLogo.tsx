// src/components/Logo.tsx
import React from 'react';
import styles from './AppLogo.module.scss';

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
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={styles.logo}
      />
    </div>
  )
};
