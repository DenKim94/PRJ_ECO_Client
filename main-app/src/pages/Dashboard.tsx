import { useAuth } from "../hooks/useAuth";
import { useConfig } from "../hooks/useConfig";
import { useTracking } from "../hooks/useTracking";
import { useCalculation } from "../hooks/useCalculation";
import { Logger } from "../utils/logger";
import styles from "./Dashboard.module.scss";


export default function Dashboard() {
    const authService = useAuth();
    const configService = useConfig();
    const trackingService = useTracking();  
    const calcService = useCalculation();
    const logger = new Logger('Dashboard');
    logger.debug('Dashboard ist aufgerufen.');
    
    return (
        <div className={styles.pageContainer}>
            <h1>Dashboard</h1>
        </div>
    );
}