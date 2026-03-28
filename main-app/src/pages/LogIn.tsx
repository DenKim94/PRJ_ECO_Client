import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { LogInRequest } from "../types/AuthTypes";
import styles from "./LogIn.module.scss";
import { AppLogo } from "../components/AppLogo";
import { Logger } from "../utils/logger";
import { useTheme } from "../hooks/useTheme";
import { CustomButton } from "../components/CustomButton";
import { MessageContainer } from "../components/MessageContainer";


export default function Login() {
    const navigate = useNavigate();
    const auth = useAuth();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const themeObject = useTheme();
    const logger = new Logger('Login');

    if (auth.isAuthenticated) {
        logger.debug(`User ${auth.user?.name} ist eingeloggt, leite zum Dashboard weiter.`);
        return <Navigate to="/dashboard" replace />;
    }

    const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const trimmedName = name.trim();
        if (!trimmedName || !password) {
            setError("Bitte Name und Passwort ausfüllen.");
            return;
        }

        setSubmitting(true);
        try {
            const request: LogInRequest = { username: trimmedName, password };
            const result = await auth.login(request);

            if (!result) {
                setError("Login fehlgeschlagen. Bitte prüfe deine Eingaben.");
                logger.error(`Login fehlgeschlagen für User: ${trimmedName}`);
                return;
            }

            if (auth.errorMsgRef.current?.message) {
                setError("Login fehlgeschlagen: " + auth.errorMsgRef.current.message);
                logger.error(`Login fehlgeschlagen: ${auth.errorMsgRef.current.message} für User: ${trimmedName}`);
                return;
            }

            setName("");
            setPassword("");

        } catch (err) {
            setError("Ein Fehler ist aufgetreten: " + (err instanceof Error ? err.message : "Unbekannter Fehler"));
            logger.error(`Ein Fehler ist aufgetreten: ${err instanceof Error ? err.message : "Unbekannter Fehler"} für User: ${trimmedName}`);
            return;

        } finally {

            setSubmitting(false);
            if (auth.isAuthenticated) {
                logger.error(`Login erfolgreich für User: ${trimmedName}`);
                void navigate("/dashboard", { replace: true });
            }
        }
    };

    return (
        <div className={styles.pageContainer}>
            <AppLogo src="/eco_app_v2.png" alt="ECO App Logo" size="xl"/>

            <h2 className={styles.title}>Willkommen!</h2>
            
            <form onSubmit={(e) => void onSubmit(e)} className={styles.formContainer}>
                <input
                    id="name"
                    name="name"
                    type="text"
                    className={styles.inputName}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="username"
                    inputMode="text"
                    placeholder="Name"
                    required={true}
                    minLength={2}
                    disabled={submitting}
                />
                <div className={styles.passwordField}>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className={styles.inputPassword}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        placeholder="Passwort"
                        required={true}
                        minLength={6}
                        disabled={submitting}
                    />
                      <button
                            type="button"
                            className={styles.togglePasswordBtn}
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                            aria-pressed={showPassword}
                            disabled={submitting}
                        >
                            {showPassword ? 
                                    <img
                                        src={themeObject.theme === 'light' ? '/visibility_on_dark.png' : '/visibility_on_light.png'}
                                        alt={'Button für Passwort anzeigen'}
                                        width={24}
                                        height={24}
                                        className={styles.toggleIcon}
                                    /> 
                                : <img
                                        src={themeObject.theme === 'light' ? '/visibility_off_dark.png' : '/visibility_off_light.png'}
                                        alt={'Button für Passwort verbergen'}
                                        width={24}
                                        height={24}
                                        className={styles.toggleIcon}
                                    /> }
                        </button>
                </div>
                <CustomButton title={submitting ? "Anmelden..." : "Anmelden"} type="submit" isDisabled={submitting} />
            </form>

            <div className={styles.links}>
                <Link to="/password-reset">Passwort vergessen?</Link>
                <Link to="/register">Registrieren</Link>
            </div>

            <MessageContainer message={error ?? ""} type="error" isVisible={error !== null} />
        </div>
    );
}