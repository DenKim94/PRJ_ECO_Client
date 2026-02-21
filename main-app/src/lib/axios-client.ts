import axios, { InternalAxiosRequestConfig } from 'axios';

// Basis-URL aus Environment-Variablen oder Fallback
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Öffentliche Routen, die keinen Token benötigen
const PUBLIC_ROUTES = ['api/auth/login', 'api/auth/register'];

const isPublicRoute = (url?: string): boolean =>
  PUBLIC_ROUTES.some((route) => url?.includes(route));

/**
 * @file axios-client.ts
 * 
 * Dieses Modul definiert den Axios-Client für die API-Kommunikation.
 * Es konfiguriert die Basis-URL und fügt einen Request-Interceptor hinzu,
 * der automatisch den Authentifizierungs-Token zu jeder Anfrage hinzufügt,
 * außer bei öffentlichen URLs. 
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Fügt das Token automatisch zu jeder Anfrage hinzu
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    if (!isPublicRoute(config.url)) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error instanceof Error ? error : new Error(String(error)))
);
