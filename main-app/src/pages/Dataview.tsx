import { useAuth } from "../hooks/useAuth";

export default function Dataview() {
    const authService = useAuth();
    
    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    return (
        <div>
            <h1>Dataview</h1>
            <p>Platzhalter: Hier kannst du deine Daten einsehen und verwalten.</p>
        </div>
    );
}