import { use } from "react";
import { useAuth } from "../hooks/useAuth";
import { useConfig } from "../hooks/useConfig";
import { Logger } from "../utils/logger";
import styles from "./Dashboard.module.scss";
import { useTracking } from "../hooks/useTracking";

export default function Dashboard() {
    const authObj = useAuth();
    const configObj = useConfig();
    const trackingObj = useTracking();  
    const logger = new Logger('Dashboard');
    logger.debug('Dashboard ist aufgerufen.');
    

    return (
        <div className={styles.pageContainer}>
            <h1>Dashboard</h1>
        </div>
    );
}