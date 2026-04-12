import styles from "./CustomButton.module.scss";

interface IconProps {
    iconSrc: string;
    size?: number;
    alt?: string;
    ariaLabel?: string;
    sx?: React.CSSProperties;
}

interface CustomButtonProps {
    onClickCallback?: () => void | Promise<void>;
    isDisabled?: boolean;
    type?: "button" | "submit" | "reset";
    title: string;
    iconProps?: IconProps | null;
    sx?: React.CSSProperties;
}

export const CustomButton = ({ 
    onClickCallback, 
    isDisabled = false, 
    type = "button", 
    title,
    iconProps = null, 
    sx }: CustomButtonProps) => {

  // Eigener Handler, um den Event-Flow sauber abzufangen
  const handleClick = () => {
      if (onClickCallback) {
          void onClickCallback();
      }
  };

  return (
    <div className={styles.buttonContainer}>
     {iconProps && 
        <img 
            src={iconProps.iconSrc} 
            alt={iconProps.alt ?? 'Button-Icon'}  
            width={iconProps.size ?? 24}
            height={iconProps.size ?? 24} 
            className={styles.icon}
            aria-label={iconProps.ariaLabel ?? ''}
            style={sx}
        />}   
        <button className={styles.customButton} 
                onClick={handleClick} 
                type={type} 
                disabled={isDisabled}
                style={sx}>
            {title}
        </button>
    </div>
  );
}
