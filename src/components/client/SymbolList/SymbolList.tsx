import React from 'react';
import styled from 'styled-components';

// for new symbolItem
import formatNumber from '../../../lib/formatNumber';
import useLatestSymbolInfo from '../../../hooks/useLatestSymbolInfo';
import {
    Star
} from '@mui/icons-material';
import ScrollBar from '../../../styled/ScrollBar';

const dataColumn = ['Name', 'Price', 'Diff', 'Volume'];
// const dataColumn = ['종목', '현재가', '전일대비', '거래량'];

type PropsType = {
    style: Record<string, number | string>;
    symbolList: Array<any>;
    handleToggleFavorite: (symbol: string) => void;
};

const SymbolList = ({ style, symbolList, handleToggleFavorite }) => {
    return (
        <Wrapper style={style}>
            <Table>
                <thead>
                    <HeaderRow>
                        <th></th>
                        {dataColumn.map((column) => {
                            return <th key={column}>{column}</th>;
                        })}
                    </HeaderRow>
                </thead>

                <tbody>
                    {symbolList.map((symbol, index) => {
                        return (
                            <SymbolItem key={index} symbolInfo={symbol} handleToggleFavorite={handleToggleFavorite} />
                        );
                    })}
                </tbody>
            </Table>
        </Wrapper>
    );
};

const Wrapper = styled(ScrollBar)``;
const HeaderRow = styled.tr`
    color: #6a6a6a;
    width: 100%;
    th {
        color: ${({ theme }) => theme.colors.normalTextColor};
        background-color: ${({ theme }) => theme.colors.primaryColor};
        height: 40px;
        vertical-align: middle;
        text-align: end;
        font-size: 14px;
        position: sticky;
        top: 0;
    }
    th:nth-child(2) {
        text-align: start;
    }
    th:first-child {
        width: 30px;
    }
    th:last-child {
        text-align: center;
    }
`;

const Table = styled.table`
    width: calc(100% - 1px);
    font-size: ${({ theme }) => theme.fontSizes.content};

    tbody:nth-of-type(1) tr:nth-of-type(1) td {
        border-top: none !important;
    }
    thead th {
        border-top: none !important;
        border-bottom: none !important;
        box-shadow: inset 0 1px 0 #cecece, inset 0 -1px 0 #cecece;
        padding: 2px 0;
    }
`;

export default React.memo(SymbolList);

/*=========================
|  SymbolItem component   |
==========================*/
const SymbolItem = ({ symbolInfo, handleToggleFavorite }) => {
    const { close, volume, curNo, preClose, status, changePerc, isFavorite, isUp } = useLatestSymbolInfo({
        symbolInfo,
    });
    const formattedVolume = formatNumber(volume);

    return (
        <SymbolItemRow>
            <Td>
                <SymbolFavoriteIcon isFavorite={isFavorite} onClick={handleToggleFavorite(curNo)} />
            </Td>
            <Td>{curNo}</Td>
            <Td>{close}</Td>
            <SymbolDiffPerc isUp={isUp}>{changePerc}</SymbolDiffPerc>
            <Td>{formattedVolume}</Td>
        </SymbolItemRow>
    );
};

const SymbolDiffPerc = styled.td<{ isUp: boolean }>`
    text-align: end;
    color: ${({ isUp, theme }) => (isUp ? theme.colors.blue : theme.colors.red)};
`;

const SymbolItemRow = styled.tr`
    height: 45px;
    color: ${({ theme }) => theme.colors.normalTextColor};

    td {
        border-style: double;
        border-bottom: 1px solid ${({ theme }) => theme.colors.secondaryColor};
        vertical-align: middle;
    }

    td:last-child {
        padding-right: 10px;
    }

    td:first-child {
        text-align: end;
    }

    &:hover {
        td {
            border-spacing: 0;
            border-bottom: 1px;
            border-top: 1px;
            border-style: double;
            border-top-color: #8d92dd;
            border-bottom-color: #8d92dd;
        }

        td:first-child {
            border-left: 1px;
            border-left-color: #8d92dd;
            border-style: double;
        }
        td:last-child {
            border-right: 1px;
            border-right-color: #8d92dd;
            border-style: double;
        }
    }
`;

const Td = styled.td`
    text-align: end;
    vertical-align: middle;

    &:nth-child(2) {
        padding: 0;
        text-align: start;
    }
`;

const SymbolFavoriteIcon = styled(Star)<{ isFavorite: boolean }>`
    color: lightgray;
    cursor: pointer;
    margin-top: 6px;
    margin-right: 5px;
    color: ${({ isFavorite }) => isFavorite && '#ffdc00'};
`;
