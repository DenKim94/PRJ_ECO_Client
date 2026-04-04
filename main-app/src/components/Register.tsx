import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { HelperClass } from "../utils/helper";
import { AppLogo } from "./AppLogo";
import styles from "./Register.module.scss";
import { Logger } from "../utils/logger";
import { RegisterRequest } from "../types/AuthTypes";
import { CustomButton } from "./CustomButton";
import { MessageContainer, MessageContainerProps } from "./MessageContainer";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

export default function Register() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [eMail, setEMail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ message: string, type?: MessageContainerProps['type'] }  | null>(null);
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const themeObject = useTheme();
    const logger = new Logger('Register');
    
    const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedName = name.trim();

        if (!HelperClass.isValidEmail(eMail)) {
            setMessage({ message: "Bitte eine gültige E-Mail-Adresse eingeben.", type: "error" });
            return;
        }

        setSubmitting(true);
        try {
            const request: RegisterRequest = { username: trimmedName, password, email: eMail };
            const result = await auth.register(request);

            if (!result) {
                setMessage({ message: 'Registrierung fehlgeschlagen. Bitte prüfe deine Eingaben.', type: "error" });
                logger.error(`Registrierung fehlgeschlagen für User: ${trimmedName}`);
                return;
            }

            if (auth.errorMsgRef.current?.message) {
                setMessage({ message: `Registrierung fehlgeschlagen: ${auth.errorMsgRef.current.message}`, type: "error" });
                logger.error(`Registrierung fehlgeschlagen: ${auth.errorMsgRef.current.message} für User: ${trimmedName}`);
                return;
            }

            // Formular leeren und zur Login-Seite navigieren
            setName("");
            setPassword("");
            setEMail("");
            setAcceptedPrivacy(false);
            void navigate("/login", { replace: true });

        } catch (err) {
            setMessage({ message: "Ein Fehler ist aufgetreten.", type: "error" });
            logger.error(`Ein Fehler ist aufgetreten: ${err instanceof Error ? err.message : "Unbekannter Fehler"} für User: ${trimmedName}`);
            return;

        } finally {
            setSubmitting(false);
        }
    };

   return (
        <div className={styles.pageContainer}>
            <AppLogo src="/eco_app_v2.png" alt="ECO App Logo" size="xl"/>
            
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
                                    /> 
                                : <img
                                        src={themeObject.theme === 'light' ? '/visibility_off_dark.png' : '/visibility_off_light.png'}
                                        alt={'Button für Passwort verbergen'}
                                        width={24}
                                        height={24}
                                    /> }
                        </button>
                </div>
                <input
                    id="email-register"
                    name="email-register"
                    type='text'
                    className={styles.inputEmail}
                    value={eMail}
                    onChange={(e) => setEMail(e.target.value)}
                    autoComplete="email"
                    placeholder="E-Mail"
                    required={true}
                    disabled={submitting}
                />
                <div className={styles.privacyContainer}>
                    <input
                        id="privacy"
                        name="privacy"
                        type="checkbox"
                        checked={acceptedPrivacy}
                        onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                        required
                        disabled={submitting}
                    />
                    <span>
                        Ich stimme den&nbsp;
                        <a href="/datenschutz" target="_blank" rel="noreferrer">
                            Datenschutzbestimmungen
                        </a>
                        &nbsp;zu.
                    </span>
                </div>
                <CustomButton 
                    title={submitting ? "Registrieren..." : "Registrieren"} 
                    type="submit" 
                    isDisabled={submitting} 
                />
            </form>
            <MessageContainer message={message?.message ?? ""} type={message?.type} isVisible={message !== null} />
        </div>
    );
}
