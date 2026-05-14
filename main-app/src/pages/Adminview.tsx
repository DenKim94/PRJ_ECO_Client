import { useEffect } from "react";
// import { useAuth } from "../hooks/useAuth";
import { useTracking } from "../hooks/useTracking";
import { useConfig } from "../hooks/useConfig";
import { useCalculation } from "../hooks/useCalculation";

export default function Adminview() {
    // const authService = useAuth();
    const configService = useConfig(); 
    const trackingService = useTracking();
    const calcService = useCalculation();
    
    useEffect(() => {
        trackingService.resetResponseMsg();
        configService.resetSaveResult();
        calcService.resetResponseMsg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h1>Adminview</h1>
            <p>Platzhalter: Hier kannst du als Admin die User einsehen und verwalten.</p>
        </div>
    );
}