import styles from "./DeleteAccountDialog.module.scss";
import { useAuth } from "../hooks/useAuth";
import { CustomButton } from "./CustomButton";
import { useTheme } from "../hooks/useTheme";
import { Logger } from "../utils/logger";
import { useNavigate } from "react-router";

export const DeleteAccountDialog = ({show}: {show: boolean}) => {
    const authService = useAuth();
    const themeObject = useTheme();
    const navigate = useNavigate();
    const logger = new Logger('DeleteAccountDialog');

    async function handleDeleteAccount(){
        const result = await authService.deleteAccount();

        if (authService.errorMsgRef.current?.message) {
            logger.error(`${authService.errorMsgRef.current.message}`);
            authService.setDeleteAccountRequested(false);
            return;

        } else {
            logger.debug(`${result.message}`);
            authService.setDeleteAccountRequested(false);
            setTimeout(() => {
                void navigate("/login", { replace: true });
            }, 2500);
        }
    }

    if (!show) return null;

    return (
        <div className={styles.dialogContainer}>
            <div className={styles.textContainer}>
                <img src={themeObject.theme === 'light' ? '/alert_icon_dark.svg' : '/alert_icon_light.svg'} 
                    alt="Achtung-Icon" 
                    width={40} 
                    height={40} />
                <p className={styles.dialogText}>{'Bist du sicher, dass du dein Konto löschen willst? Deine Daten werden dauerhaft entfernt.'}</p>
            </div>
            <div className={styles.buttonContainer}>
            <CustomButton   
                title="Löschen" 
                type="button"
                onClickCallback={() => void handleDeleteAccount()} 
                isDisabled={authService.isLoading}
                sx={{color:'white'}}
            />
            <CustomButton 
                title="Abbrechen" 
                type="button"
                onClickCallback={() => {authService.setDeleteAccountRequested(false);}} 
                isDisabled={authService.isLoading}
                sx={{backgroundColor:'var(--color-logout-button)', color:'white'}}
            />
            </div>
        </div>
    );
}