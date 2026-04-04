import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { CustomButton } from "./CustomButton";
import styles from "./PasswordResetInput.module.scss";
import { Logger } from "../utils/logger";
import { HelperClass } from "../utils/helper";
import { useTheme } from "../hooks/useTheme";
import { PasswordResetRequest } from "../types/AuthTypes";
import { useNavigate } from "react-router-dom";
import { MessageContainer, MessageContainerProps } from "./MessageContainer";

export default function PasswordResetInput({ eMail }: { eMail: string }) {
        const auth = useAuth();
        const [code, setCode] = useState("");
         const navigate = useNavigate();
        const [submitting, setSubmitting] = useState(false);
        const [password, setPassword] = useState("");
        const [message, setMessage] = useState<{ message: string, type?: MessageContainerProps['type'] }  | null>(null);
        const [approvePassword, setApprovePassword] = useState("");
        const [showPassword, setShowPassword] = useState(false);
        const themeObject = useTheme();
        const logger = new Logger('PasswordResetInput');

        const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
            e.preventDefault();
            setMessage(null);
        
            if (!HelperClass.isEqualPasswords(password, approvePassword)) {
                setMessage({ message: "Die Passwörter stimmen nicht überein.", type: "error" });
                return;
            }

            setSubmitting(true);
            try {
                const request: PasswordResetRequest = { email: eMail, tfaCode: code, newPassword: password };
                const result = await auth.resetPassword(request);
    
                if (auth.errorMsgRef.current?.message) {
                    setMessage({ message: `Anfrage ist fehlgeschlagen: ${auth.errorMsgRef.current.message}`, type: "error" });
                    logger.error(`${auth.errorMsgRef.current.message}`);
                    return;
                }
                setMessage({ message: result.message, type: "success" });
                setTimeout(() => {
                    void navigate("/login", { replace: true });
                }, 2500);
    
            } catch (err) {
                setMessage({ message: err instanceof Error ? err.message : "Unbekannter Fehler ist aufgetreten.", type: "error" });
                logger.error(`Ein Fehler ist aufgetreten: ${err instanceof Error ? err.message : "Unbekannter Fehler ist aufgetreten."}`);
                return;
    
            } finally {
                setSubmitting(false);
            }
        };
    
    return (                
        <>
            <span className={styles.infoText}>
                Bitte gib deinen Verfifizierungscode und ein neues Passwort ein.
            </span>

            <form onSubmit={(e) => void onSubmit(e)} className={styles.formContainer}>
                <input
                    id="code-reset"
                    name="code-reset"
                    type='text'
                    className={styles.inputEmail}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoComplete="code-reset"
                    placeholder="Verifizierungscode"
                    required={true}
                    disabled={submitting}
                />
                <div className={styles.passwordField}>
                    <input
                        id="new-password"
                        name="new-password"
                        type={showPassword ? 'text' : 'password'}
                        className={styles.inputPassword}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        placeholder="Neues Passwort"
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
                <div className={styles.passwordField}>
                    <input
                        id="new-password"
                        name="new-password"
                        type={showPassword ? 'text' : 'password'}
                        className={styles.inputPassword}
                        value={approvePassword}
                        onChange={(e) => setApprovePassword(e.target.value)}
                        autoComplete="new-password"
                        placeholder="Neues Passwort wiederholen"
                        required={true}
                        minLength={6}
                        disabled={submitting}
                    />
                </div>
                <CustomButton 
                    title={submitting ? "Anfrage senden..." : "Bestätigen"} 
                    type="submit" 
                    isDisabled={submitting} 
                />
            </form>
            <MessageContainer message={message?.message ?? ""} type={message?.type} isVisible={message !== null} />
        </>
    );}
