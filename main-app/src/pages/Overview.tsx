import { useAuth } from "../hooks/useAuth";

export default function Overview() {
    const authService = useAuth();
    
    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    return (
        <div>
            <h1>Übersicht</h1>
            <p>Platzhalter: Hier kannst du eine Übersicht deiner Daten erhalten.</p>
        </div>
    );
}