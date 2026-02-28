import { useState, useEffect, useCallback, ReactNode, use } from 'react';
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
    const userApi = useApiCall<UserDataResponseModel>();
    const registerApi = useApiCall<ApiResponseMap>();
    const logoutApi = useApiCall<ApiMessageMap>();
    const refreshApi = useApiCall<AuthResponseModel>();
    const deleteApi = useApiCall<ApiMessageMap>();
    const verifyEmailApi = useApiCall<ApiMessageMap>();
    const resendEmailApi = useApiCall<ApiMessageMap>();
    const resetPasswordApi = useApiCall<ApiMessageMap>();

    const isAnyLoading : boolean = 
        loginApi.isLoading || registerApi.isLoading || logoutApi.isLoading || 
        refreshApi.isLoading || deleteApi.isLoading || verifyEmailApi.isLoading || 
        resendEmailApi.isLoading || resetPasswordApi.isLoading;

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
            localStorage.setItem('hasValidStatus', JSON.stringify(user.hasValidStatus));
        }
    }, [user, token]);

    const login = async (request: LogInRequest): Promise<AuthResponseModel | null> => {
        const response = await loginApi.fetchData({ method: 'POST', url: 'api/auth/login', data: request });
        if (!response) {
            setErrorMessage("Login failed: " + loginApi.errorMsg);  
            return null;
        }
        
        const userData = await getUserData();
        if (userData) {
            setUser({
                name: userData.name,
                role: userData.role,
                hasValidStatus: userData.hasValidStatus
            });
        }

        if (!userData || userApi.errorMsg){
            logger.error('Login succeeded but failed to retrieve user data. ', userApi.errorMsg);
            setErrorMessage("Failed to retrieve user data after login. " + userApi.errorMsg);
            return null;
        }
        
        setJWT(response.token, response.expiresIn);

        return response;
    };

    const register = async (request: RegisterRequest): Promise<ApiResponseMap | null> => {
        const response = await registerApi.fetchData({ method: 'POST', url: 'api/auth/register', data: request });
       if (!response) { 
            setErrorMessage("Register failed: " + registerApi.errorMsg); 
            return null;
       }
       return response; 
    };

    const getUserData = async (): Promise<UserDataResponseModel | null> => {
        const response = await userApi.fetchData({ method: 'GET', url: 'api/auth/user/get-info' });
        if (!response) {
            setErrorMessage("Get user data failed: " + userApi.errorMsg);  
            return null;
        }
        return response;
    };

    const logout = async (): Promise<ApiMessageMap> => {
        const response = await logoutApi.fetchData({ method: 'POST', url: 'api/auth/logout' });

        if (!response) { 
            setErrorMessage("Logout failed: " + logoutApi.errorMsg); 
            return { message: logoutApi.errorMsg  ?? 'Logout failed' };
        }
        clearSession();
        return response;
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
            getUserData,
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

