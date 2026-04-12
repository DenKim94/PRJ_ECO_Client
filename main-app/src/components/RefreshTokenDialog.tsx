import styles from "./RefreshTokenDialog.module.scss";
import { useAuth } from "../hooks/useAuth";
import { CustomButton } from "./CustomButton";
import { useTheme } from "../hooks/useTheme";

export const RefreshTokenDialog = ({show}: {show: boolean}) => {
    const authService = useAuth();
    const themeObject = useTheme();
    const iconSrc = themeObject.theme === 'light' ? '/refresh_icon_dark.svg' : '/refresh_icon_light.svg';

    if (!show) return null;

    const refreshToken = async () => {
        await authService.refreshToken();
    }

    // TODO: Style Properties angpassen & Dialog wieder ausblenden
    return (
        <div className={styles.dialogContainer}>
            <p className={styles.dialogText}>{'Deine Session läuft gleich ab und du wirst automatisch abgemeldet. Klicke auf den Button, um die Session zu verlängern.'}</p>
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