import { Logger } from "../utils/logger";

export default function Dashboard() {
    const logger = new Logger('Dashboard');
    logger.debug('Dashboard ist aufgerufen.');
    
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}