import { useEffect, useRef, useState } from "react";
import styles from "./Adminview.module.scss";
import { useTracking } from "../hooks/useTracking";
import { useConfig } from "../hooks/useConfig";
import { useCalculation } from "../hooks/useCalculation";
import { InfoBox } from "../components/InfoBox";
import { MessageContainer } from "../components/MessageContainer";
import { useAuth } from "../hooks/useAuth";
import { Logger } from "../utils/logger";
import { AllUserDataResponse } from "../types/AuthTypes";
import { HelperClass } from "../utils/helper";
import { IconButton } from "../components/IconButton";
import { useTheme } from "../hooks/useTheme";
import { useOutsideClick } from "../hooks/useOutsideClick";

export default function Adminview() {
    const authService = useAuth();
    const configService = useConfig(); 
    const trackingService = useTracking();
    const calcService = useCalculation();
    const logger = new Logger('Adminview');
    const themeObject = useTheme();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isEnabledUser, setIsEnabledUser] = useState<boolean>(true);

    const deleteIconSrc = (themeObject.theme === 'light') ?  "/delete_icon_dark.svg" : "/delete_icon_light.svg";
    const cancelIconSrc = (themeObject.theme === 'light') ?  "/cancel_circle_icon_dark.svg" : "/cancel_circle_icon_light.svg";
    const saveIconSrc = (themeObject.theme === 'light') ?  "/check_circle_icon_dark.svg" : "/check_circle_icon_light.svg";

    // Ref für den gesamten Container erstellen
    const menuRef = useRef<HTMLDivElement>(null);
    
    // Hook nutzen: Schließt das Menü bei Klick außerhalb
    useOutsideClick(menuRef, () => {
        if (setEditingId !== null) {
            setEditingId(null);
        }
    });

    const handleRowClick = (entry: AllUserDataResponse) => {
        setEditingId(entry.id);
        setIsEnabledUser(entry.isEnabledUser);
    };

    const handleSetUserStatus = async (id: number, isEnabled: boolean) => {
        await authService.adminSetUserStatusById(id, isEnabled);
        if (authService.errorMsgRef.current?.message) {
            logger.error(`${authService.errorMsgRef.current?.message}`);
            return;
        }
        setEditingId(null);
    };

    const handleDeleteUser = async (id: number) => {
        await authService.adminDeleteUserById(id);
        setEditingId(null);
    };

    useEffect(() => {
        trackingService.resetResponseMsg();
        configService.resetSaveResult();
        calcService.resetResponseMsg();
        async function loadUsers(): Promise<void> {
            await authService.adminGetAllUsers();
        }

        loadUsers().catch((error) => {
            logger.error('Fehler bei der initialen Datenladung:', error);
        });
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div ref={menuRef} className={styles.pageContainer}>
            <InfoBox message={'Hier ist der Adminbereich. Hier können alle registerierten User verwaltet werden.'} sx={{ marginBottom: '20px' }} />
            <table className={styles.dataTable}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>E-Mail Adresse</th>
                        <th>E-Mail validiert</th>
                        <th>Status</th>
                        <th>Erstellt am</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    {authService.adminUserData.map((user) => (
                        <tr key={user.id} onClick={() => handleRowClick(user)}>
                            {editingId === user.id ? (
                                <>
                                    {/* BEARBEITUNGSMODUS */}
                                    <td data-label="Name">{user.userName}</td>
                                    <td data-label="E-Mail">{user.eMail}</td>
                                    <td data-label="E-Mail validiert">{user.isValidatedEmail ? 'Ja' : 'Nein'}</td>
                                    <td data-label="Status">
                                        <label className={styles.editingLabel}>
                                            <input 
                                                className={styles.inputField}
                                                type="checkbox" 
                                                checked={isEnabledUser} 
                                                onChange={(e) => setIsEnabledUser(e.target.checked)} 
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            {'AKTIV'}
                                        </label>
                                    </td>
                                    <td data-label="Erstellt am">{HelperClass.formatDateForServer(user.createdAt)}</td>
                                    <td data-label="Aktionen">
                                        <div className={styles.actionCell}>
                                            <IconButton 
                                                onClickCallback={(e) => { 
                                                    e?.stopPropagation(); 
                                                    void handleSetUserStatus(user.id, isEnabledUser); 
                                                }} 
                                                iconProps={{ iconSrc: saveIconSrc, alt: "Speichern", size: 20 }}
                                            />
                                            <IconButton 
                                                onClickCallback={(e) => { 
                                                    e?.stopPropagation(); 
                                                    void handleDeleteUser(user.id); 
                                                }} 
                                                iconProps={{ iconSrc: deleteIconSrc, alt: "Löschen", size: 20 }}
                                            />
                                            <IconButton 
                                                onClickCallback={(e) => { 
                                                    e?.stopPropagation(); 
                                                    setEditingId(null); 
                                                }} 
                                                iconProps={{ iconSrc: cancelIconSrc, alt: "Abbrechen", size: 20 }}
                                            />
                                        </div>
                                    </td>
                                </>
                            ) : (
                                <>
                                    {/* ANSICHTSMODUS */}
                                    <td data-label="Name">{user.userName}</td>
                                    <td data-label="E-Mail">{user.eMail}</td>
                                    <td data-label="E-Mail validiert">{user.isValidatedEmail ? 'Ja' : 'Nein'}</td>
                                    <td data-label="Status" style={{ color: user.isEnabledUser ? 'var(--color-success)' : 'var(--color-error)' }}>
                                        {user.isEnabledUser ? 'AKTIV' : 'BLOCKIERT'}
                                    </td>
                                    <td data-label="Erstellt am">{HelperClass.formatDateForServer(user.createdAt)}</td>
                                    <td data-label="Aktionen" className={styles.hintText}>Klicken zum Bearbeiten</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <MessageContainer message={authService.responseMsg?.message ?? ""} type={authService.responseMsg?.type} isVisible={authService.responseMsg !== null} />
            
        </div>
    );
}