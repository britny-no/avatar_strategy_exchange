import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import moment from 'moment';
import 'moment-timezone';
import { useTranslation } from 'react-i18next';

import useScreenSize from '@/hooks/useScreenSize';
import { useTypedSelector } from '@/states/useTypedSelector';
import { returnSymbol } from './Hero';


type ActiveProps = {
    active: boolean;
};

const History = ({ coinOb, szAccNo, selectedSymbol }) => {
    const {t} = useTranslation()
    const { isMobile } = useScreenSize();
    const t3626 = useTypedSelector((state) => state.stateReducer[`t3626_${selectedSymbol}`]);

    const RenderRowPc = () => {
        let key = 0;
        if (!t3626) {
            return (
                <tr>
                    <td>{t("wallet:wait_please")}</td>
                </tr>
            );
        } else if (t3626 && t3626.length === 0 ) {
            return (
            <tr>
                <td>{t("wallet:no_data")}</td>
            </tr>
            );
        }
        return t3626.map((v) => {
            key += 1;
            return (
                <tr className="row" key={key}>
                    <RowMiddle style={{ width: '15%' }}>{v[6]}</RowMiddle>
                    <RowFirst style={{ width: '10%' }}>
                        <span className="wallet_coin_symbol">{returnSymbol(v[1])}</span>
                        <span>{v[1]}</span>
                    </RowFirst>
                    <RowMiddle style={{ width: '20%' }}>{`${v[4]} ${v[1]}`}</RowMiddle>
                    <RowMiddle
                        style={{ width: '300px', overflow: 'hidden', display: 'block', textOverflow: 'ellipsis' }}
                    >
                        {v[0]}
                    </RowMiddle>
                    <RowMiddle style={{ width: '5%' }}>{v[2] === '079' ? t("wallet:in") : t("wallet:out")}</RowMiddle>
                    <RowMiddle style={{ width: '6%' }}>{v[3] === 'SOM' ? t("wallet:transfer") : t("wallet:convert")}</RowMiddle>
                </tr>
            );
        });
    };

    const RenderRowMo = () => {
        let key = 0;

        if (!t3626) {
            return (
                <tr>
                    <td>{t("wallet:wait_please")}</td>
                </tr>
            );
        } else if (t3626 && t3626.length === 0 ) {
            return (
            <tr>
                <td>{t("wallet:no_data")}</td>
            </tr>
            );
        }

        return t3626.map((v) => {
            key += 1;
            return (
                <table style={{ borderBottom: '1px solid #EDEDED', marginBottom: '10px' }} key={key}>
                    <thead>
                        <tr>
                            <RowFirst style={{ display: 'inline-block', width: '50%' }}>
                                <span className="wallet_coin_symbol">{returnSymbol(v[1])}</span>
                                <span>{v[1]}</span>
                            </RowFirst>
                            <td style={{ display: 'inline-block', width: '50%', paddingLeft: '10px' }}>
                                <M_Status> {v[2] === '079' ? t("wallet:in") : t("wallet:out")} </M_Status>
                                <M_Status> {v[3] === 'SOM' ? t("wallet:transfer") : t("wallet:convert")} </M_Status>
                            </td>
                        </tr>
                    </thead>
                    <tbody style={{ margin: '8px 0px', padding: '4px 0px' }}>
                        <tr style={{ display: 'inline-block', width: '100%', margin: '10px' }}>
                            <td style={{ display: 'inline-block', width: '50%' }}>
                                <M_Column>{t("wallet:time")}</M_Column>
                                <br />
                                <M_Row>{v[6]}</M_Row>
                            </td>
                            <td style={{ display: 'inline-block', width: '50%' }}>
                                <M_Column>{t("wallet:amount")}</M_Column>
                                <br />
                                <M_Row>{`${v[4]} ${v[1]}`}</M_Row>
                            </td>
                        </tr>
                        <tr style={{ display: 'inline-block', width: '100%', margin: '10px' }}>
                            <td style={{ display: 'inline-block', width: '100%' }}>
                                <M_Column>{t("wallet:tx")}</M_Column>
                                <br />
                                <M_Row className="tr_span">{v[0]}</M_Row>
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        });
    };

    return (
        <>
            <div className="flex_div">
                <span className="sub_title">{t("wallet:deposit_and_withdraw_history")}</span>
                {/* <NavButton>
                    <NavDeposit active={selectedNav === 'deposit'} onClick={() => setSelectedNav('deposit')}>
                        Deposit
                    </NavDeposit>
                    <NavDeposit active={selectedNav === 'withdraw'} onClick={() => setSelectedNav('withdraw')}>
                        Withdraw
                    </NavDeposit>
                </NavButton> */}
            </div>
            {isMobile ? (
                <div style={{ overflowY: 'scroll', height: '400px', width: '100%' }}>
                    <br />
                    {RenderRowMo()}
                </div>
            ) : (
                <AssetTable>
                    <thead style={{ display: 'table', width: '100%' }}>
                        <tr className="column">
                            <th style={{ width: '15%' }}>{t("wallet:time")}</th>
                            <th style={{ width: '10%' }}>{t("wallet:coin")}</th>
                            <th style={{ width: '20%' }}>{t("wallet:amount")}</th>
                            <th style={{ width: '300px' }}>{t("wallet:tx")}</th>
                            <th style={{ width: '5%' }}>{t("wallet:in_out")}</th>
                            <th style={{ width: '6%' }}>{t("wallet:status")}</th>
                        </tr>
                    </thead>
                    <tbody style={{ display: 'block', overflowY: 'scroll', width: '100%', height: '400px' }}>
                        {RenderRowPc()}
                    </tbody>
                </AssetTable>
            )}
        </>
    );
};

export default History;

const AssetTable = styled.table`
    max-width: 1200px;
    margin: 38px auto 0px;
    width: 100%;
    text-align: left;
    & .column {
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #9a9a9a;
        font-family: Noto Sans;
        font-style: normal;
        font-weight: bold;
        font-size: 14px;
        line-height: 19px;
        color: #383838;
    }

    & .row {
        display: table;
        width: 100%;
        height: 55px;
        border-bottom: 1px solid #e7e7e7;
        line-height: 55px;
        font-family: Noto Sans;
        font-style: normal;
        line-height: 19px;

        td:nth-child(6) {
            width: 20%;
        }
    }
`;

const RowFirst = styled.td`
    height: 50px;
    span {
        font-weight: 700;
        font-size: 14px;
        color: #383838;
    }
    svg {
        margin-right: 4px;
        position: relative;
        top: 10px;
    }
`;

const RowMiddle = styled.td`
    font-weight: normal;
    font-size: 14px;
    color: #7d7d7d;
`;

const NavButton = styled.span`
    float: right;
    margin-top: 6px;

    & > button {
        font-size: 14px;
        font-family: Noto Sans;
        font-style: normal;
        font-weight: 500;
        line-height: 22px;
        color: #999999;
        border: 0;
    }
`;

const NavDeposit = styled.button<ActiveProps>`
    ${(props) =>
        props.active &&
        css`
            font-weight: 700 !important;
            color: #173959 !important;
            border-bottom: 1px solid #173959 !important;
        `}
`;

const M_Column = styled.span`
    height: 30px;
    line-height: 30px;
    font-family: Noto Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 19px;
    color: #383838;
`;

const M_Row = styled.span`
    font-weight: normal;
    font-size: 14px;
    color: #7d7d7d;

    &.tr_span {
        width: 100%;
        display: -webkit-box;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        height: 40px;
    }
`;

const M_Status = styled.span`
    font-family: Noto Sans;
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 16px;
    color: #173959;
    text-align: right;
`;
