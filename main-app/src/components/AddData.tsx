import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Logger } from "../utils/logger";
import styles from "./AddData.module.scss";
import { InfoBox } from "./InfoBox";
import { TrackingEntityRequest } from "../types/TrackingTypes";
import { useTracking } from "../hooks/useTracking";
import { HelperClass } from "../utils/helper";
import { MessageContainer } from "./MessageContainer";

export default function AddData() {
    const logger = new Logger('AddData');
    const authService = useAuth();
    const trackingService = useTracking();
    const [submitting, setSubmitting] = useState(false);
    const [newEntry, setNewEntry] = useState<number>(0);
    const [newDate, setNewDate] = useState<string>(HelperClass.formatDateForClient(new Date().toISOString()));

    useEffect(() => {
        trackingService.resetResponseMsg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
        
    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const request: TrackingEntityRequest = { value_kWh: newEntry, date: newDate };
            const result = await trackingService.addEntry(request);
            if (!result) {
                logger.error(trackingService.errorMsgRef.current?.message ?? 'Unbekannter Fehler beim Hinzufügen des Eintrags.');
                return;
            }
            setNewEntry(0);
            setNewDate(HelperClass.formatDateForClient(new Date().toISOString()));
            logger.debug('Datenpunkt erfolgreich erfasst.');

        } catch (err) {
            logger.error(err instanceof Error ? err.message : 'Unbekannter Fehler beim Hinzufügen des Eintrags.');
            return;

        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className={styles.addDataContainer}>
            <InfoBox message={'Hier können neue Energieverbrauchsdaten hinzugefügt werden.'}/>
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
                        type="number" 
                        step="0.1"
                        aria-label="Zählerstand (kWh)"
                        value={newEntry} 
                        onChange={(e) => setNewEntry(Number(e.target.value))}
                        required={true}
                        disabled={submitting}
                        className={styles.inputField}
                    />
                </div>
            </form>
            <MessageContainer message={trackingService.responseMsg?.message ?? ""} type={trackingService.responseMsg?.type} isVisible={trackingService.responseMsg !== null} />
        </div>
    );
}