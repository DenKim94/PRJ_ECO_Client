import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTracking } from "../hooks/useTracking";
import { Logger } from "../utils/logger";
import { HelperClass } from "../utils/helper";
import styles from "./Dataview.module.scss";
import { TrackingEntityResponse } from "../types/TrackingTypes";
import { IconButton } from "../components/IconButton";
import { useTheme } from "../hooks/useTheme";
import { InfoBox } from "../components/InfoBox";
import { MessageContainer } from "../components/MessageContainer";
import { useConfig } from "../hooks/useConfig";
import { CustomButton } from "../components/CustomButton";
import { useIsMobile } from "../hooks/useIsMobile";
import { useNavigate } from "react-router-dom";
import { useCalculation } from "../hooks/useCalculation";

export default function Dataview() {
    const logger = new Logger('Dataview');
    const authService = useAuth();
    const calcService = useCalculation();
    const themeObject = useTheme();
    const trackingService = useTracking();
    const configService = useConfig();   
    const isMobile = useIsMobile(); 
    const navigate = useNavigate(); 
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editDate, setEditDate] = useState("");
    const [editKWhValue, setEditKWhValue] = useState<number | null>(null);

    const saveIconSrc = (themeObject.theme === 'light') ?  "/check_circle_icon_dark.svg" : "/check_circle_icon_light.svg";
    const deleteIconSrc = (themeObject.theme === 'light') ?  "/delete_icon_dark.svg" : "/delete_icon_light.svg";
    const cancelIconSrc = (themeObject.theme === 'light') ?  "/cancel_circle_icon_dark.svg" : "/cancel_circle_icon_light.svg";

    useEffect(() => {
        configService.resetSaveResult();
        calcService.resetResponseMsg();
        logger.debug('Tracking-Daten: ', trackingService.entryList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
        
    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    const handleRowClick = (entry: TrackingEntityResponse) => {
        trackingService.resetResponseMsg();
        setEditingId(entry.id);
        setEditDate(HelperClass.formatDateForClient(entry.timestamp));
        setEditKWhValue(entry.readingValue);
    };

    const handleSave = async (id: number) => {
        trackingService.resetResponseMsg();
        const response = await trackingService.updateEntryById(id, { date: HelperClass.formatDateForServer(editDate), value_kWh: Number(editKWhValue) });
        if (!response) {
            logger.error(`${trackingService.errorMsgRef.current?.message ?? 'Unbekannter Fehler beim Speichern.'}`);
            return;
        }
        setEditingId(null);
    };

    const handleAddData = () => {
        logger.debug('Neuen Datenpunkt hinzufügen ...');
        trackingService.resetResponseMsg();
        void navigate('/dashboard/add-entry');
    };

    const handleDelete = async (id: number) => {
        trackingService.resetResponseMsg();
        const response = await trackingService.deleteEntryById(id);
        setEditingId(null);
        if (!response) {
            logger.error(`${trackingService.errorMsgRef.current?.message ?? 'Unbekannter Fehler beim Löschen.'}`);
            return;
        }
    };

    return (
        <div className={styles.dataviewContainer}>
            <InfoBox message={'Hier kannst du deine Zählerdaten einsehen und bearbeiten.'} sx={{ marginBottom: '20px' }} />
            <table className={styles.dataTable}>
                <thead>
                    <tr>
                        <th>{'Datum'}</th>
                        <th>{'Zählerstand (kWh)'}</th>
                        <th>{'Aktionen'}</th>
                    </tr>
                </thead>
                <tbody>
                    {trackingService.entryList.map((entry: TrackingEntityResponse) => (
                        <tr key={entry.id} onClick={() => handleRowClick(entry)}>
                            {editingId === entry.id ? (
                                <>
                                    <td className={styles.editingCell}>
                                        <input 
                                            type="date" 
                                            value={editDate} 
                                            placeholder={`${entry.timestamp}`}
                                            onChange={(e) => setEditDate(HelperClass.formatDateForClient(e.target.value))} 
                                            onClick={(e) => e.stopPropagation()} // Verhindert das Schließen durch Zeilen-Klick
                                        />
                                    </td>
                                    <td className={styles.editingCell}>
                                        <input 
                                            type="number" 
                                            step="0.1"
                                            value={editKWhValue ?? 0} 
                                            onChange={(e) => setEditKWhValue(Number(e.target.value))}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td>
                                        <div className={styles.actionCell}>
                                            <IconButton 
                                                onClickCallback={(e) => { 
                                                    e.stopPropagation(); 
                                                    void handleSave(entry.id); 
                                                }} 
                                                iconProps={{
                                                    iconSrc: saveIconSrc,
                                                    alt: "Eintrag speichern",
                                                    size: 20
                                                }}
                                            />
                                            <IconButton 
                                                onClickCallback={(e) => { 
                                                    e.stopPropagation(); 
                                                    void handleDelete(entry.id); 
                                                }} 
                                                iconProps={{
                                                    iconSrc: deleteIconSrc,
                                                    alt: "Eintrag löschen",
                                                    size: 20
                                                }}
                                            />
                                            <IconButton 
                                                onClickCallback={(e) => { 
                                                    e.stopPropagation(); 
                                                    setEditingId(null); 
                                                }} 
                                                iconProps={{
                                                    iconSrc: cancelIconSrc,
                                                    alt: "Bearbeitung abbrechen",
                                                    size: 20
                                                }}
                                            />
                                        </div>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{entry.timestamp}</td>
                                    <td>{entry.readingValue}</td>
                                    <td className={styles.hintText}>{'Klicken zum Bearbeiten'}</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <MessageContainer message={trackingService.responseMsg?.message ?? ""} type={trackingService.responseMsg?.type} isVisible={trackingService.responseMsg !== null} />
            
            { !isMobile && 
                <CustomButton
                    title="Datenpunkt hinzufügen" 
                    type="button"
                    onClickCallback={handleAddData} 
                    aria-label="Neuen Datenpunkt aufnehmen"
                    isDisabled={authService.isLoading || configService.isLoading || trackingService.isLoading}
                    sx={{width: '250px', marginTop: '20px'}} 
                /> 
            }
        </div>
    );
}
