import { useState, useEffect, useCallback, ReactNode } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Logger } from '../../utils/logger';
import { ApiMessageMap, ApiResponseMap, AuthContext, User, UserRoles } from './AuthContext';
import { useApiCall } from '../../hooks/useApiCall';
import { LogInRequest, RegisterRequest, PasswordResetRequest, AuthResponseModel } from '../../types/AuthTypes'; 


export interface CustomJwtPayload extends JwtPayload {
  sub: string;         
  roles?: string[];      
  exp: number;         
}

const logger = new Logger('AuthProvider');

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
 * * resendVerificationEmail: () => Promise<Map<string, string>>;
 * * resetPassword: (request: PasswordResetRequest) => Promise<Map<string, string>>;
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [initialAuthData] = useState(getInitialAuthData);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);
    const [showSessionWarning, setShowSessionWarning] = useState(false);
    const [warningTimer, setWarningTimer] = useState<NodeJS.Timeout | null>(null);
    const [errorMsg, setErrorMessage] = useState<string | undefined>(undefined);

    // --- API Hooks für jede Aktion ---
    const loginApi = useApiCall<AuthResponseModel>();
    const registerApi = useApiCall<ApiResponseMap>();
    const logoutApi = useApiCall<ApiMessageMap>();
    const refreshApi = useApiCall<AuthResponseModel>();
    const deleteApi = useApiCall<ApiMessageMap>();
    const verifyEmailApi = useApiCall<ApiMessageMap>();
    const resendEmailApi = useApiCall<ApiMessageMap>();
    const resetPassApi = useApiCall<ApiMessageMap>();

    const isAnyLoading : boolean = 
        loginApi.isLoading || registerApi.isLoading || logoutApi.isLoading || 
        refreshApi.isLoading || deleteApi.isLoading || verifyEmailApi.isLoading || 
        resendEmailApi.isLoading || resetPassApi.isLoading;

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
        if (warningTimer) { clearTimeout(warningTimer); } 
        localStorage.removeItem('token');
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

    const login = async (request: LogInRequest): Promise<AuthResponseModel | null> => {

        await loginApi.fetchData({ method: 'POST', url: 'api/auth/login', data: request });

        if ((!loginApi.payload) || !loginApi.isLoading && loginApi.errorMsg) { 
            setErrorMessage(loginApi.errorMsg); 
            return null;
        }

        setJWT(loginApi.payload.token, loginApi.payload.expiresIn);
        return loginApi.payload;
    };

    const register = async (request: RegisterRequest): Promise<ApiResponseMap | null> => {
       await registerApi.fetchData({ method: 'POST', url: 'api/auth/register', data: request });
       if ((!registerApi.payload) || !registerApi.isLoading && registerApi.errorMsg) { 
        setErrorMessage(registerApi.errorMsg); 
        return null;
       }
       return registerApi.payload; 
    };

    const logout = async (): Promise<ApiMessageMap> => {
        await logoutApi.fetchData({ method: 'POST', url: 'api/auth/logout' });

        if ((!logoutApi.payload) || !logoutApi.isLoading && logoutApi.errorMsg) { 
            setErrorMessage(logoutApi.errorMsg); 
            return { message: logoutApi.errorMsg  ?? 'Logout failed' };
        }
        clearSession();
        return logoutApi.payload;
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!token, 
            showSessionWarning,
            isLoading: isAnyLoading,
            errorMsg, 
            login,
            logout,
            register,
            // refreshToken,
            // deleteAccount,
            // verifyEmail,
            // resendVerificationEmail,
            // resetPassword
         }}>

            {children}
        </AuthContext.Provider>
    );
};

