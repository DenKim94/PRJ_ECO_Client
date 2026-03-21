import { useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Logger } from '../../utils/logger';
import { ApiMessageMap, ApiResponseMap, AuthContext } from './AuthContext';
import { useApiCall } from '../../hooks/useApiCall';
import { LogInRequest, RegisterRequest, PasswordResetRequest, AuthResponseModel, User, UserRoles, UserDataResponseModel } from '../../types/AuthTypes'; 


export interface CustomJwtPayload extends JwtPayload {
  sub: string;         
  roles?: string[];      
  exp: number;         
}

const logger = new Logger('AuthProvider');
const API_BASE_URL = import.meta.env.VITE_API_URL;

const getInitialAuthData = (): { token: string | null; user: User | null; remainingTimeMs: number | null } => {
  const storedToken = localStorage.getItem('token');
  
  if (!storedToken) {
    return { token: null, user: null, remainingTimeMs: null };
  }

  try {
    const decoded = jwtDecode<CustomJwtPayload>(storedToken);
    const currentTime = Date.now() / 1000;

    // Wenn Token abgelaufen ist: Sofort aus localStorage löschen und null zurückgeben
    if (decoded.exp && decoded.exp < currentTime) {
      logger.warn('Initial token is already expired. Clearing storage.');
      localStorage.removeItem('token');
      return { token: null, user: null, remainingTimeMs: null };
    }

    const user: User = { 
      name: decoded.sub, 
      role: decoded.roles?.[0] as UserRoles ?? 'USER',
      hasValidStatus: false
    };
    
    const remainingTimeMs = decoded.exp ? (decoded.exp * 1000) - Date.now() : null;

    return { token: storedToken, user, remainingTimeMs };

  } catch (err) {
    logger.error('Failed to parse initial token. Clearing storage.', err);
    localStorage.removeItem('token');
    return { token: null, user: null, remainingTimeMs: null };
  }
};

