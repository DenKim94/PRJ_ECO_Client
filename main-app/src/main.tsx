import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.scss'
import '@fontsource-variable/inter'; 
import { AuthProvider } from './context/Auth/AuthProvider.tsx';
import { ThemeProvider } from './context/Theme/ThemeProvider.tsx';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
