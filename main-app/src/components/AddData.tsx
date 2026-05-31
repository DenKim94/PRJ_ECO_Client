import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Logger } from "../utils/logger";
import styles from "./AddData.module.scss";
import { InfoBox } from "./InfoBox";
import { TrackingEntityRequest } from "../types/TrackingTypes";
import { useTracking } from "../hooks/useTracking";
import { HelperClass } from "../utils/helper";
import { MessageContainer } from "./MessageContainer";
import { CustomButton } from "./CustomButton";

export default function AddData() {
    const logger = new Logger('AddData');
    const authService = useAuth();
    const trackingService = useTracking();
    const [submitting, setSubmitting] = useState(false);
    const [newEntry, setNewEntry] = useState<string>('');
    const [newDate, setNewDate] = useState<string>(HelperClass.formatDateForClient(new Date().toISOString()));
        
    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        trackingService.resetResponseMsg();

        try {
            // Wert parsen
            const parsedValue = newEntry ? parseFloat(newEntry) : 0;

            // Check zur gültigen Zahl
            if (isNaN(parsedValue)) {
                logger.error('Bitte gib eine gültige Zahl für den Zählerstand ein.');
                setSubmitting(false);
                return;
            }

            const request: TrackingEntityRequest = { 
                value_kWh: parsedValue, 
                date: HelperClass.formatDateForServer(newDate) 
            };
            
            const result = await trackingService.addEntry(request);
            
            if (!result) {
                logger.error(trackingService.errorMsgRef.current?.message ?? 'Unbekannter Fehler beim Hinzufügen des Eintrags.');
                return;
            }
            
            // Nach Erfolg zurücksetzen
            setNewEntry('');
            setNewDate(HelperClass.formatDateForClient(new Date().toISOString()));

        } catch (err) {
            logger.error(err instanceof Error ? err.message : 'Unbekannter Fehler beim Hinzufügen des Eintrags.');
            return;
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className={styles.addDataContainer}>
            <InfoBox message={'Hier können neue Verbrauchsdaten hinzugefügt werden.'}
                sx={{ margin: '0px 20px' }}
            />
            <form onSubmit={(e) => void onSubmit(e)} className={styles.formContainer}>
                <div className={styles.inputRow}>
                    <label htmlFor="date" className={styles.label}>{'Datum'}</label>
                    <input
                        type="date"
                        aria-label="Datum der Erfassung"
                        className={styles.inputField}
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        required={true}
                        disabled={submitting}
                    />
                </div>
                <div className={styles.inputRow}>
                    <label htmlFor="entry" className={styles.label}>{'Zählerstand (kWh)'}</label>
                    <input 
                        type="text" 
                        inputMode="decimal"
                        aria-label="Zählerstand (kWh)"
                        value={newEntry}
                        onChange={(e) => {
                            const val = e.target.value.replace(',', '.');
                            if (/^\d*\.?\d*$/.test(val)) {
                                setNewEntry(val);
                            }
                        }}
                        required={true}
                        disabled={submitting}
                        className={styles.inputField}
                    />
                </div>
                <CustomButton
                    iconProps={{iconSrc: '/check_circle_icon_light.svg', size: 24, alt: 'Icon - Datenpunkt hinzufügen', ariaLabel: 'Icon - Datenpunkt hinzufügen'}}   
                    title={submitting ? "Senden ..." : "Bestätigen"} 
                    type="submit" 
                    isDisabled={submitting}
                    sx={{marginTop: '20px', color:'white', gap: '10px', width: '280px'}} 
                />
            </form>
            <MessageContainer message={trackingService.responseMsg?.message ?? ""} type={trackingService.responseMsg?.type} isVisible={trackingService.responseMsg !== null} />
        </div>
    );
}