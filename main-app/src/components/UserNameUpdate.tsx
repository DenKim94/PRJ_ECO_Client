import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { CustomButton } from "./CustomButton";
import styles from "./UserNameUpdate.module.scss";
import { Logger } from "../utils/logger";
import { UserNameUpdateRequest } from "../types/AuthTypes";
import { useNavigate } from "react-router-dom";


export default function UserNameUpdate() {
        const auth = useAuth();
        const [code, setCode] = useState("");
        const navigate = useNavigate();
        const [submitting, setSubmitting] = useState(false);
        const [newUserName, setNewUserName] = useState("");
        const logger = new Logger('UserNameUpdate');

        const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
            e.preventDefault();  
            setSubmitting(true);

            try {
                const request: UserNameUpdateRequest = { tfaCode: code, newUserName: newUserName };
                const response = await auth.updateUserNameWithLogout(request);
    
                if (!response) {
                    logger.error(`${auth.errorMsgRef.current?.message}`);
                    return;
                }

            } catch (err) {
                logger.error(`Ein Fehler ist aufgetreten: ${err instanceof Error ? err.message : "Unbekannter Fehler ist aufgetreten."}`);
                return;
    
            } finally {
                setSubmitting(false);
                setCode("");
                setNewUserName("");

                setTimeout(() => {
                    void navigate("/login", { replace: true });
                }, 2000);
            }
        };
    
    return (                
        <div className={styles.pageContainer}>
            <span className={styles.infoText}>
                {'Bitte gib deinen Verfifizierungscode und den neuen Benutzernamen ein. Du wirst anschließend automatisch ausgeloggt.'}
            </span>

            <form onSubmit={(e) => void onSubmit(e)} className={styles.formContainer}>
                <input
                    id="code-reset"
                    name="code-reset"
                    type='text'
                    className={styles.inputField}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoComplete="code-reset"
                    placeholder="Verifizierungscode"
                    required={true}
                    disabled={submitting}
                />
                <input
                    id="new-username"
                    name="new-username"
                    type="text"
                    className={styles.inputField}
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Neuer Benutzername"
                    required={true}
                    minLength={2}
                    disabled={submitting}
                />

                <CustomButton 
                    title={submitting ? "Senden..." : "Bestätigen"} 
                    type="submit" 
                    isDisabled={submitting}
                    sx={{width: '280px'}} 
                />
            </form>
        </div>
    );}
