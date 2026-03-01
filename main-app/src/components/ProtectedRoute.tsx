import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute() {
  const { user } = useAuth();

  // Wenn kein User existiert, leite sofort zum Login um.
  // "replace" ersetzt den Verlauf, damit der "Zurück"-Button nicht wieder auf die blockierte Seite führt.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wenn eingeloggt, zeige die angeforderten Unterseiten an
  return <Outlet />;
}
