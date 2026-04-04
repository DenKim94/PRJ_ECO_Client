import { useState } from "react";
import { Logger } from "../utils/logger";
import { AppLogo } from "./AppLogo";
import styles from "./EmailValidation.module.scss";
import { MessageContainer, MessageContainerProps } from "./MessageContainer";
import { useAuth } from "../hooks/useAuth";
import { CustomButton } from "./CustomButton";

export const EmailValidation = ({show}: {show: boolean}) => {
    const auth = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [code, setCode] = useState("");
    const [message, setMessage] = useState<{ message: string, type?: MessageContainerProps['type'] }  | null>(null);
    const logger = new Logger('EmailValidation');

    if (!show) return null;

    const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const result = await auth.verifyEmail(code);

            if (auth.errorMsgRef.current?.message) {
                setMessage({ message: `Anfrage ist fehlgeschlagen: ${auth.errorMsgRef.current.message}`, type: "error" });
                logger.error(`${auth.errorMsgRef.current.message}`);
                return;
            }
            setMessage({ message: result.message, type: "success" });
            logger.debug(`${result.message}`);

        } catch (err) {
            setMessage({ message: err instanceof Error ? err.message : "Unbekannter Fehler ist aufgetreten.", type: "error" });
            logger.error(`Ein Fehler ist aufgetreten: ${err instanceof Error ? err.message : "Unbekannter Fehler ist aufgetreten."}`);
            return;

        } finally {
            setSubmitting(false);
            setCode("");
        }
    };
        
    async function resendCode() {
        setSubmitting(true);
        try {
            const result = await auth.resendVerificationEmail();

            if (auth.errorMsgRef.current?.message) {
                setMessage({ message: `Anfrage ist fehlgeschlagen: ${auth.errorMsgRef.current.message}`, type: "error" });
                logger.error(`${auth.errorMsgRef.current.message}`);
                return;
            }
            setMessage({ message: result.message, type: "success" });
            logger.debug(`${result.message}`);

        } catch (err) {
            setMessage({ message: err instanceof Error ? err.message : "Unbekannter Fehler ist aufgetreten.", type: "error" });
            logger.error(`Ein Fehler ist aufgetreten: ${err instanceof Error ? err.message : "Unbekannter Fehler ist aufgetreten."}`);
            return;

        } finally {
            setSubmitting(false);
        }
    };
    
    return (
        <div className={styles.pageContainer}>
            <h2 className={styles.title}>{'Verifizierung erforderlich.'}</h2>
            <span className={styles.infoText}>
                {`Du solltest eine E-Mail mit deinem persönlichen Verifizierungscode erhalten haben. 
                  Bitte gib diesen Code hier ein, um deine E-Mail-Adresse zu bestätigen.`}
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
                <CustomButton 
                    title={submitting ? "Anfrage senden..." : "Bestätigen"} 
                    type="submit" 
                    isDisabled={submitting} 
                />
                <CustomButton 
                    title="Code erneut senden" 
                    type="button"
                    onClickCallback={resendCode} 
                    isDisabled={submitting} 
                />
            </form>
            <MessageContainer message={message?.message ?? ""} type={message?.type} isVisible={message !== null} />
        </div>
    );
};