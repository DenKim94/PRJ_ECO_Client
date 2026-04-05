import { useAuth } from '../hooks/useAuth';
import styles from './DashboardHeader.module.scss';

export default function DashboardHeader() {
    const authService = useAuth();

    return (
        <div className={styles.headerContainer}>
            <h2>{'Dein Dashboard'}</h2>
            <span>{authService.user?.name}</span>
        </div>
    );
}