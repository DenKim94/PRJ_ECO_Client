import { useEffect } from "react";
import styles from "./Overview.module.scss";
import { useAuth } from "../hooks/useAuth";
import { useTracking } from "../hooks/useTracking";
import { useConfig } from "../hooks/useConfig";
import { InfoBox } from "../components/InfoBox";
import { LineDiagram } from "../components/LineDiagram";
import { useCalculation } from "../hooks/useCalculation";
import { InfoCard, InfoProps } from "../components/InfoCard";
import { BarDiagram } from "../components/BarDiagram";
import { HelperClass } from "../utils/helper";


export default function Overview() {
    const authService = useAuth();
    const configService = useConfig();
    const calcService = useCalculation();
    const trackingService = useTracking();
    const usedEnergyPerPeriod = trackingService.getUsedEnergyPerPeriod();
    const calcDataLatest = (calcService.calcData && calcService.calcData.length > 0) 
        ? (calcService.calcData[calcService.calcData.length - 1]) 
        : null;

    const costDiffLatest = calcDataLatest ? calcDataLatest.costDiffPeriod : 0;
    const usedEnergyLatest = calcDataLatest ? calcDataLatest.sumUsedEnergy : 0;
    const usedEnergyPerDayLatest = calcDataLatest ? calcDataLatest.usedEnergyPerDay : null;
    const trendUsedEnergyPerDayPositive = usedEnergyPerDayLatest
        ? usedEnergyPerDayLatest < calcService.calcData[calcService.calcData.length - 2]?.usedEnergyPerDay 
        : false;

    const trendingIconSrc = trendUsedEnergyPerDayPositive ? '/trending_down_green_icon.svg' : '/trending_up_red_icon.svg';

    const infoSaldoList : InfoProps <string | number> [] = [
        { 
            label: 'Abrechnungszeitraum', 
            value: `${calcDataLatest?.periodStart} - ${calcDataLatest?.periodEnd}`,
        },        
        { 
            label: 'Aktueller Saldobetrag', 
            value: `${HelperClass.formatNumberDE(costDiffLatest)} €`,
            valueSx: { 
                color: costDiffLatest < 0 ? '#d72222' : '#28A745', 
                fontWeight: 'bold',
            }
        },
    ];

    const infoUsedEnergyList : InfoProps <string | number> [] = [
        { 
            label: 'Aktueller Gesamtverbrauch', 
            value: `${HelperClass.formatNumberDE(usedEnergyLatest)} kWh`,
        },
        { 
            label: 'Durchschnittlicher Tagesverbrauch', 
            value: `${HelperClass.formatNumberDE(usedEnergyPerDayLatest)} kWh/Tag`,
            valueSx: { 
                color: trendUsedEnergyPerDayPositive ? '#28A745': '#d72222', 
                fontWeight: 'bold',
            },
            iconProps: {
                src: trendingIconSrc,
                size: 28,
                alt: 'Trending-Info-Icon'
            } 
        },
    ];

    useEffect(() => {
        trackingService.resetResponseMsg();
        configService.resetSaveResult();
        calcService.resetResponseMsg();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(!authService.userDetailedData?.isValidatedEmail) {
        return null;
    }

    return (
        <div className={styles.pageContainer}>
            <InfoBox message={'Datenübersicht zum aktuellen Stromverbrauch und zur Kostenentwicklung'}/>
            <div className={styles.infoCardsContainer}>
                <InfoCard
                    infoProps={infoSaldoList}
                />
                <InfoCard
                    infoProps={infoUsedEnergyList}
                />           
            </div>
            <LineDiagram
                title={'Normierter Stromverbrauch je Messperiode'}
                heightPx={280} 
                dataList={usedEnergyPerPeriod}
                infoText="Info: Der normierte Verbrauchswert bezieht sich jeweils auf den Zeitraum zwischen zwei Ablesezeitpunkten."
                xAxis={{
                    dataKey: 'date', 
                    label: 'Datum'
                }}
                yAxis={{
                    dataKey: ['energyDifferenceNorm'], 
                    label: 'kWh/Tag', 
                    unit: 'kWh/Tag',
                    dataStyleProps: [{legendName: 'Verbrauch', color: 'var(--color-primary-hover)'}]
                }}
            />
            <BarDiagram
                title={'Stromverbrauch im Abrechnungszeitraum'} 
                heightPx={280} 
                infoText="Info: Die angegebenen Absolutwerte bilden jeweils die Summe aus der verbrauchten Energiemenge zwischen den Ablesezeitpunkten."
                dataList={calcService.calcData}
                xAxis={{dataKey: 'periodEnd', label: 'Datum'}}
                yAxis={{dataKey: 'sumUsedEnergy', label: 'kWh', unit: 'kWh'}}
            />        
        </div>
    );
}