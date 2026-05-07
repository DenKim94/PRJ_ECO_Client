import { useTheme } from "../hooks/useTheme";
import styles from "./InfoBox.module.scss";

interface InfoBoxProps {
    message: string;
    sx?: React.CSSProperties;
}

export const InfoBox = ({ message, sx }: InfoBoxProps) => {
    const themeObject = useTheme();
    const iconSrc = (themeObject.theme === 'light') ? '/info_icon_dark.svg' : '/info_icon_light.svg';

    return(
        <div className={styles.infoBox} style={sx}>
            <img src={iconSrc} 
                alt="Info-Icon" 
                width={28} 
                height={28} />
            <h4>{message}</h4>
        </div>
    )
};