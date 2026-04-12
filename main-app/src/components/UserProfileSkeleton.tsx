import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useIsMobile } from "../hooks/useIsMobile";
import styles from "./UserProfileSkeleton.module.scss";
import { useTheme } from "../hooks/useTheme";

export default function UserProfileSkeleton() {
    const authService = useAuth();
    const isMobile = useIsMobile();
    // State für das Dropdown-Menü
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const themeObject = useTheme();
    
    const iconSrcLightMode = authService.userDetailedData?.role === 'ADMIN' ? '/admin_icon_dark.svg' : '/account_circle_icon_dark.svg';
    const iconSrcDarkMode = authService.userDetailedData?.role === 'ADMIN' ? '/admin_icon_light.svg' : '/account_circle_icon_light.svg';

    // Toggle-Funktion für den Klick auf das Profil-Icon
    const toggleMenu = () => {
        if (isMobile) {
            setIsMenuOpen(prev => !prev);
        }
    };

    const openSettings = () => {
        console.log('Platzhalter: Einstellungen angeklickt');
        setIsMenuOpen(false);
    };

    return (
        <div className={styles.userNameContainer}>
            <button 
                className={styles.skeletonCircle}
                aria-label='Profilmenü öffnen'
                onClick={toggleMenu}
                disabled={!isMobile} // Auf der Desktop-Ansicht bleibt der Button inaktiv
            >
                <img 
                    src={themeObject.theme === 'light' ? iconSrcLightMode : iconSrcDarkMode}
                    alt='Profil-Icon' 
                    width={28}
                    height={28}
                />
            </button>

            {/* Desktop Ansicht: Nur der Name */}
            {!isMobile && (
                <span className={styles.userName}>{authService.user?.name}</span>
            )}

            {/* Mobile Ansicht: Dropdown-Menü, wenn geöffnet */}
            {isMobile && isMenuOpen && (
                <div className={styles.dropdownMenu}>
                    <span className={styles.dropdownUserName}>
                        {authService.user?.name ?? 'Benutzer'} 
                    </span>
                    <div className={styles.dropdownItem} onClick={openSettings}>
                        {'Einstellungen'}
                    </div>
                </div>
            )}
        </div>
    );
}
