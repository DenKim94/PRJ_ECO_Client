import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminRoute() {
    const authService = useAuth();
    
    // Solange die Daten geladen werden, nichts rendern (verhindert Flackern)
    if (authService.isLoading) {
        return null; 
    }

    // Wenn der User KEIN Admin ist, leite ihn auf das Dashboard zurück
    if (authService.userDetailedData?.role !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

    // Wenn er Admin ist, zeige den Inhalt der Unterroute an
    return <Outlet />;
}
