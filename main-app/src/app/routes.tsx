import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import LogIn from '../pages/LogIn';
import Register from '../components/Register';
import PasswordReset from '../components/PasswordReset';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from '../routes-composer/ProtectedRoute';
import Settings from '../pages/Settings';
import Overview from '../pages/Overview';
import Dataview from '../pages/Dataview';
import AdminRoute from '../routes-composer/AdminRoute';
import Adminview from '../pages/Adminview';


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
            element: <Navigate to="/dashboard" replace />, 
        },
          {
              path: 'login',
              element: <LogIn />,
          },
          {
              path: 'register',
              element: <Register />,
          },
          {
              path: 'password-reset',
              element: <PasswordReset />,
          },
      {
        // Geschützter Bereich (nur für eingeloggte User)
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard', 
            element: <Dashboard />,
                  // Die Sub-Routen des Dashboards
                  children: [
                      {
                          // "index: true" bedeutet: Wenn nur "/dashboard" aufgerufen wird, 
                          // zeige standardmäßig die Overview-Komponente
                          index: true, 
                          element: <Overview /> 
                      },
                      {
                          // URL: /dashboard/data
                          path: 'data', 
                          element: <Dataview />
                      },
                      {
                          // URL: /dashboard/settings
                          path: 'settings', 
                          element: <Settings />
                      },
                      {
                          // Der AdminRoute-Guard sichert diesen Bereich ab
                          element: <AdminRoute />, 
                          children: [
                              { 
                                  path: 'admin', 
                                  element: <Adminview /> // Rendert im Dashboard-Outlet
                              }
                          ]
                      }
                  ]
          },
        ],
      },
    ],
  },
]);
