import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useLatestSymbolInfo from '../../../hooks/useLatestSymbolInfo';
import useSymbolList from '../../../hooks/useSymbolList';

const CoinStatus = () => {
    const {t} = useTranslation()
    const { currentSymbolData } = useSymbolList();

    const { close, szHigh, szLow, volume, curNo, preClose, status, changePerc, maxOrderCount } = useLatestSymbolInfo({
        symbolInfo: currentSymbolData,
    });

    const isUp = changePerc > 0 ? true : false;
    return (
        <CoinStatusWrapper>
            <Close $isUp={isUp}>{close}</Close>
            <Section>
                <Title>{t("coinStatus:max_contract_volume")}</Title>
                <div>{maxOrderCount}</div>
            </Section>
            <Section>
                <Title>{t("coinStatus:24h_change")}</Title>
                <ChangePercentage $isUp={isUp}>
                    {preClose} {changePerc}%
                </ChangePercentage>
            </Section>
            <Section>
                <Title>{t("coinStatus:24h_high")}</Title>
                <div>{szHigh}</div>
            </Section>
            <Section>
                <Title>{t("coinStatus:24h_low")}</Title>
                <div>{szLow}</div>
            </Section>
        </CoinStatusWrapper>
    );
};

export default CoinStatus;
const Title = styled.div``;

const Section = styled.div``;

const Close = styled.div<{ $isUp: boolean }>`
    color: ${({ theme, $isUp }) => ($isUp ? theme.colors.blue : theme.colors.red)};
    font-size: 22px;
    line-height: 30px;
`;

const ChangePercentage = styled.div<{ $isUp: boolean }>`
    color: ${({ theme, $isUp }) => ($isUp ? theme.colors.blue : theme.colors.red)};
`;

const CoinStatusWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-left: 15px;
    padding-left: 15px;
    border-left: 1px solid ${({ theme }) => theme.colors.secondaryColor};
    // color: ${({ theme }) => theme.colors.red};
    ${Section} {
        font-size: 13px;
        margin-left: 15px;
        margin-right: 15px;
        height: 100%;
        line-height: 100%;
        color: #e1e1e1;
    }

    ${Title} {
        margin-bottom: 6px;
        color: ${({ theme }) => theme.colors.dimmerTextColor};
    }
`;
