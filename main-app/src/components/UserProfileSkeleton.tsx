import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import { useOutsideClick } from "../hooks/useOutsideClick"; 
import { useIsMobile } from "../hooks/useIsMobile";
import styles from "./UserProfileSkeleton.module.scss";
import { useTheme } from "../hooks/useTheme";
import { Logger } from "../utils/logger";

export default function UserProfileSkeleton() {
    const authService = useAuth();
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const logger = new Logger('UserProfileSkeleton');

    // State für das Dropdown-Menü
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const themeObject = useTheme();

    // Ref für den gesamten Container erstellen
    const menuRef = useRef<HTMLDivElement>(null);
    
    // Hook nutzen: Schließt das Menü bei Klick außerhalb
    useOutsideClick(menuRef, () => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    });

    const iconSrcLightMode = authService.userDetailedData?.role === 'ADMIN' ? '/admin_icon_dark.svg' : '/account_circle_icon_dark.svg';
    const iconSrcDarkMode = authService.userDetailedData?.role === 'ADMIN' ? '/admin_icon_light.svg' : '/account_circle_icon_light.svg';
    const logoutIconSrc = themeObject.theme === 'light' ? '/logout_icon_dark.png' : '/logout_icon_light.png'

    // Dropdown öffnen bei Klick auf das Profil-Icon
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    async function logoutUser(): Promise<void> {
        logger.debug('Logout angefordert.');
        setIsMenuOpen(false);
        const result = await authService.logout();

        if (authService.errorMsgRef.current?.message) {
            logger.error(`${authService.errorMsgRef.current.message}`);
            return;
        } else {
            logger.debug(`${result.message}`);
            void navigate('/login', { replace: true })
        }
    }
    
    const openUserAdministration = () => {
        setIsMenuOpen(false);
        logger.debug('Nutzerverwaltung angefordert.');
        void navigate('/dashboard/admin');
    };

    const deleteAccount = () => {
        setIsMenuOpen(false);
        logger.debug('Konto löschen angefordert.');
        authService.setDeleteAccountRequested(true);
    }

    const changePassword = () => {
        setIsMenuOpen(false);
        logger.debug('Passwort ändern angefordert.');
        void navigate('/password-reset');
    }

    const updateUserName = async() => {
        setIsMenuOpen(false);
        const result = await authService.resendVerificationEmail();

        if (authService.errorMsgRef.current?.message) {
            logger.error(`${authService.errorMsgRef.current.message}`);
            void navigate('/dashboard');
            return;

        } else {
            logger.debug(`${result.message}`);
            void navigate('/dashboard/username-update');
        }
    }

    return (
        <div ref={menuRef} className={styles.userNameContainer}>
            <button 
                className={styles.skeletonCircle}
                aria-label='Profilmenü öffnen'
                onClick={toggleMenu}
                disabled={!authService.userDetailedData?.isValidatedEmail || !authService.isLoading}
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

            {isMenuOpen && (
                <div className={styles.dropdownMenu}>
                    <span className={styles.dropdownUserName}>
                        {authService.user?.name ?? 'Benutzer'} 
                    </span>
                    {authService.userDetailedData?.role === 'ADMIN' && (
                        <div className={styles.dropdownItem} onClick={openUserAdministration}>
                            <img src={themeObject.theme === 'light' ? '/manage_accounts_icon_dark.svg' : '/manage_accounts_icon_light.svg'} 
                                alt="Nutzerverwaltung" 
                                width={20} 
                                height={20} />
                            <span className={styles.label}>{'Nutzerverwaltung'}</span>
                        </div>
                    )}     
                    {authService.userDetailedData?.role !== 'ADMIN' && (
                     <>
                        <div className={styles.dropdownItem} onClick={() => void updateUserName()}>
                            <img src={themeObject.theme === 'light' ? '/change_username_icon_dark.svg' : '/change_username_icon_light.svg'} 
                                alt="Benutzernamen ändern" 
                                width={20} 
                                height={20} />
                            <span className={styles.label}>{'Name ändern'}</span>
                        </div>
                        <div className={styles.dropdownItem} onClick={changePassword}>
                            <img src={themeObject.theme === 'light' ? '/change_password_icon_dark.svg' : '/change_password_icon_light.svg'} 
                                alt="Passwort ändern" 
                                width={20} 
                                height={20} />
                            <span className={styles.label}>{'Passwort ändern'}</span>
                        </div>
                        <div className={styles.dropdownItem} onClick={deleteAccount}>
                            <img src={themeObject.theme === 'light' ? '/delete_icon_dark.svg' : '/delete_icon_light.svg'} 
                                alt="Konto löschen" 
                                width={20} 
                                height={20} />
                            <span className={styles.label}>{'Konto löschen'}</span>
                        </div>
                     </>   
                    )}                
                    {isMobile && (
                        <div className={styles.dropdownItem} onClick={() => void logoutUser()}>
                            <img 
                                src={logoutIconSrc} 
                                alt='Button-Icon'  
                                width={20}
                                height={20} 
                            />
                            {'Abmelden'}
                        </div>
                    )} 
                </div>
            )}
        </div>
    );
}
