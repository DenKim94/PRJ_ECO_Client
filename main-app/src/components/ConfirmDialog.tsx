import styles from "./ConfirmDialog.module.scss";
import { CustomButton } from "./CustomButton";
import { useTheme } from "../hooks/useTheme";


export interface DialogProps {
    show: boolean,
    text: string,
    callbackConfirm: () => void | Promise<void>, 
    callbackCancel: () => void | Promise<void>
}

export const ConfirmDialog = ({show, text, callbackConfirm, callbackCancel}: DialogProps) => {
    const themeObject = useTheme();

    if (!show) return null;

    return (
        <div className={styles.dialogContainer}>
            <div className={styles.textContainer}>
                <img src={themeObject.theme === 'light' ? '/alert_icon_dark.svg' : '/alert_icon_light.svg'} 
                    alt="Achtung-Icon" 
                    width={40} 
                    height={40} />
                <p className={styles.dialogText}>{text}</p>
            </div>
            <div className={styles.buttonContainer}>
                <CustomButton   
                    title="Bestätigen" 
                    type="button"
                    onClickCallback={callbackConfirm} 
                    sx={{marginTop:'0px', color:'white'}}
                />
                
                <CustomButton 
                    title="Abbrechen" 
                    type="button"
                    onClickCallback={callbackCancel} 
                    sx={{marginTop:'0px', color:'white', backgroundColor:'var(--color-logout-button)'}}
                />
            </div>
        </div>
    );
}