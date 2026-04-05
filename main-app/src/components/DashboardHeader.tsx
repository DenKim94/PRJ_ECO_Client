import { useAuth } from '../hooks/useAuth';
import { Logger } from '../utils/logger';
import styles from './DashboardHeader.module.scss';

export default function DashboardHeader() {
    const logger = new Logger('DashboardHeader');
    const authService = useAuth();

    return (
        <div className={styles.headerContainer}>
            <h2>{'Dein Dashboard'}</h2>

        </div>
    );
}