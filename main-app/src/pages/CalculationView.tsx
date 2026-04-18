import { useAuth } from "../hooks/useAuth";

export default function CalculationView() {
    const authService = useAuth();
    
    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    return (
        <div>
            <h1>CalculationView</h1>
            <p>Platzhalter: Hier kannst du die berechneten Werte als Diagramme genauer ansehen.</p>
        </div>
    );
}