import { ChangeEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useConfig } from "../hooks/useConfig";
import { useTheme } from "../hooks/useTheme";
import { ConfigModel } from "../types/ConfigTypes";
import { Logger } from "../utils/logger";
import styles from "./Settings.module.scss";
import { CustomButton } from "../components/CustomButton";

interface ConfigFieldDef {
    name: keyof ConfigModel;
    label: string;
    type: 'number' | 'text' | 'date';
    infoText: string;
    step?: string;
}

// Array zur dynamischen Generierung der Felder
const configFields: ConfigFieldDef[] = [
    { 
        name: 'basePrice', 
        label: 'Grundpreis (EUR/Monat)', 
        type: 'number', 
        step: '0.01', 
        infoText: 'Fixer monatlicher Basisbetrag des Stromanbieters, unabhängig von deinem tatsächlichen Verbrauch (inkl. MwSt.).' 
    },
    { 
        name: 'energyPrice', 
        label: 'Verbrauchspreis (EUR/kWh)', 
        type: 'number', 
        step: '0.0001', 
        infoText: 'Kosten pro verbrauchter Kilowattstunde Strom (inkl. MwSt.).' 
    },
    { 
        name: 'energyTax', 
        label: 'Stromsteuer (EUR/kWh)', 
        type: 'number', 
        step: '0.0001', 
        infoText: 'Gesetzliche Steuer pro kWh. Schaue dafür ggf. auf deine letzte Stromrechnung.' 
    },
    { 
        name: 'vatRate', 
        label: 'Umsatzsteuer', 
        type: 'number', 
        step: '0.01', 
        infoText: 'Aktueller Mehrwertsteuersatz als Dezimalwert. Gib z.B. "0.19" für den regulären Satz von 19% ein.' 
    },
    { 
        name: 'monthlyAdvance', 
        label: 'Monatl. Abschlag (EUR)', 
        type: 'number', 
        step: '0.01', 
        infoText: 'Die Vorauszahlung, die dein Anbieter jeden Monat abbucht. Dient zur Berechnung deiner späteren Nachzahlung oder Gutschrift.' 
    },
    { 
        name: 'additionalCredit', 
        label: 'Zusätzliches Guthaben (EUR)', 
        type: 'number', 
        step: '0.01', 
        infoText: 'Boni (z.B. Neukundenbonus) oder offenes Guthaben aus Vorjahren, die am Vertragsende verrechnet werden sollen.' 
    },
    { 
        name: 'dueDay', 
        label: 'Fälligkeitstag (optional)', 
        type: 'number', 
        step: '1', 
        infoText: 'Der Tag im Monat (1-31), an dem der Abschlag fällig wird. Relevant für präzisesere Vorausberechnung.' 
    },
    { 
        name: 'sepaProcessingDays', 
        label: 'SEPA-Verarbeitungstage (optional)', 
        type: 'number', 
        step: '1', 
        infoText: 'Verzögerung (in Tagen), bis die Abbuchung tatsächlich auf dem Bankkonto sichtbar ist. Relevant für präzisesere Vorausberechnung.' 
    },
    { 
        name: 'meterIdentifier', 
        label: 'Zählernummer (optional)', 
        type: 'text', 
        infoText: 'Die Identifikationsnummer des Stromzählers.' 
    },
    { 
        name: 'referenceDate', 
        label: 'Referenzdatum (optional)', 
        type: 'date', 
        infoText: 'Das Startdatum deiner aktuellen Abrechnungsperiode (z.B. Vertragsbeginn). Ab hier beginnt die Berechnung deiner Kosten.' 
    },
];

export default function Settings() {
    const logger = new Logger('Settings');
    const authService = useAuth();
    const themeObject = useTheme();
    const configService = useConfig();
    const [formData, setFormData] = useState<Partial<ConfigModel>>(configService.configs ?? {});
    const iconSrc = (themeObject.theme === 'light') ? '/info_icon_dark.svg' : '/info_icon_light.svg';

    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
        }));
    };

    const handleSave = async() => {
        // TODO [24.04.2026]: Bugfix - Änderung des Referenzdatums führt zur serverseitig zur Exception
        const success = await configService.updateConfiguration(formData as ConfigModel);
        if (success) {
            logger.debug('Konfiguration erfolgreich gespeichert: ', configService.configs);
        } else {
            // TODO [24.04.2026]: Fehlerhandling verbessern, z.B. durch Anzeige einer Fehlermeldung
            logger.error(configService.errorMsgRef.current?.message ?? 'Unbekannter Fehler bei der Aktualisierung der Konfiguration.');
        }
    };

    return (
        <div className={styles.settingsContainer}>
            <div className={styles.infoBox}>
                <img src={iconSrc} 
                    alt="Info-Icon" 
                    width={28} 
                    height={28} />
                <h4>{'Hier können die spezifischen Konfigurationsparameter für die Kostenberechnung angepasst werden.'}</h4>
            </div>
            <div className={styles.formContainer}>
                {configFields.map((field) => (
                    <div key={field.name} className={styles.settingRow}>
                        
                        <label htmlFor={field.name} className={styles.settingLabel}>
                            {field.label}
                        </label>
                        
                        <div className={styles.inputWrapper}>
                            <input
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                step={field.step}
                                value={formData[field.name] ?? ''} 
                                onChange={handleInputChange}
                                className={styles.settingInput}
                            />
                            
                            <div className={styles.tooltipContainer}>
                                <img src={iconSrc} alt="Info" width={20} height={20} className={styles.infoIcon} />
                                <span className={styles.tooltipText}>{field.infoText}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <CustomButton
                title="Speichern" 
                type="button"
                onClickCallback={handleSave} 
                isDisabled={authService.isLoading || configService.isLoading}
                sx={{marginTop: '0px', width: '250px'}} 
            />     
        </div>
    );
}