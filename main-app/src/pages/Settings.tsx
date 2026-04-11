import { useAuth } from "../hooks/useAuth";

export default function Settings() {
    const authService = useAuth();
    
    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }
    return (
        <div>
            <h1>Settings</h1>
            <p>Platzhalter: Hier kannst du deine Einstellungen verwalten.</p>
        </div>
    );
}