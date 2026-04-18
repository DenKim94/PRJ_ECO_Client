import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useIsMobile } from '../hooks/useIsMobile';
import { Logger } from '../utils/logger';
import { AppLogo } from './AppLogo';
import styles from './MenuSideBar.module.scss';
import { useTheme } from '../hooks/useTheme';


export default function MenuSideBar() {
    const logger = new Logger('MenuSideBar');
    const navigate = useNavigate();
    const authService = useAuth();
    const isMobile = useIsMobile();
    const themeObject = useTheme();

    async function handleLogout(): Promise<void> {
        logger.debug('Logout angefordert.');
        const result = await authService.logout();

        if (authService.errorMsgRef.current?.message) {
            logger.error(`${authService.errorMsgRef.current.message}`);
            return;
        } else {
            logger.debug(`${result.message}`);
            setTimeout(() => {
                logger.debug('Umleitung zum Login ...');
                void navigate('/login', { replace: true });
            }, 1000);
        }
    }

    return (
        <div className={styles.elementContainer}>
            <div className={styles.menuBarContainer}>
                <AppLogo src='/eco_app_v2.png' alt='ECO App Logo' size= {isMobile ? 'm' : 'xl'}/>
                <nav className={styles.menuItemsContainer}>
                    <NavLink 
                    to="/dashboard" 
                    end 
                    className={({ isActive }) => 
                        isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
                    }>
                        <img
                            src={themeObject.theme === 'light' ? '/home_icon_dark.svg' : '/home_icon_light.svg'}
                            alt={'Icon für die Übersichtsseite'}
                            width={24}
                            height={24}
                        />
                        <span>{'Übersicht'}</span>
                    </NavLink>
                    <NavLink 
                    to="/dashboard/data" 
                    className={({ isActive }) => 
                        isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
                    }>
                        <img
                            src={themeObject.theme === 'light' ? '/data_table_icon_dark.svg' : '/data_table_icon_light.svg'}
                            alt={'Icon für die Datenseite'}
                            width={24}
                            height={24}
                        />
                        <span>{'Daten'}</span>
                    </NavLink>
                    <NavLink 
                    to="/dashboard/calculation" 
                    className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
                    }>
                        <img src={themeObject.theme === 'light' ? '/chart_data_icon_dark.svg' : '/chart_data_icon_light.svg'} alt="Diagramme" width={24} height={24} />
                        <span className={styles.label}>{'Analysen'}</span>
                    </NavLink>
                    <NavLink 
                    to="/dashboard/settings" 
                    className={({ isActive }) => 
                        isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
                    }>
                        <img
                            src={themeObject.theme === 'light' ? '/settings_icon_dark.svg' : '/settings_icon_light.svg'}
                            alt={'Icon für die Einstellungen'}
                            width={24}
                            height={24}
                        />
                        <span>{'Einstellungen'}</span>
                    </NavLink>

                    {/* Nur der Admin sieht diesen Menüpunkt */}
                    {authService.userDetailedData?.role === 'ADMIN' && (
                        <NavLink 
                        to="/dashboard/admin"
                        className={({ isActive }) => 
                        isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
                        }>
                            <img
                                src={themeObject.theme === 'light' ? '/manage_accounts_icon_dark.svg' : '/manage_accounts_icon_light.svg'}
                                alt={'Icon für die Nutzerverwaltung (Admin-Only)'}
                                width={24}
                                height={24}
                            />
                            <span>{'Nutzerverwaltung'}</span>
                        </NavLink>
                    )}
                </nav>
                        <button
                            type='button'
                            className={styles.logoutButton}
                            onClick={() => void handleLogout()}
                            aria-label={'Logout'}
                            disabled={authService.isLoading}
                        >
                            <img
                                src={'/logout_icon_light.png'}
                                alt={'Button zum Logout'}
                                width={24}
                                height={24}
                            />
                            <span>{'Abmelden'}</span>
                        </button>
            </div>
            <div className={styles.divider}></div>
        </div>
    );
}