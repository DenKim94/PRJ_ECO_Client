import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTracking } from "../hooks/useTracking";
import { useConfig } from "../hooks/useConfig";

export default function Overview() {
    const authService = useAuth();
    const configService = useConfig();
    const trackingService = useTracking();
    
    useEffect(() => {
        trackingService.resetResponseMsg();
        configService.resetSaveResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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