import { useEffect } from "react";
// import { useAuth } from "../hooks/useAuth";
import { useTracking } from "../hooks/useTracking";
import { useConfig } from "../hooks/useConfig";

export default function Adminview() {
    // const authService = useAuth();
    const configService = useConfig(); 
    const trackingService = useTracking();
    
    useEffect(() => {
        trackingService.resetResponseMsg();
        configService.resetSaveResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h1>Adminview</h1>
            <p>Platzhalter: Hier kannst du als Admin die User einsehen und verwalten.</p>
        </div>
    );
}