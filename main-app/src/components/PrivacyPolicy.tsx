import styles from "./PrivacyPolicy.module.scss";

export default function PrivacyPolicy() {
    return (
        <div className={styles.privacyContainer}>
            <h2>Datenschutzerklärung</h2>
            <p><strong>Stand:</strong> 30.05.2026</p>

            <p>
                Ich lege großen Wert auf den Schutz Ihrer persönlichen Daten. In dieser Datenschutzerklärung informiere ich Sie darüber, 
                welche personenbezogenen Daten im Rahmen der Nutzung der Webanwendung <strong>ECO (Energy Costs Observer)</strong> erhoben werden, 
                wie diese verarbeitet werden und welche Rechte Sie in Bezug auf Ihre Daten haben.
            </p>

            <h3>1. Verantwortlicher für die Datenverarbeitung</h3>
            <p>Verantwortlich für die Verarbeitung Ihrer personenbezogenen Daten im Rahmen dieser Webanwendung bin ich:</p>
            <address className={styles.addressBlock}>
                <strong>Denis Kim</strong><br />
                c/o Online-Impressum.de<br />
                Europaring 90<br />
                53757 Sankt Augustin<br />
                E-Mail: <a href="mailto:denis-kim.dev@mail.online-impressum.de">denis-kim.dev@mail.online-impressum.de</a>
            </address>

            <h3>2. Erhebung und Verarbeitung bei der Registrierung</h3>
            <p>
                Um die Funktionen der Anwendung nutzen zu können, ist die Erstellung eines Nutzerkontos erforderlich. 
                Hierbei erhebe und verarbeite ich Ihre E-Mail-Adresse sowie ein von Ihnen gewähltes Passwort.
            </p>
            <p>
                <strong>Zweck und Validierung:</strong> Die Erhebung der E-Mail-Adresse dient der eindeutigen Identifizierung Ihres Accounts, 
                der Möglichkeit zum Passwort-Reset sowie der allgemeinen Sicherheit Ihres Kontos. Zur Sicherstellung, dass die angegebene E-Mail-Adresse 
                tatsächlich Ihnen gehört, verwende ich ein sogenanntes Double-Opt-In-Verfahren. Nach der Registrierung erhalten Sie eine E-Mail mit 
                einem Validierungscode. Erst nach Eingabe des Codes wird Ihr Konto vollständig freigeschaltet.
            </p>
            <p>
                <strong>Rechtsgrundlage:</strong> Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO 
                (Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen), da diese Daten zwingend für die Bereitstellung des Accounts 
                und der Kernfunktionen der Anwendung erforderlich sind.
            </p>

            <h3>3. Deaktivierung und Blockierung von Nutzern</h3>
            <p>
                Ich behalte mir das Recht vor, Nutzerkonten und zugehörige E-Mail-Adressen durch den Administrator blockieren oder 
                deaktivieren zu lassen, um die Anwendung vor Missbrauch, Spam oder anderweitigen schädlichen Aktivitäten zu schützen. 
                Zu diesem Zweck wird der Status des Accounts ("Aktiv" oder "Blockiert") sowie die zugehörige E-Mail-Adresse systemintern gespeichert.
            </p>
            <p>
                Die Verarbeitung dieser Daten erfolgt auf Grundlage meines berechtigten Interesses gemäß Art. 6 Abs. 1 lit. f DSGVO, 
                um die Sicherheit, Integrität und den störungsfreien Betrieb der Webanwendung zu gewährleisten. Die Daten blockierter Nutzer 
                werden nicht an Dritte weitergegeben. Sie haben das Recht, dieser Verarbeitung zu widersprechen, sofern berechtigte Gründe vorliegen. 
                Bitte wenden Sie sich hierzu an die oben genannte Kontaktadresse.
            </p>

            <h3>4. Hosting der Anwendung</h3>
            <h4>4.1 Frontend-Hosting (Cloudflare)</h4>
            <p>
                Die Benutzeroberfläche meiner Webanwendung (Frontend) wird auf <strong>Cloudflare Pages</strong> gehostet, einem Service von 
                <strong> Cloudflare, Inc.</strong>, der eine Content-Delivery-Network (CDN)-Lösung zur Verfügung stellt und für die Bereitstellung 
                der Webseiteninhalte verantwortlich ist.
            </p>
            <p>
                Cloudflare verarbeitet unter Umständen personenbezogene Daten, die bei der Nutzung der Webseite anfallen, insbesondere IP-Adressen. 
                Diese Daten werden durch Cloudflare verwendet, um die Sicherheit und Leistung der Webseite zu verbessern, sowie zur Bekämpfung 
                von DDoS-Angriffen (Distributed Denial of Service). Cloudflare kann Daten in Länder außerhalb der Europäischen Union (EU) übermitteln. 
                Um ein angemessenes Datenschutzniveau zu gewährleisten, wurden geeignete Garantien im Sinne des Art. 46 DSGVO getroffen 
                (z. B. EU-Standardvertragsklauseln). Für detaillierte Informationen verweise ich auf die Datenschutzerklärung von Cloudflare.
            </p>

            <h4>4.2 Backend- und Datenbank-Hosting (Eigener Server)</h4>
            <p>
                Die eigentliche Verarbeitung Ihrer Account- und Anwendungsdaten (Backend) sowie die Speicherung in der Datenbank erfolgt auf 
                einem von mir betriebenen, <strong>privaten Server, dessen Standort sich in Deutschland befindet</strong>. 
            </p>
            <p>
                Dies stellt sicher, dass Ihre sensiblen Eingabedaten (z.B. Verbrauchsdaten, Nutzerinformationen) die Europäische Union nicht 
                verlassen und den strengen Richtlinien der DSGVO unterliegen. Es werden weitreichende technische und organisatorische Maßnahmen 
                getroffen, um diesen Server vor unbefugtem Zugriff zu schützen.
            </p>

            <h3>5. Weitergabe von Daten & Speicherdauer</h3>
            <p>
                Ihre Daten werden nicht an Dritte weitergegeben, es sei denn, dies ist gesetzlich vorgeschrieben. Ihre Daten werden 
                nur so lange gespeichert, wie es für den Betrieb Ihres Nutzerkontos erforderlich ist. Löschen Sie Ihr Konto, werden Ihre Daten 
                gelöscht, sofern keine gesetzlichen Aufbewahrungsfristen entgegenstehen (dies betrifft ausgenommen ggf. in einer Blocklist 
                gespeicherte Hashes/Adressen zur reinen Abwehr von wiederholtem Missbrauch).
            </p>

            <h3>6. Ihre Rechte</h3>
            <p>
                Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und 
                Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Des Weiteren steht 
                Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde (z.B. dem Landesbeauftragten für Datenschutz) zu.
            </p>
            
            <p>
                <em>Diese Datenschutzerklärung kann bei Bedarf aktualisiert werden, um gesetzlichen Anforderungen zu entsprechen. 
                Die jeweils aktuelle Version finden Sie stets auf dieser Webseite.</em>
            </p>
        </div>
    );
}
