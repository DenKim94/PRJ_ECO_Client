import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.scss'
import { AuthProvider } from './context/Auth/AuthProvider.tsx';
import { ThemeProvider } from './context/Theme/ThemeProvider.tsx';
import { ConfigurationProvider } from './context/Configs/ConfigurationProvider.tsx';
import { TrackingProvider } from './context/Tracking/TrackingProvider.tsx';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import { CalculationProvider } from './context/Calculation/CalculationProvider.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ConfigurationProvider>
          <TrackingProvider>
            <CalculationProvider>
              <RouterProvider router={router} />
            </CalculationProvider>
          </TrackingProvider>
        </ConfigurationProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
