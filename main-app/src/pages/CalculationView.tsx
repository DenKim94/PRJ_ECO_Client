import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTracking } from "../hooks/useTracking";
import { useConfig } from "../hooks/useConfig";
import styles from "./CalculationView.module.scss";
import { CustomButton } from "../components/CustomButton";
import { Logger } from "../utils/logger";
import { InfoBox } from "../components/InfoBox";
import { useCalculation } from "../hooks/useCalculation";
import { TrackingEntityResponse } from "../types/TrackingTypes";
import { MessageContainer } from "../components/MessageContainer";
import { BarDiagram } from "../components/BarDiagram";
import { LineDiagram } from "../components/LineDiagram";
import { ConfirmDialog } from "../components/ConfirmDialog";

export default function CalculationView() {
    const authService = useAuth();
    const configService = useConfig(); 
    const trackingService = useTracking();
    const calcService = useCalculation();
    const logger = new Logger('CalculationView');
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        trackingService.resetResponseMsg();
        configService.resetSaveResult();
        logger.debug('calcService.calcData: ', calcService.calcData);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    const runCalculation = async() => {
        const latestEntry = getLatestEntry(trackingService.entryList);
        const results = await calcService.executeCalculation({ endDate: latestEntry.timestamp });
        if (results.length === 0){
            logger.error(`${calcService.errorMsgRef.current?.message ?? 'Unbekannter Fehler bei der Berechnung.'}`);
            return;
        }
    };

    const handleDeleteAll = async() => {
        calcService.resetResponseMsg();
        logger.debug('Lösche alle Berechnungen ...');
        const response = await calcService.deleteAllResults();
        if (!response) {
            logger.error(`${calcService.errorMsgRef.current?.message ?? 'Unbekannter Fehler beim Löschen.'}`);
            return;
        }
        setOpenDialog(false);
    };

    return (
        <div className={styles.pageContainer}>
            <InfoBox message={'Berechunng und Analyse der Enerigiekosten anhand der erfassten Zählerdaten und Kofigurationen. Alle Geldbeträge sind als brutto angegeben.'}/>
            {!openDialog ? (
            <>
                <LineDiagram
                    title={'Durchschnittlicher Tagesverbrauch'} 
                    dataList={calcService.calcData}
                    xAxis={{dataKey: 'periodEnd', label: 'Datum'}}
                    yAxis={{
                        dataKey: ['usedEnergyPerDay'], label: 'kWh', unit: 'kWh/Tag',
                        dataStyleProps: [{legendName: 'Energieverbrauch', color: 'var(--color-primary-hover)'}]
                    }}
                />

                <LineDiagram
                    title={'Gesamtkosten über den Abrechnungszeitraum'} 
                    dataList={calcService.calcData}
                    xAxis={{dataKey: 'periodEnd', label: 'Datum'}}
                    yAxis={
                        { dataKey: ['totalCostsPeriod', 'paidAmountPeriod'], label: 'EUR', unit: '€',
                        dataStyleProps: [{legendName: 'Fällige Gesamtkosten', color: 'var(--color-warning)'}, {legendName: 'Einzahlungen', color: 'var(--color-primary-hover)'}]
                        }
                    }
                />

                <BarDiagram
                    title={'Saldo'} 
                    dataList={calcService.calcData}
                    infoText="Positiver Wert = Guthaben; Negativer Wert = Nachzahlung"
                    xAxis={{dataKey: 'periodEnd', label: 'Datum'}}
                    yAxis={{dataKey: 'costDiffPeriod', label: 'EUR', unit: '€'}}
                />
                <MessageContainer message={calcService.responseMsg?.message ?? ""} type={calcService.responseMsg?.type} isVisible={calcService.responseMsg !== null} />
                <div className={styles.calculationButtonContainer}>
                    <CustomButton
                        iconProps={{iconSrc: '/play_icon_light.svg', size: 22, alt: 'Icon - Analysen anzeigen', ariaLabel: 'Icon - Analysen anzeigen'}}
                        title="Berechnung starten" 
                        type="button"
                        onClickCallback={runCalculation} 
                        isDisabled={calcService.isLoading}
                        sx={{marginTop: '0px', width: '250px', color:'white', gap: '10px'}} 
                    />                
                    <CustomButton
                        iconProps={{iconSrc: '/delete_icon_light.svg', size: 22, alt: 'Icon - Berechnungen löschen', ariaLabel: 'Icon - Berechnungen löschen'}}
                        title="Ergebnisse löschen" 
                        type="button"
                        onClickCallback={() => setOpenDialog(true)} 
                        isDisabled={calcService.isLoading}
                        sx={{marginTop: '0px', width: '250px', color:'white', gap: '10px', backgroundColor: 'var(--color-logout-button)'}} 
                    />
                </div>        
            </>    
            ) : (
                <ConfirmDialog
                    show={!authService.isLoading}
                    text="Sollen wirklich alle Ergebnisse gelöscht werden?"
                    callbackConfirm={handleDeleteAll}
                    callbackCancel={() => setOpenDialog(false)}
                />
            ) }
        </div>
    );
}

function getLatestEntry(entryList: TrackingEntityResponse[]) : TrackingEntityResponse {
    return entryList.reduce((latest, current) => {
        const [d1, m1, y1] = latest.timestamp.split(".");
        const [d2, m2, y2] = current.timestamp.split(".");
        const latestDate = new Date(+y1, +m1 - 1, +d1);
        const currentDate = new Date(+y2, +m2 - 1, +d2);
        return currentDate > latestDate ? current : latest;
    });
}