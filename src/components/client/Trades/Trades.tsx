import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import ScrollBar from '../../../styled/ScrollBar';

/*===================================
| data type needs to be refactored  |
=====================================*/
type PropsType = {
    style: Record<string, any>;
    data: Array<any>;
};

const Trades = ({ style, data }: PropsType) => {
    const {t} = useTranslation()
    return (
        <TradeTableWrapper style={style}>
            <TradeTable>
                <TableHead>
                    <TableHeadRow>
                        <th>{t("trade:time")}</th>
                        <th>{t("trade:price")}</th>
                        <th>{t("trade:amount")}</th>
                    </TableHeadRow>
                </TableHead>

                <TableBody>
                    {data.slice(0, 20).map(({ close, volume, tradeType, time, buyOrSell }, index) => (
                        <TableBodyRow key={index}>
                            <TableCoinData>{time.slice(0, 19)}</TableCoinData>
                            <TableCoinData $tradeType={tradeType} $buyOrSell={buyOrSell}>
                                {close}
                            </TableCoinData>
                            <TableCoinData>{volume}</TableCoinData>
                        </TableBodyRow>
                    ))}
                </TableBody>
            </TradeTable>
        </TradeTableWrapper>
    );
};

export default Trades;

const TradeTableWrapper = styled(ScrollBar)``;

const TradeTable = styled.table`
    width: 100%;
    border-collapse: separate;
    font-size: ${({ theme }) => theme.fontSizes.content};
`;

const TableHead = styled.thead``;
const TableHeadRow = styled.tr`
    & > th {
        //width: 33.33%;
        vertical-align: middle;
        height: 40px;
        line-height: 40px;
        color: ${({ theme }) => theme.colors.dimmerTextColor};
        position: sticky;
        top: 0;
        left: 0;
        background-color: ${({ theme }) => theme.colors.primaryColor};
        //border-bottom: 1px solid ${({ theme }) => theme.colors.secondaryColor};
        z-index: 1;
    }

    th:nth-child(1) {
        text-align: left;
        padding-left: 15px;
    }
    th:nth-child(2) {
        text-align: right;
    }
    th:nth-child(3) {
        text-align: right;
        padding-right: 15px;
    }
`;

const TableBody = styled.tbody``;
const TableBodyRow = styled.tr`
    // height: ${({ theme }) => theme.tabMenu.rowHeight};
    height: 28px;
`;

const TableCoinData = styled.td<{ $tradeType?: string; $buyOrSell?: string }>`
    //width: 33.33%;
    text-align: right;
    vertical-align: middle;
    //padding-right: 35px;
    position: relative;
    border-bottom: 1px solid ${({ theme }) => theme.colors.secondaryColor};
    font-size: 12px;

    //Time
    &:nth-child(1) {
        color: ${({ theme }) => theme.colors.normalTextColor};
        text-align: left;
        padding-left: 15px;
    }

    //Price
    &:nth-child(2) {
        color: ${({ $buyOrSell, theme }) => ($buyOrSell === 'B' ? theme.colors.blue : theme.colors.red)};
        text-align: right;

        &::before {
            //display: block;
            //content: '';
            //height: 0;
            //width: 0;
            //position: absolute;
            //left: 22px;
            //top: 16px;
            //border-left: 5px solid transparent;
            //border-right: 5px solid transparent;
            //border-bottom: 6px solid #e56060;
            ${({ $buyOrSell }) =>
            $buyOrSell === 'S'
                    ? css`
                          transform: rotate(180deg);
                          border-bottom: 6px solid #5461bd;
                      `
                    : css`
                          /* transform: rotate(180deg); */
                          border-bottom: 6px solid #d02129;
                      `}
        }
    }

    //Amount
    &:nth-child(3) {
        text-align: right;
        padding-right: 15px;
        color: ${({ theme }) => theme.colors.dimmerTextColor};
    }

    &:last-child {
        //padding-right: 20px;
    }
`;
