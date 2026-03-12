import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import LogIn from '../pages/LogIn';
import Register from '../components/Register';
// import Dashboard from '../pages/Dashboard';
// import ProtectedRoute from '../components/ProtectedRoute'; // Bauen wir in Schritt 3

// Hier definieren wir den Router als Baumstruktur
export const router = createBrowserRouter([
  {
    // Die Wurzel der App (App.tsx dient als Haupt-Layout)
    path: '/',
    element: <App />,
    // Alle weiteren Routen werden in App.tsx als <Outlet /> gerendert
    children: [
        {
            index: true, 
            element: <Navigate to="/login" replace />, 
        },
          {
              path: 'login',
              element: <LogIn />,
          },
          {
              path: 'register',
              element: <Register />,
          },
    //   {
    //     // Geschützter Bereich (nur für eingeloggte User)
    //     element: <ProtectedRoute />,
    //     children: [
    //       {
    //         index: true, // Das entspricht dem Pfad "/" innerhalb des ProtectedRoutes
    //         element: <Dashboard />,
    //       },
    //       // Hier können weitere geschützte Routen hin:
    //       // { path: 'settings', element: <Settings /> },
    //       // { path: 'analytics', element: <Analytics /> },
    //     ],
    //   },
    ],
  },
]);
