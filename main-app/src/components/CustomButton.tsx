import styles from "./CustomButton.module.scss";

interface CustomButtonProps {
    onClickCallback?: () => void | Promise<void>;
    isDisabled?: boolean;
    type?: "button" | "submit" | "reset";
    title: string;
    sx?: React.CSSProperties;
}

export const CustomButton = ({ onClickCallback, isDisabled = false, type = "button", title, sx }: CustomButtonProps) => {
  // Eigener Handler, um den Event-Flow sauber abzufangen
  const handleClick = () => {
      if (onClickCallback) {
          void onClickCallback();
      }
  };

  return (
    <button className={styles.customButton} 
            onClick={handleClick} 
            type={type} 
            disabled={isDisabled}
            style={sx}>
        {title}
    </button>
  );
}
