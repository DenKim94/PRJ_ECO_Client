import styles from "./CustomButton.module.scss";

interface CustomButtonProps {
    onClickCallback?: () => void;
    isDisabled?: boolean;
    type?: "button" | "submit" | "reset";
    title: string;
}

export const CustomButton = ({ onClickCallback, isDisabled = false, type = "button", title }: CustomButtonProps) => {
  return (
    <button className={styles.customButton} 
            onClick={onClickCallback} 
            type={type} 
            disabled={isDisabled}>
        {title}
    </button>
  );
}
