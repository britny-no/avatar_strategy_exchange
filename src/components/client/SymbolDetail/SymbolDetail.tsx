import React from 'react';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";

import useSymbolDetail from '../../../hooks/useSymbolDetail';
import { useTypedSelector } from '../../../states/useTypedSelector';
import ScrollBar from '../../../styled/ScrollBar';


const menuDataKey = [
    'CUR_NO',
    // 'NAME_ENG',
    // 'NAME_KOR',
    // 'EX_CODE',
    // 'TERM_YY-1',
    // 'TERM_NO1',
    // 'TERM_QMW',
    // 'FX_CODE',
    'TRADE_TYPE',
    // 'CLOSE_DATE',
    // 'DAY_COUNT',
    // 'ST_DATE',
    // 'ED_DATE',
    'ST_TIME',
    'ED_TIME',
    // 'CLOSE_TIME',
    'MAX_ORDCNT',
    'MIN_ORDCNT',
    'PIP_LOWEST',
    'PIP_COST',
    'ORDER_STAT',
];

const extractUsefulData = (data) => {
    const copiedData = Object.assign({}, data);
    delete copiedData.NAME_ENG;
    delete copiedData.NAME_KOR;
    delete copiedData.EX_CODE;
    delete copiedData['TERM_YY-1'];
    delete copiedData.TERM_NO1;
    delete copiedData.TERM_QMW;
    delete copiedData.FX_CODE;
    delete copiedData.CLOSE_DATE;
    delete copiedData.DAY_COUNT;
    delete copiedData.ST_DATE;
    delete copiedData.ED_DATE;
    delete copiedData.CLOSE_TIME;
    return copiedData;
};

const SymbolDetail = ({ style }: { style: Record<string, string | number> }) => {
    const { t } = useTranslation()
    const currentSymbol = useTypedSelector((state) => state.symbolReducer.currentSymbol);
    const detail = useSymbolDetail(currentSymbol);
    const dataArr = !Array.isArray(detail) ? extractUsefulData(detail) : {};

    const menuData =  [
        t("trade:symbol_name"),
        t("trade:trade_type"),
        t("trade:market_open_time"),
        t("trade:market_close_time"),
        t("trade:maximum_lots"),
        t("trade:minimum_lots"),
        t("trade:point_position"),
        t("trade:pip_value"),
        t("trade:order_stat"),
    ];
    return (
        <Menu style={style}>
            {menuData.map((menu, index) => (
                <Item key={index}>
                    <Category>{menu}</Category>
                    <Data>{detail && dataArr[menuDataKey[index]]}</Data>
                </Item>
            ))}
        </Menu>
    );
};

export default React.memo(SymbolDetail);

const Menu = styled(ScrollBar)`
    padding: 10px 0;
    font-size: ${({ theme }) => theme.fontSizes.content};
    color: ${({ theme }) => theme.colors.normalTextColor};
`;

const Item = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: ${({ theme }) => theme.tabMenu.rowHeight};
    width: 100%;
    padding: 0 10px;
    &:hover {
        // background-color: ${({ theme }) => theme.colors.normalTextColor};
        //font-weight: 500;
        //color: #5461bd;
    }
    & > span {
        display: inline-block;
        line-height: 16px;
        vertical-align: middle;
    }
`;

const Category = styled.span``;

const Data = styled.span`
    width: 100px;
    text-align: right;
    letter-spacing: -1.5px;
`;
