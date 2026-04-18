import { useAuth } from "../hooks/useAuth";

export default function DataEntryMask() {
    const authService = useAuth();
    
    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    return (
        <div>
            <h1>DataEntryMask</h1>
            <p>Platzhalter: Hier kannst du neue getrackten Werte zur Datenbank hinzufügen.</p>
        </div>
    );
}