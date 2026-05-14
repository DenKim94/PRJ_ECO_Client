import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTracking } from "../hooks/useTracking";
import { useConfig } from "../hooks/useConfig";
import { CustomButton } from "../components/CustomButton";
import { Logger } from "../utils/logger";

export default function CalculationView() {
    const authService = useAuth();
    const configService = useConfig(); 
    const trackingService = useTracking();
    const logger = new Logger('CalculationView');

    useEffect(() => {
        trackingService.resetResponseMsg();
        configService.resetSaveResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    const runCalculation = () => {
        logger.debug('Berechnung ausführen ...');

    };
    return (
        <div>
            <h1>CalculationView</h1>
            <p>Platzhalter: Hier kannst du die berechneten Werte als Diagramme genauer ansehen.</p>

            <CustomButton
                iconProps={{iconSrc: '/play_icon_light.svg', size: 22, alt: 'Icon - Analysen anzeigen', ariaLabel: 'Icon - Analysen anzeigen'}}
                title="Berechnung starten" 
                type="button"
                onClickCallback={runCalculation} 
                isDisabled={authService.isLoading || trackingService.isLoading}
                sx={{marginTop: '10px', width: '250px', color:'white', gap: '10px'}} 
            />
        </div>
    );
}