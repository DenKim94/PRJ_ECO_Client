import { useAuth } from "../hooks/useAuth";
import { useConfig } from "../hooks/useConfig";
import { useTheme } from "../hooks/useTheme";
import styles from "./Settings.module.scss";

export default function Settings() {
    const authService = useAuth();
    const themeObject = useTheme();
    const configService = useConfig();

    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }
    return (
        <div className={styles.settingsContainer}>
            <div className={styles.infoBox}>
                <img src={themeObject.theme === 'light' ? '/info_icon_dark.svg' : '/info_icon_light.svg'} 
                    alt="Info-Icon" 
                    width={28} 
                    height={28} />
                <h4>{'Hier können die spezifischen Konfigurationsparameter für die Kostenberechnung angepasst werden.'}</h4>
            </div>
            {/* TODO [19.04.2026]: Parameter als Input-Elemente implementieren */}
        </div>
    );
}