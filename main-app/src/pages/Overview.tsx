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
    const usedEnergyPerPeriod = trackingService.getUsedEnergyPerPeriod();

    useEffect(() => {
        trackingService.resetResponseMsg();
        configService.resetSaveResult();
        calcService.resetResponseMsg();
        console.log(trackingService.entryList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    return (
        <div className={styles.pageContainer}>
            <InfoBox message={'Datenübersicht zum Energieverbrauch und zu den zugehörigen Kosten'}/>
            <LineDiagram
                title={'Normierter Energieverbrauch je Messperiode'} 
                dataList={usedEnergyPerPeriod}
                infoText="Info: Der normierte Verbrauchswert bezieht sich jeweils auf den Zeitraum zwischen zwei Ablesezeitpunkten."
                xAxis={{
                    dataKey: 'date', 
                    label: 'Datum'
                }}
                yAxis={{
                    dataKey: ['energyDifferenceNorm'], 
                    label: 'kWh/Tag', 
                    unit: 'kWh/Tag',
                    dataStyleProps: [{legendName: 'Verbrauch', color: 'var(--color-primary-hover)'}]
                }}
            />
        </div>
    );
}