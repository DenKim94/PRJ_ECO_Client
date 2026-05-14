import { useEffect } from "react";
import styles from "./Overview.module.scss";
import { useAuth } from "../hooks/useAuth";
import { useTracking } from "../hooks/useTracking";
import { useConfig } from "../hooks/useConfig";
import { InfoBox } from "../components/InfoBox";
import { LineDiagram } from "../components/LineDiagram";
import { useCalculation } from "../hooks/useCalculation";


export default function Overview() {
    const authService = useAuth();
    const configService = useConfig();
    const calcService = useCalculation();
    const trackingService = useTracking();
    
    useEffect(() => {
        trackingService.resetResponseMsg();
        configService.resetSaveResult();
        calcService.resetResponseMsg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    return (
        <div className={styles.pageContainer}>
            <InfoBox message={'Datenübersicht zum Energieverbrauch und zu den zugehörigen Kosten'}/>
            <LineDiagram
                title={'Diagram 1'} 
                dataList={trackingService.entryList}
                xAxis={{dataKey: 'timestamp', label: 'Datum'}}
                yAxis={{dataKey: 'readingValue', label: 'kWh'}}
            />
        </div>
    );
}