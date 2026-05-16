import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Label,
    Legend,
} from "recharts";
import styles from "./Diagram.module.scss";
import { LineDiagramProps } from "../types/DiagramTypes";

const CHART_COLORS = [
    "var(--color-primary-hover)",
    "var(--color-warning)",
    "var(--color-success)",
    "var(--color-error)"
];


export const LineDiagram = <T,>({ 
    dataList, 
    title, 
    infoText=undefined, 
    xAxis, 
    yAxis, 
    widthPercent=100, 
    heightPx=320, 
    minHeightPx=280 
    }: LineDiagramProps<T>) => {
    const yAxisUnit = yAxis.unit ? ` ${yAxis.unit}` : '';
    const lineChartStyleProps = yAxis.dataKey.length > 1 ? { top: 5, right: 20, left: 20, bottom: 80 } : { top: 20, right: 20, left: 20, bottom: 40 };    

    return (
            <div className={styles.trackedEnergyCard}>
                {dataList.length === 0 ? 
                (<div className={styles.noData}>{'Keine Daten vorhanden.'}</div>) : (
                    <>
                        <h3 className={styles.chartTitle}>{title}</h3>
                        <ResponsiveContainer 
                            width={`${widthPercent}%`} 
                            height={heightPx} 
                            minHeight={minHeightPx}
                        >
                            <LineChart 
                                data={dataList} 
                                margin={lineChartStyleProps}
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
                                    contentStyle={{ 
                                        backgroundColor: 'var(--color-surface)', 
                                        borderColor: 'var(--color-border)',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                    itemStyle={{ color: 'var(--color-primary-hover)' }}
                                    labelStyle={{ color: 'var(--color-text-main)', fontWeight: 'bold', marginBottom: '4px' }}
                                    formatter={(value: number | undefined, name) => {
                                        // Fallback, falls ein Datenpunkt undefined sein sollte
                                        if (value === undefined) return ['NaN', name];
                                        
                                        // Reguläre Formatierung des Zahlenwertes
                                        return [`${value.toLocaleString('de-DE')} ${yAxisUnit}`, name];
                                    }}
                                />
                               
                            {/* Legende: Wird nur gerendert, wenn mehr als eine Linie vorhanden ist */}
                            {yAxis.dataKey.length > 1 && (
                                <Legend 
                                    verticalAlign="top" 
                                    height={30} 
                                    iconType="circle"
                                        wrapperStyle={{ 
                                        position: 'relative', // Holt die Legende in den normalen Flow zurück, statt absolut über dem Chart zu kleben
                                        width: '100%',         // Zwingt die Legende, den verfügbaren Platz der Card zu nutzen
                                        display: 'flex',       // Aktiviert Flexbox für die Legenden-Items
                                        justifyContent: 'center', // Zentriert die Einträge
                                        flexWrap: 'wrap',}}  
                                />
                            )}
                            
                            {yAxis.dataKey.map((key, index) => {
                                const lineColor = yAxis.dataStyleProps?.[index]?.color ?? CHART_COLORS[index % CHART_COLORS.length];
                                
                                return (
                                    <Line 
                                        key={key}          
                                        type="monotone"
                                        dataKey={key}
                                        name={yAxis.dataStyleProps?.[index]?.legendName ?? key} 
                                        stroke={lineColor} 
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: 'var(--color-surface)', stroke: lineColor, strokeWidth: 2 }}
                                        activeDot={{ r: 7, fill: lineColor, stroke: 'var(--color-surface)' }} 
                                        animationDuration={800} 
                                        animationEasing="ease-out"
                                    />
                                );
                            })}
                            </LineChart>
                        </ResponsiveContainer>
                        { infoText && <p className={styles.infoText}> {infoText} </p> }
                    </>
                )}
            </div>
)};
