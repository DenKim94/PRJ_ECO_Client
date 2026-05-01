import styles from './DashboardHeader.module.scss';
import UserProfileSkeleton from './UserProfileSkeleton';

export default function DashboardHeader() {

    return (
        <div className={styles.headerContainer}>
            <h2>{'Dein Dashboard'}</h2>
            <UserProfileSkeleton />
        </div>
    );
}
