import styles from "./RefreshTokenDialog.module.scss";
import { useAuth } from "../hooks/useAuth";
import { CustomButton } from "./CustomButton";
import { useTheme } from "../hooks/useTheme";
import { Logger } from "../utils/logger";

export const RefreshTokenDialog = ({show}: {show: boolean}) => {
    const authService = useAuth();
    const themeObject = useTheme();
    const logger = new Logger('RefreshTokenDialog');
    const iconSrc = themeObject.theme === 'light' ? '/refresh_icon_dark.svg' : '/refresh_icon_light.svg';

    if (!show) return null;

    const refreshToken = async () => {
        logger.debug('Aktualisiere Session ... ');
        const refreshDone = await authService.refreshToken();
        if (!refreshDone || authService.errorMsgRef.current?.message) {
            logger.error(`${authService.errorMsgRef.current?.message}`);
            return;
        }else{
            logger.debug('Session erfolgreich aktualisiert.', authService.userDetailedData);
        }
    }

    return (
        <div className={styles.dialogContainer}>
            <div className={styles.textContainer}>
                <img src={themeObject.theme === 'light' ? '/alert_icon_dark.svg' : '/alert_icon_light.svg'} 
                    alt="Achtung-Icon" 
                    width={40} 
                    height={40} />
                <p className={styles.dialogText}>{`Deine Sitzung läuft in ${authService.sessionTimeRemaining.current} Sekunden ab und du wirst automatisch abgemeldet. Klicke auf den Button, um die Sitzung zu verlängern.`}</p>
            </div>
            
            <CustomButton
                iconProps={{iconSrc: iconSrc, size: 24, alt: 'Icon - Session verlängern', ariaLabel: 'Icon - Session verlängern'}}   
                title="Session verlängern" 
                type="button"
                onClickCallback={refreshToken} 
                isDisabled={authService.isLoading}
                sx={{marginTop: '0px'}} 
            />
        </div>
    );
}