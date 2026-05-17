import styles from "./InfoCard.module.scss";

export interface InfoProps <T> {
    label: string;
    value: T;
    message?: string;
    cardSx?: React.CSSProperties;
    valueSx?: React.CSSProperties; 
    iconProps?: {
        src: string; 
        size?: number;
        alt?: string;
    };
}

export interface InfoCardProps <T> {
    infoProps: InfoProps<T>[];
    sx?: React.CSSProperties;
}


export const InfoCard = <T,>({ infoProps, sx } : InfoCardProps <T>) => {
    if (infoProps.length === 0) {
        return null;
    }

    return(
        <div className={styles.cardContainer} style={sx}>
            {infoProps.map((infoProp) => (
                infoProp.value ? (
                <div key={infoProp.label} className={styles.infoContent} style={infoProp.cardSx}>
                    <p className={styles.label}>{infoProp.label + " : "}</p>
                    <div className={styles.valueContainer}>
                        <p style={infoProp.valueSx}>{infoProp.value as React.ReactNode}</p>
                        {infoProp.message && <p className={styles.message}>{infoProp.message}</p>}
                        {infoProp.iconProps?.src && 
                            <img src={infoProp.iconProps.src} 
                                alt={infoProp.iconProps.alt ?? "Info-Card-Icon"} 
                                width={infoProp.iconProps.size ?? 20} 
                                height={infoProp.iconProps.size ?? 20}
                            />
                        }
                    </div>
                </div>) : null
            ))}
        </div>
    )
};