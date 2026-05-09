import { useAuth } from "../hooks/useAuth";
import { Logger } from "../utils/logger";

export default function AddData() {
    const logger = new Logger('AddData');
    const authService = useAuth();
    logger.debug("Ansicht zur Erfassung neuer Datenpunkte");

    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    return (
        <div>
            <h1>AddData</h1>
            <p>Platzhalter: Hier kannst du neue getrackten Werte zur Datenbank hinzufügen.</p>
        </div>
    );
}