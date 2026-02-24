import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.scss'
import '@fontsource-variable/inter'; 
import App from './app/App.tsx'
import { AuthProvider } from './context/Auth/AuthProvider.tsx';
import { ThemeProvider } from './context/Theme/ThemeProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
