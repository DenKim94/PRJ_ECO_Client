import styles from "./IconButton.module.scss";

interface IconProps {
    iconSrc: string;
    size?: number;
    alt?: string;
    ariaLabel?: string;
    sx?: React.CSSProperties;
}

interface IconButtonProps {
    onClickCallback?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
    isDisabled?: boolean;
    type?: "button" | "submit" | "reset";
    iconProps: IconProps | null;
    sx?: React.CSSProperties;
}

export const IconButton = ({ 
    onClickCallback, 
    isDisabled = false, 
    type = "button", 
    iconProps = null, 
    sx }: IconButtonProps) => {

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClickCallback) {
          void onClickCallback(e);
      }
  };

  return (
    <button className={styles.iconButton} 
            onClick={handleClick} 
            type={type}
            disabled={isDisabled}
            style={sx}>
        {iconProps && 
        <img 
            src={iconProps.iconSrc} 
            alt={iconProps.alt ?? 'Button-Icon'}  
            width={iconProps.size ?? 12}
            height={iconProps.size ?? 12} 
            className={styles.icon}
            aria-label={iconProps.ariaLabel ?? ''}
        />}                      
    </button>
  );
}
