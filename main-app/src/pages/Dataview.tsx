import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTracking } from "../hooks/useTracking";
import { Logger } from "../utils/logger";
import styles from "./Dataview.module.scss";
import { TrackingEntityResponse } from "../types/TrackingTypes";
import { IconButton } from "../components/IconButton";
import { useTheme } from "../hooks/useTheme";
import { InfoBox } from "../components/InfoBox";
import { MessageContainer, MessageContainerProps } from "../components/MessageContainer";

export default function Dataview() {
    const logger = new Logger('Dataview');
    const authService = useAuth();
    const themeObject = useTheme();
    const trackingService = useTracking();     
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editDate, setEditDate] = useState("");
    const [editKWhValue, setEditKWhValue] = useState<number | null>(null);
    const [message, setMessage] = useState<{ message: string, type?: MessageContainerProps['type'] }  | null>(null);

    const saveIconSrc = (themeObject.theme === 'light') ?  "/check_circle_icon_dark.svg" : "/check_circle_icon_light.svg";
    const deleteIconSrc = (themeObject.theme === 'light') ?  "/delete_icon_dark.svg" : "/delete_icon_light.svg";
    const cancelIconSrc = (themeObject.theme === 'light') ?  "/cancel_circle_icon_dark.svg" : "/cancel_circle_icon_light.svg";

    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    const handleRowClick = (entry: TrackingEntityResponse) => {
        setEditingId(entry.id);
        setEditDate(entry.timestamp);
        setEditKWhValue(entry.readingValue);
    };

    const handleSave = async (id: number) => {
        if(isNaN(Number(editKWhValue))) {
            logger.error("Ungültiger Wert: ", editKWhValue);
            setMessage({ message: `Ungültiger Wert: ${editKWhValue}`, type: "error" });
            return;
        }
        // TODO [07.05.2026]: Datum muss formatiert werden, damit es vom Server akzeptiert wird
        const response = await trackingService.updateEntryById(id, { date: editDate, value_kWh: Number(editKWhValue) });

        if (!response) {
            const errMsg = trackingService.errorMsgRef.current?.message ?? "Unbekannter Fehler beim Speichern.";
            logger.error(`${errMsg}`);
            setMessage({ message: `${errMsg}`, type: "error" });
            return;
        }

        setMessage({ message: "Eintrag wurde gespeichert.", type: "success" });
        setEditingId(null);
    };

    const handleDelete = async (id: number) => {
        const response = await trackingService.deleteEntryById(id);
        setEditingId(null);

        if (!response) {
            const errMsg = trackingService.errorMsgRef.current?.message ?? "Unbekannter Fehler beim Löschen.";
            logger.error(`${errMsg}`);
            setMessage({ message: `${errMsg}`, type: "error" });
            return;
        }

        setMessage({ message: `${response?.message}`, type: "success" });
    };

    return (
        <div className={styles.dataviewContainer}>
            <h1>{'Datenübersicht'}</h1>
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
                                            onChange={(e) => setEditDate(e.target.value)} 
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
            <MessageContainer message={message?.message ?? ""} type={message?.type} isVisible={message !== null} />
        </div>
    );
}
