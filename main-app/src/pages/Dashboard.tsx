import { useAuth } from "../hooks/useAuth";
import { useConfig } from "../hooks/useConfig";
import { useTracking } from "../hooks/useTracking";
import { useCalculation } from "../hooks/useCalculation";
import { Logger } from "../utils/logger";
import styles from "./Dashboard.module.scss";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PopUp, PopUpProps, PopUpMessageTypes } from "../components/PopUp";


export default function Dashboard() {
    const logger = new Logger('Dashboard');
    const authService = useAuth();
    const configService = useConfig();
    const trackingService = useTracking();  
    const calcService = useCalculation();
    const [activePopUp, setActivePopUp] = useState<PopUpProps>({
        isActive: false,
        type: 'info',
        duration: 5000,
        message: ''
    });

    const isLoading = authService.isLoading || configService.isLoading || trackingService.isLoading || calcService.isLoading;
    
    function updatePopUpProps(isActive: boolean, message: string, type: PopUpMessageTypes = 'info'){
        setActivePopUp(prev => ({
            ...prev,
            isActive,
            message,
            type
        }));
    };

    useEffect(() => {
        async function performInitialDataLoad(): Promise<void> {
            logger.debug('Initialisiere Daten ...');
            await configService.loadConfiguration();
            await trackingService.getAllEntries();
            await authService.getUserData();
            logger.debug('Initialisierung abgeschlossen.');
        }
        performInitialDataLoad().catch((error) => {
            logger.error('Fehler bei der initialen Datenladung:', error);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    // Überwache relevante Daten und Fehler, um PopUps entsprechend zu aktualisieren
    useEffect(() => {
        if (authService.showSessionWarning){
            updatePopUpProps(true, "Deine Sitzung läuft bald ab. Möchtest du deine Sitzung verlängern?", 'warning');
        };
        if (authService.userDetailedData?.isEnabled === false){
            updatePopUpProps(true, "Dein Nutzerstatus wurde deaktiviert. Daher kann die Nutzung der Anwendung eingeschränkt sein.", 'warning');
        };
        if (authService.userDetailedData?.isValidatedEmail === false){
            updatePopUpProps(true, "Deine E-Mail-Adresse ist nicht validiert. Daher kann die Nutzung der Anwendung eingeschränkt sein.", 'warning');
        }
        if (authService.errorMsgRef.current || configService.errorMsgRef.current || trackingService.errorMsgRef.current || calcService.errorMsgRef.current){
            updatePopUpProps(true, "Ein Fehler bei Laden der Daten ist aufgetreten. Bitte versuche die Seite erneut zu laden.", 'error');
        };
    }, [authService.userDetailedData, 
        authService.showSessionWarning, 
        authService.errorMsgRef, 
        configService.errorMsgRef, 
        trackingService.errorMsgRef, 
        calcService.errorMsgRef]);

    return (
        <div className={styles.pageContainer}>
            <h1>Dashboard</h1>
            <LoadingSpinner isActive={isLoading} message="Daten werden geladen..." />
            <PopUp isActive={activePopUp.isActive} 
                    type={activePopUp.type} 
                    duration={activePopUp.duration} 
                    message={activePopUp.message} />
        </div>
    );
}