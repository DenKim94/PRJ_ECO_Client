import { ChangeEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useConfig } from "../hooks/useConfig";
import { useTheme } from "../hooks/useTheme";
import { ConfigModel } from "../types/ConfigTypes";
import { Logger } from "../utils/logger";
import styles from "./Settings.module.scss";

interface ConfigFieldDef {
    name: keyof ConfigModel;
    label: string;
    type: 'number' | 'text' | 'date';
    infoText: string;
    step?: string;
}

// Array zur dynamischen Generierung der Felder
const configFields: ConfigFieldDef[] = [
    { name: 'basePrice', label: 'Grundpreis (EUR/Monat)', type: 'number', step: '0.01', infoText: 'Grundpreis in EUR/Monat (brutto)' },
    { name: 'energyPrice', label: 'Verbrauchspreis (EUR/kWh)', type: 'number', step: '0.0001', infoText: 'Verbrauchspreis in EUR/kWh (brutto)' },
    { name: 'energyTax', label: 'Stromsteuer (EUR/kWh)', type: 'number', step: '0.0001', infoText: 'Stromsteuer in EUR/kWh' },
    { name: 'vatRate', label: 'Umsatzsteuer', type: 'number', step: '0.01', infoText: 'Umsatzsteuer (Relativ z.B. 0.19 für 19%)' },
    { name: 'monthlyAdvance', label: 'Monatl. Abschlag (EUR)', type: 'number', step: '0.01', infoText: 'Monatliche Abschlagszahlung in EUR (brutto)' },
    { name: 'additionalCredit', label: 'Zusätzliches Guthaben (EUR)', type: 'number', step: '0.01', infoText: 'Zusätzlicher Guthabenbetrag in EUR (brutto)' },
    { name: 'dueDay', label: 'Fälligkeitstag', type: 'number', step: '1', infoText: 'Fälligkeitstag der monatlichen Abschlagszahlung (z.B. 5: Zum 5. des Monats)' },
    { name: 'sepaProcessingDays', label: 'SEPA-Verarbeitungstage (optional)', type: 'number', step: '1', infoText: 'Anzahl Tage, die für die SEPA-Lastschriftverarbeitung benötigt werden' },
    { name: 'meterIdentifier', label: 'Zählernummer', type: 'text', infoText: 'Eindeutige Identifikationsnummer des Stromzählers' },
    { name: 'referenceDate', label: 'Referenzdatum (optional)', type: 'date', infoText: 'Referenzdatum für die Berechnung (z.B. Vertragsbeginn)' },
];

export default function Settings() {
    const logger = new Logger('Settings');
    const authService = useAuth();
    const themeObject = useTheme();
    const configService = useConfig();
    const [formData, setFormData] = useState<Partial<ConfigModel>>(configService.configs ?? {});
    const iconSrc = (themeObject.theme === 'light') ? '/info_icon_dark.svg' : '/info_icon_light.svg';

    logger.debug('configService.configs: ', configService.configs);

    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            // Zahlenwerte direkt parsen, leere Strings beibehalten (erlaubt das Löschen des Feldes)
            [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
        }));
    };

    const handleSave = () => {
        logger.debug('Speichere Konfiguration...', formData);
        // TODO: configService.saveConfig(formData as ConfigModel);
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
            {/* TODO [22.04.2026]: Responsives Styling anpassen */}
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
            {/* TODO [22.04.2026]: Button hinzufügen, um Konfigurationen zu speichern */}            
        </div>
    );
}