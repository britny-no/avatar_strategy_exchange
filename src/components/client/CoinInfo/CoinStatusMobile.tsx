import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useLatestSymbolInfo from '../../../hooks/useLatestSymbolInfo';
import { useTypedSelector } from '../../../states/useTypedSelector';
import useSymbolList from '../../../hooks/useSymbolList';

const CoinStatus = () => {
    const {t} = useTranslation()
    const currentSymbol = useTypedSelector((state) => state.symbolReducer.currentSymbol);
    const { symbols: symbolList } = useSymbolList();

    const symbolInfo = symbolList.length ? symbolList.find((symbolInfo) => symbolInfo.CUR_NO.replace(/\s*$/,"") === currentSymbol.replace(/\s*$/,"")) : {};
    const { close, szHigh, szLow, volume, curNo, preClose, status, changePerc, maxOrderCount } = useLatestSymbolInfo({
        symbolInfo,
    });

    const isUp = changePerc > 0 ? true : false;

    // console.log('CoinStatus -> currentSymbol :', currentSymbol, 'symbolInfo :', symbolInfo, 'symbolList', symbolList);
    return (
        <div>
            <CoinStatusWrapper>
                {/*<Section>*/}
                {/*    <Title>Max Contract Volume</Title>*/}
                {/*    <div>{maxOrderCount}</div>*/}
                {/*</Section>*/}
                <Section>
                    <Close isUp={isUp}>{close}</Close>
                </Section>
                <Section>
                    <Title>{t("coinStatus:24h_high")}</Title>
                    <div>{szHigh}</div>
                </Section>
                <Section>
                    <Title>{t("coinStatus:24h_change")}</Title>
                    <ChangePercentage isUp={isUp}>
                        {preClose} {changePerc}%
                    </ChangePercentage>
                </Section>
                <Section>
                    <Title>{t("coinStatus:24h_low")}</Title>
                    <div>{szLow}</div>
                </Section>
            </CoinStatusWrapper>
        </div>
    );
};

export default CoinStatus;
const Title = styled.div``;

const Section = styled.div``;

const Close = styled.div<{ isUp: boolean }>`
    color: ${({ theme, isUp }) => (isUp ? theme.colors.blue : theme.colors.red)};
    font-size: 16px;
    line-height: 16px;
`;

const ChangePercentage = styled.div<{ isUp: boolean }>`
    color: ${({ theme, isUp }) => (isUp ? theme.colors.blue : theme.colors.red)};
`;

const CoinStatusWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: 12px;
    //padding-left: 15px;
    // border-left: 1px solid ${({ theme }) => theme.colors.secondaryColor};
    // color: ${({ theme }) => theme.colors.red};
    ${Section} {
        width: 46%;
        font-size: 13px;
        //margin-left: 15px;
        //margin-right: 15px;
        height: 100%;
        line-height: 100%;
        color: #e1e1e1;
        margin-bottom: 20px;
        margin-right: 6px;
    }

    ${Title} {
        margin-bottom: 6px;
        font-size: 11px;
        color: ${({ theme }) => theme.colors.dimmerTextColor};
    }
`;
