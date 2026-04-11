import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useIsMobile } from '../hooks/useIsMobile';
import { Logger } from '../utils/logger';
import { AppLogo } from './AppLogo';
import styles from './MenuSideBar.module.scss';


export default function MenuSideBar() {
    const logger = new Logger('MenuSideBar');
    const navigate = useNavigate();
    const authService = useAuth();
    const isMobile = useIsMobile();

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
                    <NavLink to="/dashboard" end>{'Übersicht'}</NavLink>
                    <NavLink to="/dashboard/data">{'Daten'}</NavLink>
                    <NavLink to="/dashboard/settings">{'Einstellungen'}</NavLink>

                    {/* Nur Admins sehen diesen Menüpunkt */}
                    {authService.userDetailedData?.role === 'ADMIN' && (
                        <NavLink to="/dashboard/admin">{'Admin-Bereich'}</NavLink>
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