import { TimeRange } from "../utils/helper";
import styles from "./DataTimeRangeSetter.module.scss";

export interface DataTimeRangeSetterProps {
    setTimeRangeCallback: (timeRange: TimeRange) => void;
}

export default function DataTimeRangeSetter( { setTimeRangeCallback }: DataTimeRangeSetterProps) {

    return (
        <div className={styles.dataTimeRangeSetter}>
            {/* Buttons zum Umschalten des Zeitraums */}
            <div className={styles.rangeSelector}>
                <button className={styles.rangeSelectorButton} onClick={() => setTimeRangeCallback('6M')}>{'6 Monate'}</button>
                <button className={styles.rangeSelectorButton} onClick={() => setTimeRangeCallback('1Y')}>{'1 Jahr'}</button>
                <button className={styles.rangeSelectorButton} onClick={() => setTimeRangeCallback('2Y')}>{'2 Jahre'}</button>
            </div>
        </div>
    );
}
