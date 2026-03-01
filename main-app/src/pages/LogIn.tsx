import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { LogInRequest } from "../types/AuthTypes";
import styles from "./LogIn.module.scss";
import { useTheme } from "../hooks/useTheme";

export default function Login() {
    const navigate = useNavigate();
    const auth = useAuth();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const theme = useTheme();

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
                return;
            }

            if (auth.errorMsg){
                setError("Login fehlgeschlagen: " + auth.errorMsg);
                return;
            }

        } catch (err) {
            setError("Ein Fehler ist aufgetreten: " + (err instanceof Error ? err.message : "Unbekannter Fehler"));
            return;

        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (auth.isAuthenticated && !error) {
            void navigate("/dashboard");
        }
    }, [auth.isAuthenticated, error, navigate]);

    return (
        <div className={styles.pageContainer}>

            <form onSubmit={(e) => void onSubmit(e)} className={styles.formContainer}>
                <input
                    id="name"
                    name="name"
                    type="text"
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="username"
                    inputMode="text"
                    placeholder="Name"
                    required={true}
                    minLength={2}
                    disabled={submitting}
                />

                <input
                    id="password"
                    name="password"
                    type="password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="Passwort"
                    required={true}
                    minLength={6}
                    disabled={submitting}
                />

                <button className={styles.primaryBtn} type="submit" disabled={submitting}>
                    {submitting ? "Anmelden..." : "Anmelden"}
                </button>
            </form>

            <div className={styles.links}>
                <Link to="/forgot-password">Passwort vergessen?</Link>
                <Link to="/register">Registrieren</Link>
            </div>

            {error && (
                <div className={styles.error} role="alert">
                    {error}
                </div>
            )}

        </div>
    );
}