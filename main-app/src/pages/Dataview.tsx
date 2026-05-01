import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTracking } from "../hooks/useTracking";
import { Logger } from "../utils/logger";
import styles from "./Dataview.module.scss";
import { TrackingEntityResponse } from "../types/TrackingTypes";

export default function Dataview() {
    const logger = new Logger('Dataview');
    const authService = useAuth();
    const trackingService = useTracking(); 
    
    logger.debug(" - Datenpunkte: ", trackingService.entryList);
    
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editDate, setEditDate] = useState("");
    const [editKWhValue, setEditKWhValue] = useState<number | null>(null);

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
            return;
        }
        await trackingService.updateEntryById(id, { date: editDate, value_kWh: Number(editKWhValue) });

        if (trackingService.errorMsgRef.current?.message) {
            logger.error(`${trackingService.errorMsgRef.current.message}`);
            return;
        }

        setEditingId(null);
    };

    const handleDelete = async (id: number) => {
        await trackingService.deleteEntryById(id);
        setEditingId(null);
    };

    // Formatierung für die Anzeige (dd.mm.yyyy)
    const displayDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("de-DE", {
            day: "2-digit", month: "2-digit", year: "numeric"
        });
    };

    return (
        <div className={styles.dataviewContainer}>
            <h1>Datenübersicht</h1>
            <table className={styles.dataTable}>
                <thead>
                    <tr>
                        <th>Datum</th>
                        <th>Zählerstand (kWh)</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    {trackingService.entryList.map((entry: TrackingEntityResponse) => (
                        <tr key={entry.id} onClick={() => handleRowClick(entry)}>
                            {editingId === entry.id ? (
                                <>
                                    <td>
                                        <input 
                                            type="date" 
                                            value={editDate} 
                                            onChange={(e) => setEditDate(e.target.value)} 
                                            onClick={(e) => e.stopPropagation()} // Verhindert das Schließen durch Zeilen-Klick
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            step="0.1"
                                            value={editKWhValue ?? 0} 
                                            onChange={(e) => setEditKWhValue(Number(e.target.value))}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className={styles.actionCells}>
                                        <button onClick={(e) => { e.stopPropagation(); void handleSave(entry.id); }}>💾</button>
                                        <button onClick={(e) => { e.stopPropagation(); void handleDelete(entry.id); }}>🗑️</button>
                                        <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }}>❌</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{displayDate(entry.timestamp)}</td>
                                    <td>{entry.readingValue}</td>
                                    <td className={styles.hintText}>Klicken zum Bearbeiten</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}