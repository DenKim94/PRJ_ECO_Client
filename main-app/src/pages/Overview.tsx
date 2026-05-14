import { useEffect } from "react";
import styles from "./Overview.module.scss";
import { useAuth } from "../hooks/useAuth";
import { useTracking } from "../hooks/useTracking";
import { useConfig } from "../hooks/useConfig";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Label
} from "recharts";
import { InfoBox } from "../components/InfoBox";
import { LineDiagram } from "../components/LineDiagram";
import { BarDiagram } from "../components/BarDiagram";

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
        <div className={styles.pageContainer}>
            <InfoBox message={'Datenübersicht zum Energieverbrauch und zu den zugehörigen Kosten'}/>
            <LineDiagram
                title={'Erfasste Zählerstände'} 
                dataList={trackingService.entryList}
                xAxis={{dataKey: 'timestamp', label: 'Datum'}}
                yAxis={{dataKey: 'readingValue', label: 'kWh'}}
            />
        </div>
    );
}