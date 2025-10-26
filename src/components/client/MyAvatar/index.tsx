import { useTranslation } from "react-i18next";
import styled, { css } from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import useScreenSize from '@/hooks/useScreenSize';
import { deleteTr } from '@/states/reducers/stateReducer';
import * as LANGUAGE from '@/constants/Language';
import { useTypedSelector } from '@/states/useTypedSelector';
import socketService from '@/states/socketAgent/SocketService';
import LogInRequired from "@/components/common/LogInRequired";

export default function Index({ language = LANGUAGE.KOREAN }) {
    const { t } = useTranslation()
    const dispatch = useDispatch();
    const { isMobile } = useScreenSize();

    const { email } = useTypedSelector((state) => state.userReducer.data);
    const isLoggedIn = useTypedSelector((state) => state.userReducer.isLoggedIn);
    const t3901 = useTypedSelector((state) => state.stateReducer.t3901);
    const [pre_form, setPreForm] = useState({})
    const [form, setForm] = useState({})

    const ob = {
        "P_MG": t("metaverseTrader:martingale"),
        "P_TP": t("metaverseTrader:typhoon"),
        "P_TR": t("metaverseTrader:trap_repeat"),
        "P_TB": t("metaverseTrader:tech_band")
    }

    useEffect(() => {
        socketService.sendToAgent({
            Header: {
                function: "D",
                termtype: "HTS",
                trcode: "t3901"
            },
            Input1: {
                szGubun: "2",
                szUserID: `000${email}`,
            }
        })
        socketService.sendToAgent({
            Header: { function: 'D', termtype: 'HTS', trcode: 't5511' },
            Input1: { szMemberNo: "000" },
        })

        return () => {
            dispatch(deleteTr({ key: `t3901`, data: [] }))
            dispatch(deleteTr({ key: `t3902`, data: [] }))
        }
    }, [])

    useEffect(() => {
        if (t3901 && t3901.Output2) {
            // renderRow안에서 setForm시 infinite-render됨
            let key = {}
            t3901.Output2.forEach((v, k) => {
                key = {
                    ...key,
                    [k]: {
                        szStrategy: v[0], szCurNo: v[1],
                        szStrategy_ID: v[2],
                        szStrategy_YN: v[3], nCommand: v[19]
                    }
                }
            })
            setForm(key)
            setPreForm(key)

        }
    }, [t3901])

    const onChangeHandler = (e) => {
        const { name, value } = e.target

        setForm({
            ...form,
            [name]: {
                ...form[name],
                nCommand: value
            }
        })
    }

    const renderMoTable = () => {
        if (t3901 && t3901.Output2) {
            return <div style={{ padding: "4px" }}>
                <AssetTableM>
                    <thead style={{ display: 'block', width: '100%' }}>
                        <tr className="column" style={{ display: 'flex', width: '100%', flexFlow: "wrap" }}>
                            <th style={{ width: '20%' }}>{t("metaverseTrader:strategy")}</th>
                            <th style={{ width: '20%' }}>{t("metaverseTrader:symbol")}</th>
                            <th style={{ width: '20%' }}>{t("metaverseTrader:strategy_name")}</th>
                            <th style={{ width: '20%' }}>{t("metaverseTrader:command")}</th>
                            <th style={{ width: '20%' }}>{t("metaverseTrader:p_l")}</th>
                        </tr>
                    </thead>
                    <tbody
                        style={{
                            display: 'block',
                            // overflowY: 'scroll',
                            width: '100%',
                            height: '400px',
                        }}
                    >
                        {t3901.Output2.filter((v, k) => form[k] !== undefined).map((v, k) => {
                            return <AcriveTrM className="row" key={k}>
                                <RowMiddleM style={{ width: '20%' }}>{v[0]}: {ob[v[0].trim()]}</RowMiddleM>
                                <RowMiddleM style={{ width: '20%' }}>{v[1]}</RowMiddleM>
                                <RowMiddleM style={{ width: '20%' }}>{v[2]}</RowMiddleM>
                                <RowMiddleM style={{ width: '20%' }}>
                                    <select value={form[k].nCommand} onChange={onChangeHandler} name={k} style={{ cursor: "pointer" }}>
                                        <option value="0">{t("metaverseTrader:pause")}</option>
                                        <option value="1">{t("metaverseTrader:close_all")}</option>
                                        <option value="2">{t("metaverseTrader:stop")}</option>
                                        <option value="3">{t("metaverseTrader:both")}</option>
                                        <option value="4">{t("metaverseTrader:sell")}</option>
                                        <option value="5">{t("metaverseTrader:buy")}</option>
                                    </select>
                                </RowMiddleM>
                                <RowMiddleM style={{ width: '20%' }}>{v[8]}</RowMiddleM>
                            </AcriveTrM>
                        })}
                    </tbody>
                </AssetTableM>
            </div>
        } else {
            return <span>{t("metaverseTrader:no_data")}</span>
        }
    }

    const renderPcTable = () => {
        if (t3901 && t3901.Output2) {
            return <AssetTable>
                <thead style={{ display: 'table', width: '100%' }}>
                    <tr className="column" >
                        <th style={{ width: '20%' }}> {t("metaverseTrader:strategy")} </th>
                        < th style={{ width: '20%' }}> {t("metaverseTrader:symbol")} </th>
                        < th style={{ width: '20%' }}> {t("metaverseTrader:strategy_name")} </th>
                        < th style={{ width: '20%' }}> {t("metaverseTrader:command")} </th>
                        <th style={{ width: '20%' }}>{t("metaverseTrader:p_l")}</th>
                    </tr>
                </thead>
                < tbody
                    style={{
                        display: 'block',
                        overflowY: 'scroll',
                        width: '100%',
                    }}
                >
                    {
                        t3901.Output2.filter((v, k) => form[k] !== undefined).map((v, k) => {
                            return <AcriveTr className="row" key={k} >
                                <RowMiddle style={{ width: '20%' }}> {v[0]}: {ob[v[0].trim()]} </RowMiddle>
                                < RowMiddle style={{ width: '20%' }
                                }> {v[1]} </RowMiddle>
                                < RowMiddle style={{ width: '20%' }} > {v[2]} </RowMiddle>
                                < RowMiddle style={{ width: '20%' }}>
                                    <select value={form[k].nCommand} onChange={onChangeHandler} name={k} style={{
                                        cursor: "pointer",
                                        backgroundColor: "rgb(220, 182, 126)",
                                        color: "white",
                                    }}>
                                        <option value="0" style={{ backgroundColor: "rgb(220, 182, 126)", color: "white" }}> {t("metaverseTrader:pause")} </option>
                                        < option value="1" style={{ backgroundColor: "rgb(220, 182, 126)", color: "white" }}> {t("metaverseTrader:close_all")} </option>
                                        < option value="2" style={{ backgroundColor: "rgb(220, 182, 126)", color: "white" }}> {t("metaverseTrader:stop")} </option>
                                        < option value="3" style={{ backgroundColor: "rgb(220, 182, 126)", color: "white" }}> {t("metaverseTrader:both")} </option>
                                        < option value="4" style={{ backgroundColor: "rgb(220, 182, 126)", color: "white" }}> {t("metaverseTrader:sell")} </option>
                                        < option value="5" style={{ backgroundColor: "rgb(220, 182, 126)", color: "white" }}> {t("metaverseTrader:buy")} </option>
                                    </select>
                                </RowMiddle>
                                < RowMiddle style={{ width: '20%' }}> {v[8]} </RowMiddle>
                            </AcriveTr>
                        })}
                </tbody>
            </AssetTable>
        } else {
            return <span>{t("metaverseTrader:no_data")} </span>
        }
    }

    const logInStyleProps = {
        width: '100%',
        height: '385px',
    };

    return (
        <Content>
            {isLoggedIn ? (isMobile ? renderMoTable() : renderPcTable()) : <LogInRequired {...logInStyleProps} />}
        </Content>
    );
}

