import { useAuth } from '../hooks/useAuth';
import { useIsMobile } from '../hooks/useIsMobile';
import { Logger } from '../utils/logger';
import { AppLogo } from './AppLogo';
import styles from './MenuSideBar.module.scss';

export default function MenuSideBar() {
    const logger = new Logger('MenuSideBar');
    const authService = useAuth();
    const isMobile = useIsMobile();

    return (
        <div className={styles.elementContainer}>
            <div className={styles.menuBarContainer}>
                <AppLogo src="/eco_app_v2.png" alt="ECO App Logo" size= {isMobile ? "m" : "xl"}/>
                <span>{'Platzhalter hier'}</span>
            </div>
            <div className={styles.divider}></div>
        </div>

    );
}