import { useState, useEffect, useCallback, ReactNode } from 'react';
import { apiClient } from '../lib/axios-client';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { AuthResponseModel } from '../types/AuthResponseModel';
import { Logger } from '../utils/logger';
import { AuthContext, User, UserRoles } from './AuthContext';


export interface CustomJwtPayload extends JwtPayload {
  sub: string;         
  roles?: string[];      
  exp: number;         
}

const logger = new Logger('AuthContext');

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);
    const [showSessionWarning, setShowSessionWarning] = useState(false);
    const [warningTimer, setWarningTimer] = useState<NodeJS.Timeout | null>(null);

    const startWarningTimer = useCallback((expiresInMs: number) => {
        if (warningTimer) clearTimeout(warningTimer);

        setShowSessionWarning(false);

        // Warnung 60s vor Ablauf (mind. 10s Delay)
        const warningTime = expiresInMs - 60000;
        const delay = warningTime >= 10000 ? warningTime : 10000;

        const timerId = setTimeout(() => {
            setShowSessionWarning(true);
        }, delay);

        setWarningTimer(timerId);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const logout = useCallback(() => {
        if (warningTimer){ clearTimeout(warningTimer) };

        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setShowSessionWarning(false);

        logger.debug('User has been logged out.');

    }, [warningTimer]);

    // Initialer Check
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode<CustomJwtPayload>(token);
                const currentTime = Date.now() / 1000;
                
                if (decoded.exp < currentTime) {
                    logout();

                } else {
                    setUser({ 
                        name: decoded.sub, 
                        role: decoded.roles?.[0] as UserRoles ?? 'USER',
                        hasValidStatus: true });

                    const remainingTimeMs = (decoded.exp * 1000) - Date.now();
                    startWarningTimer(remainingTimeMs);
                }

            } catch(error) {
                logger.error('Failed setting the warning timer.', error);
                logout();
            }
        }
    }, [token, startWarningTimer, logout]);

    function login (newToken: string, expiresInMs: number) {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        const decoded = jwtDecode<CustomJwtPayload>(newToken);

        setUser({ 
            name: decoded.sub, 
            role: decoded.roles?.[0] as UserRoles ?? 'USER', 
            hasValidStatus: true });

        startWarningTimer(expiresInMs);
        logger.debug('User logged in.');
    };


    async function refreshToken() {
        try {
            const { data } = await apiClient.post<AuthResponseModel>('/auth/refresh-token'); // TODO: Endpunkt anpassen
            // Angenommen Backend liefert { token: "...", expiresIn: 900000 }
            login(data.token, data.expiresIn);
            setShowSessionWarning(false); // Warnung weg

        } catch (error) {
            logger.error('Failed refreshing token.', error);
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, refreshToken, isAuthenticated: !!token, showSessionWarning }}>
            {children}
        </AuthContext.Provider>
    );
};