const Content = styled.div`
    padding: 4px;
`;

const AssetTable = styled.table`
    width: 100%;
    overflow-x: scroll;
    text-align: center;
    & .column {
        height: 30px;
        line-height: 19px;
        border-bottom: 1px solid rgb(255, 171, 46)
        font-family: Noto Sans;
        font-style: normal;
        font-weight: bold;
        font-size: 14px;
        color: rgb(255, 171, 46);
    }

    & .row {
        display: flex;
        width: 100%;
        border-bottom: 1px solid  rgb(255, 171, 46)
        font-family: Noto Sans;
        font-style: normal;

        td:nth-child(6) {
            width: 20%;
        }
    }
`;


const AcriveTr = styled.tr`
    cursor: pointer;
    height: 50px;
    line-height: 50px;

`;
const RowMiddle = styled.td`
    height: 50px;
    line-height: 50px;

    text-overflow: ellipsis;
    display: inline-block;
    overflow: hidden;
    font-weight: normal;
    font-size: 14px;
    color: rgb(255, 171, 46);
`;


const AssetTableM = styled.table`
    min-width: 300px;
    width: 100%;
    // overflow-x: scroll;
    text-align: center;
    & .column {
        // height: 30px;
        line-height: 19px;
        border-bottom: 1px solidrgb(255, 171, 46)
        font-family: Noto Sans;
        font-style: normal;
        font-weight: bold;
        font-size: 14px;
        color: rgb(255, 171, 46)
    }

    & .row {
        display: flex;
        flex-flow: wrap;
        width: 100%;
        border-bottom: 1px solidrgb(255, 171, 46)
        font-family: Noto Sans;
        font-style: normal;

        td:nth-child(6) {
            width: 20%;
        }
    }
`;

const AcriveTrM = styled.tr`
    cursor: pointer;
    // height: 50px;
    line-height: 50px;

`;
const RowMiddleM = styled.td`
    // height: 50px;
    line-height: 50px;
    text-overflow: ellipsis;
    display: inline-block;
    overflow: hidden;
    font-weight: normal;
    font-size: 14px;
    color: rgb(255, 171, 46)
`;


