import { NavLink } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import styles from './MobileMenuBar.module.scss';

interface MobileBottomBarProps {
    onAddClick: () => void;
}

export default function MobileBottomBar({ onAddClick }: MobileBottomBarProps) {
    const { theme } = useTheme();

    return (
        <nav className={styles.bottomBarContainer}>
            <NavLink 
                to="/dashboard" 
                end 
                className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}
            >
                <img src={theme === 'light' ? '/home_icon_dark.svg' : '/home_icon_light.svg'} alt="Übersicht" width={24} height={24} />
                <span className={styles.label}>{'Übersicht'}</span>
            </NavLink>
            
            <NavLink 
                to="/dashboard/data" 
                className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}
            >
                <img src={theme === 'light' ? '/data_table_icon_dark.svg' : '/data_table_icon_light.svg'} alt="Daten" width={24} height={24} />
                <span className={styles.label}>{'Daten'}</span>
            </NavLink>
            
            {/* Zentraler Floating Action Button (FAB) für neue Datenpunkte */}
            <button 
                type="button"
                className={styles.fabButton} 
                onClick={onAddClick}
                aria-label="Neuen Datenpunkt aufnehmen"
            >
                +
            </button>

            <NavLink 
                to="/dashboard/settings" 
                className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}
            >
                <img src={theme === 'light' ? '/settings_icon_dark.svg' : '/settings_icon_light.svg'} alt="Einstellungen" width={24} height={24} />
                <span className={styles.label}>{'Settings'}</span>
            </NavLink>

            <NavLink 
                to="/dashboard/calculation" 
                className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}
            >
                <img src={theme === 'light' ? '/chart_data_icon_dark.svg' : '/chart_data_icon_light.svg'} alt="Diagramme" width={24} height={24} />
                <span className={styles.label}>{'Analysen'}</span>
            </NavLink>
        </nav>
    );
}
