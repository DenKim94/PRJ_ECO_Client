import { TimeRange } from "../utils/helper";
import styles from "./DataTimeRangeSetter.module.scss";

export interface DataTimeRangeSetterProps {
    currentTimeRange: TimeRange;
    setTimeRangeCallback: (timeRange: TimeRange) => void;
}

export default function DataTimeRangeSetter({ currentTimeRange, setTimeRangeCallback }: DataTimeRangeSetterProps) {

    return (
        <div className={styles.dataTimeRangeSetter}>
            {/* Buttons zum Umschalten des Zeitraums */}
            <div className={styles.rangeSelector}>
                <button 
                    className={`${styles.rangeSelectorButton} ${currentTimeRange === '6M' ? styles.active : ''}`} 
                    onClick={() => setTimeRangeCallback('6M')}
                >
                    6 Monate
                </button>
                <button 
                    className={`${styles.rangeSelectorButton} ${currentTimeRange === '1Y' ? styles.active : ''}`} 
                    onClick={() => setTimeRangeCallback('1Y')}
                >
                    1 Jahr
                </button>
                <button 
                    className={`${styles.rangeSelectorButton} ${currentTimeRange === '2Y' ? styles.active : ''}`} 
                    onClick={() => setTimeRangeCallback('2Y')}
                >
                    2 Jahre
                </button>
            </div>
        </div>
    );
}
