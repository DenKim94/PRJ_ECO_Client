import { useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Logger } from '../../utils/logger';
import { AuthContext } from './AuthContext';
import { ApiMessageMap, ApiResponseMap } from '../../types/AuthTypes';
import { useApiCall } from '../../hooks/useApiCall';
import { LogInRequest, RegisterRequest, PasswordResetRequest, AuthResponseModel, User, UserRoles, UserDataResponseModel, ResponseMessage, AllUserDataResponse } from '../../types/AuthTypes'; 


export interface CustomJwtPayload extends JwtPayload {
  sub: string;         
  userRole: UserRoles;      
  exp: number;
  hasValidStatus: boolean;
  tokenVersion: number;         
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
      logger.warn('Initialer Token ist abgelaufen. Entferne ungültigen Token aus localStorage.');
      localStorage.removeItem('token');
      return { token: null, user: null, remainingTimeMs: null };
    }

    const user: User = { 
      name: decoded.sub, 
      role: decoded.userRole,
      hasValidStatus: decoded.hasValidStatus
    };
    
    const remainingTimeMs = decoded.exp ? (decoded.exp * 1000) - Date.now() : null;
    logger.debug('Authentifizierungsdaten erfolgreich initialisiert.', { user, remainingTimeMs });
    return { token: storedToken, user, remainingTimeMs };

  } catch (err) {
    logger.error('Fehler beim Initialisieren des Tokens', err);
    localStorage.removeItem('token');
    return { token: null, user: null, remainingTimeMs: null };
  }
};