/** 
 * @file AuthProvider.tsx
 * 
 * Diese Datei definiert den AuthProvider, der die Authentifizierungslogik und -zustände für die gesamte Anwendung bereitstellt.
 * 
 * Der Provider implementiert folgende Funktionen:
 * * login: (request: LogInRequest) => Promise<Map<string, object>>;
 * * logout: () => Promise<Map<string, string>>;
 * * register: (request: RegisterRequest) => Promise<Map<string, string>>;
 * * refreshToken: () => Promise<Map<string, object>>;
 * * deleteAccount: () => Promise<Map<string, string>>;
 * * verifyEmail: (tfaCode: string) => Promise<Map<string, string>>;
 * * sendVerificationEmail: (request: {email: string}) => Promise<Map<string, string>>;
 * * resetPassword: (request: PasswordResetRequest) => Promise<Map<string, string>>;
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [initialAuthData] = useState(getInitialAuthData);
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token');
    });
    const [user, setUser] = useState<User | null>(() => {
        const savedName = localStorage.getItem('userName');
        const savedRole = localStorage.getItem('userRole');
        const savedStatus = localStorage.getItem('hasValidStatus');

        if (savedName && savedRole) {
            return {
                name: savedName,
                role: savedRole as UserRoles,
                hasValidStatus: savedStatus === 'true',
            };
        }
        return null;
    });

    const [showSessionWarning, setShowSessionWarning] = useState(false);
    const [warningTimer, setWarningTimer] = useState<NodeJS.Timeout | null>(null);
    const errorMsgRef = useRef<{ code?: number; message: string } | undefined>(undefined);

    // --- API Hooks für jede Aktion ---
    const authApi = useApiCall<AuthResponseModel>(); // Für Login und Token Refresh
    const userApi = useApiCall<UserDataResponseModel>();
    const registerApi = useApiCall<ApiResponseMap>();
    const accountApi = useApiCall<ApiMessageMap>(); // Für Logout, Delete Account, Reset Password
    const emailApi = useApiCall<ApiMessageMap>();   // Für Verifizierungs-E-Mail senden

    const isLoadingSevice : boolean = 
        authApi.isLoading || 
        registerApi.isLoading || 
        accountApi.isLoading || 
        emailApi.isLoading || 
        userApi.isLoading;

    const startWarningTimer = useCallback((expiresInMs: number) => {
        if (warningTimer){ clearTimeout(warningTimer) };

        setShowSessionWarning(false);
        // Warnung 60s vor Ablauf (mind. 10s Delay)
        const warningTime = expiresInMs - 60000;

        if (warningTime < 0) {
            logger.debug('Token expiration time is less than 60 seconds! Showing session warning immediately.');
            setShowSessionWarning(true);
            return;
        }
        const delay = warningTime >= 10000 ? warningTime : 10000;

        const timerId = setTimeout(() => {
            setShowSessionWarning(true);
        }, delay);

        setWarningTimer(timerId);
        
    }, [warningTimer]);

    const clearSession = useCallback(() => {
        if (warningTimer) { 
            clearTimeout(warningTimer); 
        } 

        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        setToken(null);
        setUser(null);
        setShowSessionWarning(false);

    }, [warningTimer]);

    const setJWT = useCallback((newToken: string, expiresInMs: number) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        startWarningTimer(expiresInMs);

    }, [startWarningTimer]);

    // Initialer Check
    useEffect(() => {
        if (initialAuthData.remainingTimeMs) {
            startWarningTimer(initialAuthData.remainingTimeMs);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    useEffect(() => {
        if (token && user) {
            localStorage.setItem('userName', user.name);
            localStorage.setItem('userRole', user.role);
        }
    }, [user, token]);

    const login = async (request: LogInRequest): Promise<AuthResponseModel | null> => {
        const response = await authApi.fetchData({ method: 'POST', url: `${API_BASE_URL}/api/auth/login`, data: request });
        if (!response) {
            errorMsgRef.current = authApi.errorMsg.current;
            return null;
        }
        
        setJWT(response.token, response.expiresIn);
        setUser({ name: response.userName, role: response.role as UserRoles, hasValidStatus: response.hasValidStatus });

        return response;
    };

    const register = async (request: RegisterRequest): Promise<ApiResponseMap | null> => {
        const response = await registerApi.fetchData({ method: 'POST', url: `${API_BASE_URL}/api/auth/register`, data: request });
       if (!response) { 
            errorMsgRef.current = registerApi.errorMsg.current;
            return null;
       }
       return response; 
    };

    const getUserData = async (): Promise<UserDataResponseModel | null> => {
        const response = await userApi.fetchData({ method: 'GET', url: `${API_BASE_URL}/api/auth/user/get-info` });
        if (!response) {
            errorMsgRef.current = userApi.errorMsg.current;
            return null;
        }
        return response;
    };

    const logout = async (): Promise<ApiMessageMap> => {
        const response = await accountApi.fetchData({ method: 'POST', url: `${API_BASE_URL}/api/auth/logout` });

        if (!response) { 
            errorMsgRef.current = accountApi.errorMsg.current; 
            return { message: accountApi.errorMsg.current?.message  ?? 'Logout failed.' };
        }
        clearSession();
        return response;
    };

    const sendVerificationEmail = async (request: {email: string}): Promise<ApiMessageMap> => {
        const response = await emailApi.fetchData({ method: 'POST', url: `${API_BASE_URL}/api/auth/user-password/request`, data: request });

        if (!response) { 
            errorMsgRef.current = emailApi.errorMsg.current; 
            return { message: emailApi.errorMsg.current?.message  ?? 'Request failed.' };
        }
        return response;
    };

    const resetPassword = async (request: PasswordResetRequest): Promise<ApiMessageMap> => {
        const response = await accountApi.fetchData({ method: 'POST', url: `${API_BASE_URL}/api/auth/user-password/reset`, data: request });
        
        if (!response) { 
            errorMsgRef.current = accountApi.errorMsg.current; 
            return { message: accountApi.errorMsg.current?.message  ?? 'Request failed.' };
        }
        return response;
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!token && !!user, 
            showSessionWarning,
            isLoading: isLoadingSevice,
            errorMsgRef: errorMsgRef, 
            login,
            logout,
            register,
            getUserData,
            sendVerificationEmail,
            resetPassword,
            // refreshToken,
            // deleteAccount,
            // verifyEmail,
         }}>

            {children}
        </AuthContext.Provider>
    );
};

