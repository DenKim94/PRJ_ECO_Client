import { useAuth } from "../hooks/useAuth";
import { Logger } from "../utils/logger";
import styles from "./Dashboard.module.scss";

export default function Dashboard() {
    const auth = useAuth();
    const logger = new Logger('Dashboard');
    logger.debug('Dashboard ist aufgerufen.');
    

    return (
        <div className={styles.pageContainer}>
            <h1>Dashboard</h1>
        </div>
    );
}