/** 
 * @file AuthProvider.tsx
 * 
 * Diese Datei definiert den AuthProvider, der die Authentifizierungslogik und -zustände für die gesamte Anwendung bereitstellt.
 *
 * Der Provider beinhaltet folgende Daten:
 * * user: User | null;
 * * userDetailedData: UserDataResponseModel | null;
 * * adminUserData: AllUserDataResponse[];
 * * isAuthenticated: boolean;
 * * showSessionWarning: boolean;
 * * sessionTimeRemaining: RefObject<number>;
 * * isLoading: boolean;
 * * deleteAccountRequested: boolean;
 * * errorMsgRef: RefObject<ResponseMessage | undefined>;
 *
 * Der Provider implementiert folgende Funktionen:
 * * login: (request: LogInRequest) => Promise<AuthResponseModel | null>;
 * * logout: () => Promise<ApiMessageMap>;
 * * register: (request: RegisterRequest) => Promise<ApiResponseMap | null>;
 * * getUserData: () => Promise<UserDataResponseModel | null>;
 * * refreshToken: () => Promise<boolean>;
 * * setDeleteAccountRequested: (requested: boolean) => void;
 * * deleteAccount: () => Promise<ApiMessageMap>;
 * * resendVerificationEmail: () => Promise<ApiMessageMap>;
 * * verifyEmail: (tfaCode: string) => Promise<ApiMessageMap>;
 * * sendPasswordVerificationEmail: (request: {email: string}) => Promise<ApiMessageMap>;
 * * resetPassword: (request: PasswordResetRequest) => Promise<ApiMessageMap>;
 * * adminDeleteUserById: (userId: number) => Promise<ApiMessageMap>;
 * * adminSetUserStatusById: (userId: number, isEnabled: boolean) => Promise<ApiMessageMap>;
 * * adminGetAllUsers: () => Promise<AllUserDataResponse[]>;
 * * adminUpdatePassword: (newPassword: string) => Promise<ApiMessageMap>;
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [initialAuthData] = useState(getInitialAuthData);
    const [userDetailedData, setUserDetailedData] = useState<UserDataResponseModel | null>(null);
    const [adminUserData, setAdminUserData] = useState<AllUserDataResponse[]>([]);
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token');
    });
    const [user, setUser] = useState<User | null>(() => {
        const savedName = localStorage.getItem('userName');
        const savedRole = localStorage.getItem('userRole');
        const savedHasValidStatus = localStorage.getItem('hasValidStatus');

        if (savedName && savedRole) {
            return {
                name: savedName,
                role: savedRole as UserRoles,
                hasValidStatus: savedHasValidStatus === 'true',
            };
        }
        return null;
    });

    const [showSessionWarning, setShowSessionWarning] = useState(false);
    const [deleteAccountRequested, setDeleteAccountRequested] = useState(false);
    const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const sessionTimeRemaining = useRef<number>(initialAuthData.remainingTimeMs ?? 0);
    const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const errorMsgRef = useRef<ResponseMessage | undefined>(undefined);

    // --- API Hooks für jede Aktion ---
    const authApi = useApiCall<AuthResponseModel>(); // Für Login und Token Refresh
    const userApi = useApiCall<UserDataResponseModel>();
    const adminUserApi = useApiCall<AllUserDataResponse[]>(); // Für Admin-Funktion: Alle Benutzer abrufen
    const registerApi = useApiCall<ApiResponseMap>();
    const accountApi = useApiCall<ApiMessageMap>(); // Für Logout, Delete Account, Reset Password
    const emailApi = useApiCall<ApiMessageMap>();   // Für Verifizierungs-E-Mail senden

    const isLoadingSevice : boolean = 
        authApi.isLoading || 
        registerApi.isLoading || 
        accountApi.isLoading || 
        emailApi.isLoading || 
        userApi.isLoading || 
        adminUserApi.isLoading;

    const clearSession = useCallback(() => {
    if (warningTimerRef.current) { clearTimeout(warningTimerRef.current) };
    if (countdownIntervalRef.current) { clearInterval(countdownIntervalRef.current) };

        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('hasValidStatus');
        setToken(null);
        setUser(null);
        setShowSessionWarning(false);
        logger.debug('Aktuelle Session wurde zurückgesetzt.');
        errorMsgRef.current = undefined;

    }, []);

    const startWarningTimer = useCallback((expiresInMs: number) => {
    if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
        warningTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
    }

        const warningThresholdMs = 60000; // Warnung 60 Sekunden vor Ablauf
        setShowSessionWarning(false);
        sessionTimeRemaining.current = Math.floor(expiresInMs / 1000);
        const timeUntilWarning = expiresInMs - warningThresholdMs;

        // Hilfsfunktion für den sekündlichen Countdown
        const startCountdown = (initialRemainingMs: number) => {
            logger.warn(`Token läuft in ${initialRemainingMs/1000} Sekunden ab.`);
            setShowSessionWarning(true);
            let currentRemainingMs = initialRemainingMs;
            sessionTimeRemaining.current = Math.floor(currentRemainingMs / 1000);

            countdownIntervalRef.current = setInterval(() => {
                currentRemainingMs -= 1000;
                
                if (currentRemainingMs <= 0) {
                    logger.debug('Token ist abgelaufen.');
                    if (countdownIntervalRef.current) {
                        clearInterval(countdownIntervalRef.current);
                        countdownIntervalRef.current = null;
                    }
                    sessionTimeRemaining.current = 0;
                    setShowSessionWarning(false);
                    clearSession(); // User ausloggen

                } else {
                    sessionTimeRemaining.current = Math.floor(currentRemainingMs/1000);
                }
            }, 1000);
        };

        // Fall 1: Token läuft in weniger als warningThresholdMs ab -> Sofort Countdown starten
        if (timeUntilWarning <= 0) {
            startCountdown(expiresInMs);
            return;
        }

        // Fall 2: Genug Zeit übrig -> Timer setzen, der später den Countdown startet
        warningTimerRef.current = setTimeout(() => {
            setShowSessionWarning(true);
            startCountdown(warningThresholdMs);
        }, timeUntilWarning);

        logger.debug(`Token-Warntimer wurde gestartet. Token läuft in ${expiresInMs/1000} Sekunden ab.`);

    }, [clearSession]);

    const setJWT = useCallback((newToken: string, expiresInMs: number) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        startWarningTimer(expiresInMs);

    }, [startWarningTimer]);

    // Initialer Check
    useEffect(() => {
        if (initialAuthData.remainingTimeMs) {
            startWarningTimer(initialAuthData.remainingTimeMs);
            sessionTimeRemaining.current = Math.floor(initialAuthData.remainingTimeMs / 1000);
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    useEffect(() => {
        if (token && user) {
            localStorage.setItem('userName', user.name);
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('hasValidStatus', user.hasValidStatus ? 'true' : 'false');
        }
    }, [user, token]);

    useEffect(() => {
        const savedName = localStorage.getItem('userName');
        const savedRole = localStorage.getItem('userRole');

        const initUserData = async (): Promise<UserDataResponseModel | null> => {
            const userData = await getUserData();
            if (userData) {
                setUser({ name: userData.name, 
                        role: userData.role, 
                        hasValidStatus: userData.isEnabled && userData.isValidatedEmail });
                        
                return userData;
            }
            return null;
        };

        if (token && savedName && savedRole) {
            initUserData().then((response) => {
                if (response){
                    logger.debug('Initiale Benutzerdaten wurden erfolgreich geladen.', response);
                }else{
                    logger.warn('Initiale Benutzerdaten konnten nicht geladen werden. Möglicherweise ist der Token ungültig oder abgelaufen.');
                }
            }).catch((err) => {
                logger.error('Fehler beim Laden der initialen Benutzerdaten', err);
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const login = useCallback(async (request: LogInRequest): Promise<AuthResponseModel | null> => {
        logger.debug('Login ...', { userName: request.username });
        const response = await authApi.fetchData({ method: 'POST', url: `${API_BASE_URL}/api/auth/login`, data: request });
        if (!response) {
            errorMsgRef.current = authApi.errorMsg.current;
            return null;
        }
        setJWT(response.token, response.expiresIn);
        setUser({ name: response.userName, role: response.role as UserRoles, hasValidStatus: response.hasValidStatus });

        logger.debug('Login erfolgreich.', 
            { userName: response.userName, role: response.role, hasValidStatus: response.hasValidStatus });

        errorMsgRef.current = undefined;
        return response;
    }, [authApi, setJWT]);

    const register = useCallback(async (request: RegisterRequest): Promise<ApiResponseMap | null> => {
        logger.debug('Registriere neuen Benutzer ...', { email: request.email });
        const response = await registerApi.fetchData({ method: 'POST', url: `${API_BASE_URL}/api/auth/register`, data: request });
       if (!response) { 
            errorMsgRef.current = registerApi.errorMsg.current;
            return null;
       }
       logger.debug('Registrierung erfolgreich.');
       clearSession();
       return response; 
    }, [registerApi, clearSession]);

    const getUserData = useCallback( async (): Promise<UserDataResponseModel | null> => {
        logger.debug('Lade Benutzerdaten ...');
        const response = await userApi.fetchData({ method: 'GET', url: `${API_BASE_URL}/api/auth/user/get-info` });
        if (!response) {
            errorMsgRef.current = userApi.errorMsg.current;
            return null;
        }
        setUserDetailedData(response);
        setUser({ name: response.name, 
            role: response.role, 
            hasValidStatus: (response.isEnabled && response.isValidatedEmail) });

        logger.debug('Benutzerdaten erfolgreich geladen.', { name: response.name, role: response.role });
        errorMsgRef.current = undefined;
        return response;
    }, [userApi]);

    const logout = useCallback(async (): Promise<ApiMessageMap> => {
        logger.debug('Logout ...');
        const response = await accountApi.fetchData({ method: 'POST', url: `${API_BASE_URL}/api/auth/logout` });
        if (!response) { 
            errorMsgRef.current = accountApi.errorMsg.current; 
            return { message: accountApi.errorMsg.current?.message  ?? 'Logout ist fehlgeschlagen.' };
        }
        clearSession();
        logger.debug('Logout erfolgreich.');
        return response;
    }, [accountApi, clearSession]);

    const sendPasswordVerificationEmail = useCallback(async (request: {email: string}): Promise<ApiMessageMap> => {
        const response = await emailApi.fetchData({ method: 'POST', url: `${API_BASE_URL}/api/auth/user-password/request`, data: request });
        if (!response) { 
            errorMsgRef.current = emailApi.errorMsg.current; 
            return { message: emailApi.errorMsg.current?.message  ?? 'Anfrage ist fehlgeschlagen.' };
        }
        errorMsgRef.current = undefined;
        return response;
    }, [emailApi]);

    const resetPassword = useCallback(async (request: PasswordResetRequest): Promise<ApiMessageMap> => {
        logger.debug('Passwort zurücksetzen ...', { email: request.email });
        const response = await accountApi.fetchData({ method: 'POST', url: `${API_BASE_URL}/api/auth/user-password/reset`, data: request });
        if (!response) { 
            errorMsgRef.current = accountApi.errorMsg.current; 
            return { message: accountApi.errorMsg.current?.message  ?? 'Anfrage ist fehlgeschlagen.' };
        }
        logger.debug('Passwort erfolgreich zurückgesetzt.');
        errorMsgRef.current = undefined;
        return response;
    }, [accountApi]);

    const refreshToken = useCallback(async (): Promise<boolean> => {
        logger.debug('Token aktualisieren ...');
        const response = await authApi.fetchData({ method: 'POST', url: `${API_BASE_URL}/api/auth/refresh-token` });
        if (!response) { 
            errorMsgRef.current = authApi.errorMsg.current; 
            return false;
        }
        setJWT(response.token, response.expiresIn);
        setUser({ name: response.userName, role: response.role as UserRoles, hasValidStatus: response.hasValidStatus });
        logger.debug('Token erfolgreich aktualisiert.');
        errorMsgRef.current = undefined;
        return true;
    }, [authApi, setJWT, setUser]);

    const deleteAccount = useCallback(async (): Promise<ApiMessageMap> => {
        logger.debug('Account löschen ...');
        const response = await accountApi.fetchData({ method: 'DELETE', url: `${API_BASE_URL}/api/auth/delete-account` });
        if (!response) { 
            errorMsgRef.current = accountApi.errorMsg.current; 
            return { message: accountApi.errorMsg.current?.message  ?? 'Anfrage ist fehlgeschlagen.' };
        }
        clearSession();
        logger.debug('Account erfolgreich gelöscht.');
        errorMsgRef.current = undefined;
        return response;
    }, [accountApi, clearSession]);

    const verifyEmail = useCallback(async (code: string): Promise<ApiMessageMap> => {
        logger.debug('E-Mail verifizieren ...');
        const response = await accountApi.fetchData({ method: 'POST', url: `${API_BASE_URL}/api/auth/verify-email`, data: { code } });
        if (!response) { 
            errorMsgRef.current = accountApi.errorMsg.current; 
            return { message: accountApi.errorMsg.current?.message  ?? 'Anfrage ist fehlgeschlagen.' };
        }
        setUserDetailedData(prev => {
            // Wenn prev null ist, wird nichts aktualisiert
            if (!prev) return prev; 
            return { 
                ...prev, 
                isValidatedEmail: true 
            };
        });
        logger.debug('E-Mail erfolgreich verifiziert.');
        errorMsgRef.current = undefined;
        return response;
    }, [accountApi]);

    const resendVerificationEmail = useCallback(async (): Promise<ApiMessageMap> => {
        logger.debug('E-Mail senden ...');
        const response = await emailApi.fetchData({ method: 'POST', url: `${API_BASE_URL}/api/auth/resend-email` });
        if (!response) { 
            errorMsgRef.current = emailApi.errorMsg.current; 
            return { message: emailApi.errorMsg.current?.message  ?? 'Anfrage ist fehlgeschlagen.' };
        }
        logger.debug(`${response.message}`);
        errorMsgRef.current = undefined;
        return response;
    }, [emailApi]);

    /**
     * Prüft synchron, ob der aktuell im localStorage liegende Token noch gültig ist.
     * @returns {boolean} true wenn gültig, false wenn abgelaufen oder nicht vorhanden
     */
    const isTokenValid = (): boolean => {
        const currentToken = localStorage.getItem('token');
        
        if (!currentToken) {
            return false;
        }

        const decoded = jwtDecode<{ exp?: number }>(currentToken);
        
        if (!decoded.exp) {
            return false; // Kein Ablaufdatum definiert = ungültig für unser System
        }

        const currentTimeInSeconds = Date.now() / 1000;
        
        // true zurückgeben, wenn die Expiration-Time in der Zukunft liegt
        return decoded.exp > currentTimeInSeconds;
    };

    // --- Admin-Funktionen ---
    const adminDeleteUserById = useCallback(async (userId: number): Promise<ApiMessageMap> => {
        logger.debug(`[Admin] - Benutzer mit ID ${userId} löschen ...`);
        const response = await accountApi.fetchData({ method: 'DELETE', url: `${API_BASE_URL}/api/admin/users/{id}/remove"` });
        if (!response) { 
            errorMsgRef.current = accountApi.errorMsg.current; 
            return { message: accountApi.errorMsg.current?.message  ?? `Anfrage zum Löschen des Benutzers mit ID ${userId} ist fehlgeschlagen.` };
        }
        errorMsgRef.current = undefined;
        logger.debug(`[Admin] - Benutzer mit ID ${userId} erfolgreich gelöscht.`);
        return response;
    }, [accountApi]);

    const adminSetUserStatusById = useCallback(async (userId: number, isEnabled: boolean): Promise<ApiMessageMap> => {
        logger.debug(`[Admin] - Benutzer mit ID ${userId} ${isEnabled ? 'aktivieren' : 'deaktivieren'} ...`);
        const response = await accountApi.fetchData({ method: 'PATCH', url: `${API_BASE_URL}/api/admin/users/${userId}/set-status`, data: { isEnabled } });
        if (!response) { 
            errorMsgRef.current = accountApi.errorMsg.current; 
            return { message: accountApi.errorMsg.current?.message  ?? `Anfrage zum Setzen des Status des Benutzers mit ID ${userId} ist fehlgeschlagen.` };
        }
        logger.debug(`[Admin] - Benutzer mit ID ${userId} wurde erfolgreich ${isEnabled ? 'aktiviert' : 'deaktiviert'}.`);
        errorMsgRef.current = undefined;
        return response;
    }, [accountApi]);

    const adminGetAllUsers = useCallback(async (): Promise<AllUserDataResponse[]> => {
        logger.debug(`[Admin] - Alle Benutzerdaten abrufen ...`);
        const response = await adminUserApi.fetchData({ method: 'GET', url: `${API_BASE_URL}/api/admin/get-users` });
        if (!response) { 
            errorMsgRef.current = adminUserApi.errorMsg.current; 
            return [];
        }
        logger.debug(`[Admin] - Alle Benutzerdaten erfolgreich abgerufen.`, response);
        setAdminUserData(response);
        errorMsgRef.current = undefined;
        return response;
    }, [adminUserApi]);

    const adminUpdatePassword = useCallback(async (newPassword: string): Promise<ApiMessageMap> => {
        logger.debug(`[Admin] - Passwort aktualisieren ...`);
        const response = await accountApi.fetchData({ method: 'PUT', url: `${API_BASE_URL}/api/admin/update-password`, data: { newPassword } });
        if (!response) { 
            errorMsgRef.current = accountApi.errorMsg.current; 
            return { message: accountApi.errorMsg.current?.message  ?? `Anfrage zum Aktualisieren des Passworts ist fehlgeschlagen.` };
        }
        logger.debug(`[Admin] - Passwort erfolgreich aktualisiert.`);
        errorMsgRef.current = undefined;
        return response;
    }, [accountApi]);

    return (
        <AuthContext.Provider value={{ 
            user,
            userDetailedData,
            adminUserData, 
            isAuthenticated: !!token && !!user, 
            showSessionWarning,
            sessionTimeRemaining,
            isLoading: isLoadingSevice,
            deleteAccountRequested,
            errorMsgRef, 
            isTokenValid,
            login,
            logout,
            register,
            getUserData,
            setDeleteAccountRequested,
            sendPasswordVerificationEmail,
            resetPassword,
            refreshToken,
            resendVerificationEmail,
            deleteAccount,
            verifyEmail,
            adminDeleteUserById,
            adminSetUserStatusById,
            adminGetAllUsers,
            adminUpdatePassword
         }}>
            {children}
        </AuthContext.Provider>
    );
};
