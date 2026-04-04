import { useState } from "react";
import styles from "./PasswordReset.module.scss";
import { useAuth } from "../hooks/useAuth";
import { Logger } from "../utils/logger";
import { HelperClass } from "../utils/helper";
import { AppLogo } from "./AppLogo";
import { MessageContainer, MessageContainerProps } from "./MessageContainer";
import { CustomButton } from "./CustomButton";
import PasswordResetInput from "./PasswordResetInput";

export default function PasswordReset() {
    const auth = useAuth();
    const [eMail, setEMail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ message: string, type?: MessageContainerProps['type'] }  | null>(null);
    const [eMailSent, setEmailSent] = useState(false);
    const logger = new Logger('PasswordReset');
    
    const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);

        if (!HelperClass.isValidEmail(eMail)) {
            setMessage({ message: "Bitte eine gültige E-Mail-Adresse eingeben.", type: "error" });
            return;
        }

        setSubmitting(true);
        try {
            const request: { email: string } = { email: eMail };
            const result = await auth.sendPasswordVerificationEmail(request);

            if (auth.errorMsgRef.current?.message) {
                setMessage({ message: `Anfrage ist fehlgeschlagen: ${auth.errorMsgRef.current.message}`, type: "error" });
                logger.error(`${auth.errorMsgRef.current.message}`);
                return;
            }
            setMessage({ message: `${result.message}`, type: "success" });
            setEmailSent(true);

        } catch (err) {
            setEMail("");
            setMessage({ message: err instanceof Error ? err.message : "Unbekannter Fehler ist aufgetreten.", type: "error" });
            logger.error(`Ein Fehler ist aufgetreten: ${err instanceof Error ? err.message : "Unbekannter Fehler ist aufgetreten."}`);
            return;

        } finally {
            setSubmitting(false);
        }
    };

   return (
        <div className={styles.pageContainer}>
            <AppLogo src="/eco_app_v2.png" alt="ECO App Logo" size="xl"/>
            {!eMailSent ? (
                <>
                    <span className={styles.infoText}>
                        Bitte gib deine hinterlegte E-Mail-Adresse ein, um das Passwort zurücksetzen zu können. <br/>
                        Du erhältst anschließend einen Verifizierungscode per E-Mail.
                    </span>

                    <form onSubmit={(e) => void onSubmit(e)} className={styles.formContainer}>
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
                        <CustomButton 
                            title={submitting ? "Code senden..." : "Bestätigen"} 
                            type="submit" 
                            isDisabled={submitting} 
                        />
                    </form>
                    <MessageContainer message={message?.message ?? ""} type={message?.type} isVisible={message !== null} />
                </> 
            ) : <PasswordResetInput eMail={eMail}/>}
        </div>
    );
}