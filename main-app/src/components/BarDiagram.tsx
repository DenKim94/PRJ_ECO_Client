import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Label
} from "recharts";
import styles from "./Diagram.module.scss";
import { BarDiagramProps } from "../types/DiagramTypes";


export const BarDiagram = <T,>({ 
    dataList, 
    title,
    infoText=undefined, 
    xAxis, 
    yAxis, 
    widthPercent=100, 
    heightPx=320, 
    minHeightPx=280 
    }: BarDiagramProps<T>) => {
    const yAxisUnit = yAxis.unit ? ` ${yAxis.unit}` : '';

    return (
            <div className={styles.trackedEnergyCard}>
                {dataList.length === 0 ? 
                (<div className={styles.noData}>{'Keine Daten zur Visualisierung vorhanden.'}</div>) : (
                    <>
                        <h3 className={styles.chartTitle}>{title}</h3>
                        <ResponsiveContainer 
                            width={`${widthPercent}%`} 
                            height={heightPx} 
                            minHeight={minHeightPx}
                        >
                            <BarChart 
                                data={dataList} 
                                margin={{ top: 30, right: 20, left: 20, bottom: 40 }}
                            >
                                {/* Rasterlinien für bessere Lesbarkeit */}
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                                <XAxis 
                                    dataKey={xAxis.dataKey} 
                                    stroke="var(--color-text-muted)"
                                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                                    tickMargin={15}
                                >
                                    {xAxis.label &&
                                        <Label 
                                            value={xAxis.label} 
                                            offset={-25} 
                                            position="insideBottom" 
                                            style={{ fill: 'var(--color-text-muted)', fontSize: 14, fontWeight: 'bold'}} 
                                        />}
                                </XAxis>
                                
                                {/* Y-Achse: Zählerstand */}
                                <YAxis 
                                    dataKey={yAxis.dataKey} 
                                    domain={['auto', 'auto']}
                                    stroke="var(--color-text-muted)"
                                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                                    tickFormatter={(value) => `${value}`}
                                    width={80} // Ausreichend Breite für 5-stellige Zahlen
                                >
                                    {yAxis.label &&
                                        <Label 
                                            value={yAxis.label}
                                            angle={-90} // Text vertikal stellen
                                            position="insideLeft" 
                                            style={{ textAnchor: 'middle', fill: 'var(--color-text-muted)', fontSize: 14, fontWeight: 'bold' }} 
                                        />}
                                </YAxis>
                                
                                {/* Tooltip für Hover-Effekt */}
                                <Tooltip 
                                    cursor={{ fill: 'var(--color-border)', opacity: 0.4 }} 
                                    contentStyle={{ 
                                        backgroundColor: 'var(--color-surface)', 
                                        borderColor: 'var(--color-border)',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                    itemStyle={{ color: 'var(--color-primary-hover)' }}
                                    labelStyle={{ color: 'var(--color-text-main)', fontWeight: 'bold', marginBottom: '4px' }}
                                    formatter={(value: number | undefined) => {
                                        // Fallback, falls ein Datenpunkt undefined sein sollte
                                        if (value === undefined) return ['NaN', 'Datenpunkt'];
                                        
                                        // Reguläre Formatierung des Zahlenwertes
                                        return [`${value.toLocaleString('de-DE')} ${yAxisUnit}`, 'Datenpunkt'];
                                    }}
                                />  
                                <Bar 
                                    dataKey={yAxis.dataKey}
                                    fill="var(--color-primary-hover)" 
                                    // Rundet die oberen beiden Ecken der Balken ab [Top-Left, Top-Right, Bottom-Right, Bottom-Left]
                                    radius={[4, 4, 0, 0]} 
                                    animationDuration={800} 
                                    animationEasing="ease-out"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                        { infoText && <p className={styles.infoText}> {infoText} </p> }
                    </>
                )}
            </div>
)};