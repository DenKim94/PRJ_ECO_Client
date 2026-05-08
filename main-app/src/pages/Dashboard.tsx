import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useConfig } from "../hooks/useConfig";
import { useTracking } from "../hooks/useTracking";
import { useCalculation } from "../hooks/useCalculation";
import { Logger } from "../utils/logger";
import styles from "./Dashboard.module.scss";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PopUp, PopUpProps, PopUpMessageTypes } from "../components/PopUp";
import { EmailValidation } from "../components/EmailValidation";
import { useIsMobile } from "../hooks/useIsMobile";
import DashboardHeader from "../components/DashboardHeader";
import MobileMenuBar from "../components/MobileMenuBar";
import MenuSideBar from "../components/MenuSideBar";
import { RefreshTokenDialog } from "../components/RefreshTokenDialog";
import { DeleteAccountDialog } from "../components/DeleteAccountDialog";


export default function Dashboard() {
    const logger = new Logger('Dashboard');
    const authService = useAuth();
    const configService = useConfig();
    const trackingService = useTracking();  
    const calcService = useCalculation();
    const [activePopUp, setActivePopUp] = useState<PopUpProps>({
        isActive: false,
        type: 'info',
        duration: 0,
        message: ''
    });
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const isLoading = authService.isLoading || configService.isLoading || trackingService.isLoading || calcService.isLoading;
    
    function closePopUp() {
        setActivePopUp(prev => ({ ...prev, isActive: false }));
    }

    function updatePopUpProps(
        isActive: boolean, 
        message: string, 
        type: PopUpMessageTypes = 'info',
        duration_ms?: number
    ){
        setActivePopUp(prev => {
            if (prev.isActive === isActive && prev.message === message && prev.type === type) {
                return prev; 
            }
            
            return {
                ...prev,
                isActive,
                message,
                duration: duration_ms ?? 6000,
                type
            };
        });
    }

    useEffect(() => {
        async function performInitialDataLoad(): Promise<void> {
            logger.debug('Initialisiere Daten ...');
            await configService.loadConfiguration();
            await trackingService.getAllEntries();
            await authService.getUserData();
            await calcService.loadResults();
            trackingService.resetResponseMsg();
            logger.debug('Initialisierung abgeschlossen.');
            logger.debug(`Token läuft in ${authService.sessionTimeRemaining.current} Sekunden ab.`);
        }
        performInitialDataLoad().catch((error) => {
            logger.error('Fehler bei der initialen Datenladung:', error);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    // Überwache relevante Daten und Fehler, um PopUps entsprechend zu aktualisieren
    useEffect(() => {
        if (isLoading) return;

        if (authService.userDetailedData?.isEnabled === false){
            updatePopUpProps(true, "Dein Account wurde deaktiviert. Daher ist die Nutzung der Anwendung eingeschränkt.", 'warning');
        }
        else if (authService.userDetailedData?.isValidatedEmail === false){
            updatePopUpProps(true, "Deine E-Mail-Adresse ist nicht validiert. Daher ist die Nutzung der Anwendung eingeschränkt.", 'warning');
        }
        else if (calcService.errorMsgRef.current?.code === 404){
            updatePopUpProps(true, "In der Datenbank liegen bisher keine Berechnungsdaten vor.", 'warning');
        }
        else if (authService.errorMsgRef.current || configService.errorMsgRef.current || trackingService.errorMsgRef.current || calcService.errorMsgRef.current){
            updatePopUpProps(true, "Ein Fehler bei Laden der Daten ist aufgetreten. Bitte versuche die Seite erneut zu laden.", 'error');
        };

    }, [authService.userDetailedData,
        authService.sessionTimeRemaining,
        authService.showSessionWarning, 
        authService.errorMsgRef, 
        configService.errorMsgRef, 
        trackingService.errorMsgRef, 
        calcService.errorMsgRef, 
        isLoading 
    ]);

    return (
        <div className={styles.pageContainer}>
           { !isMobile && <MenuSideBar/> }
            <div className={styles.overViewContainer}>
                <DashboardHeader/>
                <EmailValidation show={
                    !authService.deleteAccountRequested && 
                    !authService.showSessionWarning &&
                    !authService.userDetailedData?.isValidatedEmail && 
                    !isLoading} 
                />
                <RefreshTokenDialog show={authService.showSessionWarning && !isLoading} />
                <DeleteAccountDialog show={authService.deleteAccountRequested && !authService.showSessionWarning && !isLoading} />
                       
                {isLoading ? (
                    <LoadingSpinner 
                        isActive={true} 
                        message="Daten werden geladen..."
                        sxContainer={{gap: isMobile ? '5px' : '20px', padding: isMobile ? '10px' : '20px'}} 
                        sxSpinner={{width: isMobile ? '50px' : '100px', height: isMobile ? '50px' : '100px'}}
                    />
                ) : (
                    !authService.deleteAccountRequested && !authService.showSessionWarning && (
                        <div className={styles.dashboardContentArea}>
                            <Outlet /> 
                        </div>
                    )
                )}
                {isMobile && (
                    <MobileMenuBar 
                        onAddClick={() => {
                            void navigate('/dashboard/add-entry');
                        }} 
                    />
                )}
                <PopUp 
                    isActive={activePopUp.isActive} 
                    type={activePopUp.type} 
                    duration={activePopUp.duration} 
                    message={activePopUp.message}
                    onClose={closePopUp}
                />
            </div>
        </div>
    );
}