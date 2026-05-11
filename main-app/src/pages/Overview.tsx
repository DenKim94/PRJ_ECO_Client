import { useEffect } from "react";
import styles from "./Overview.module.scss";
import { useAuth } from "../hooks/useAuth";
import { useTracking } from "../hooks/useTracking";
import { useConfig } from "../hooks/useConfig";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Label
} from "recharts";
import { InfoBox } from "../components/InfoBox";

export default function Overview() {
    const authService = useAuth();
    const configService = useConfig();
    const trackingService = useTracking();
    
    useEffect(() => {
        trackingService.resetResponseMsg();
        configService.resetSaveResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    return (
        <div className={styles.pageContainer}>
            <InfoBox message={'Datenübersicht zum Energieverbrauch und den zugehörigen Kosten'}/>
            <div className={styles.trackedEnergyCard}>
                <h3 className={styles.chartTitle}>{'Erfasste Zählerstände'}</h3>
                {/* ResponsiveContainer sorgt für die automatische Anpassung an alle Displaygrößen */}
                <ResponsiveContainer 
                    width="100%" 
                    height={320} 
                    minHeight={280}
                >
                    <LineChart 
                        data={trackingService.entryList} 
                        margin={{ top: 30, right: 20, left: 20, bottom: 40 }}
                    >
                        {/* Rasterlinien für bessere Lesbarkeit */}
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                        
                        {/* X-Achse: Datum */}
                        <XAxis 
                            dataKey="timestamp" 
                            stroke="var(--color-text-muted)"
                            tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                            tickMargin={15}
                        >
                            {/* Label für die X-Achse */}
                            <Label 
                                value="Datum" 
                                offset={-25} 
                                position="insideBottom" 
                                style={{ fill: 'var(--color-text-muted)', fontSize: 14, fontWeight: 'bold'}} 
                            />
                        </XAxis>
                        
                        {/* Y-Achse: Zählerstand */}
                        <YAxis 
                            dataKey="readingValue"
                            domain={['dataMin - 50', 'dataMax + 50']} 
                            stroke="var(--color-text-muted)"
                            tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                            tickFormatter={(value) => `${value}`}
                            width={80} // Ausreichend Breite für 5-stellige Zahlen
                        >
                            {/* Label für die Y-Achse (vertikal gedreht) */}
                            <Label 
                                value="Zählerstand in kWh" 
                                angle={-90} // Text vertikal stellen
                                position="insideLeft" 
                                style={{ textAnchor: 'middle', fill: 'var(--color-text-muted)', fontSize: 14, fontWeight: 'bold' }} 
                            />
                        </YAxis>
                        
                        {/* Tooltip für Hover-Effekt */}
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'var(--color-surface)', 
                                borderColor: 'var(--color-border)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                            itemStyle={{ color: 'var(--color-primary)' }}
                            labelStyle={{ color: 'var(--color-text-main)', fontWeight: 'bold', marginBottom: '4px' }}
                            formatter={(value: number | undefined) => {
                                // Fallback, falls ein Datenpunkt undefined sein sollte
                                if (value === undefined) return ['Keine Daten', 'Zählerstand'];
                                
                                // Reguläre Formatierung des Zahlenwertes
                                return [`${value.toLocaleString('de-DE')} kWh`, 'Zählerstand'];
                            }}
                        />
                        
                        <Line 
                            type="monotone"
                            dataKey="readingValue" 
                            stroke="var(--color-primary)" 
                            strokeWidth={3}
                            dot={{ r: 4, fill: 'var(--color-surface)', stroke: 'var(--color-primary)', strokeWidth: 2 }}
                            activeDot={{ r: 7, fill: 'var(--color-primary-hover)', stroke: 'var(--color-surface)' }} 
                            animationDuration={800} 
                            animationEasing="ease-out"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}