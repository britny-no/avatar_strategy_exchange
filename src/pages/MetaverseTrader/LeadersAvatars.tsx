import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import moment from 'moment';
import 'moment-timezone';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import useScreenSize from '@/hooks/useScreenSize';
import { useTypedSelector } from '@/states/useTypedSelector';
import socketService from '@/states/socketAgent/SocketService';
import Martingale from '@/assets/Martingale.png';
import Typhoon from '@/assets/Typhoon.png';
import TrapRepeat from '@/assets/Trap-repeat.png';
import TechBand from '@/assets/Tech-Band.png';
import { deleteTr } from '@/states/reducers/stateReducer';

export const reloadList = (email) => {
    socketService.sendToAgent({
        Header : {
            function : "D",
            termtype : "HTS",
            trcode : "t3901"
        },
        Input1 : {
            szGubun : "3",
            szUserID : `000${email}`,
        }
    })  
};

const index = () => {
    const {t} = useTranslation()
    const dispatch = useDispatch();

    const  { email } = useTypedSelector((state) => state.userReducer.data);
    const isLoggedIn = useTypedSelector((state) => state.userReducer.isLoggedIn);
    const t3901 = useTypedSelector((state) => state.stateReducer.t3901);
    // const t5511 = useTypedSelector((state) => state.stateReducer.t5511);

    if (!isLoggedIn ) {
        alert(t("metaverseTrader:please_login"));
        window.location.href = '/mobile/signin';
        return null;
    }

    useEffect(() => {
        socketService.sendToAgent({
            Header : {
                function : "D",
                termtype : "HTS",
                trcode : "t3901"
            },
            Input1 : {
                szGubun : "3",
                szUserID : `000${email}`,
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


    return (
        <div className='content'> 
        <ContentHead>
            <p className="title">{t("metaverseTrader:leader_avatars")}</p>
            <br/>
            <br/>
            <br/>
        </ContentHead>
        <ContentBody>
            <List info={{t3901}} />
        </ContentBody>
    </div>
    );
};

const List = ({info}) => {
    const {t} = useTranslation()
    const {t3901} = info
    const { isMobile } = useScreenSize();
    const t3902 = useTypedSelector((state) => state.stateReducer.t3902);
    const  { email } = useTypedSelector((state) => state.userReducer.data);

    const [loading, setLoading] = useState(false);
    const [pre_form, setPreForm] = useState({})
    const [form, setForm] = useState({})
    const ob = {
        "P_MG" : t("metaverseTrader:martingale"),
        "P_TP" : t("metaverseTrader:typhoon"),
        "P_TR" : t("metaverseTrader:trap_repeat"),
        "P_TB" : t("metaverseTrader:tech_band")
    }
    const element = {
        "P_MG" : <>
            <img src={Martingale} style={{ width: '50px', height: "98%" }} />
            <DetailInfoSpan>{t("metaverseTrader:p_mg_detail")}</DetailInfoSpan>
        </>,
        "P_TP" : <>
            <img src={Typhoon} style={{ width: '50px', height: "98%" }} />
            <DetailInfoSpan>{t("metaverseTrader:p_tp_detail")}</DetailInfoSpan>
        </>,
        "P_TR" : <>
            <img src={TrapRepeat} style={{ width: '50px', height: "98%" }} />
            <DetailInfoSpan>{t("metaverseTrader:p_tr_detail")}</DetailInfoSpan>
        </>,
        "P_TB" : <>
            <img src={TechBand} style={{ width: '50px', height: "98%" }} />
            <DetailInfoSpan>{t("metaverseTrader:p_tb_detail")}</DetailInfoSpan>
        </>
    }

    useEffect(() => {
        if (loading && t3902) {
            const { flag, data } = t3902.Message;
            switch (flag) {
                case 'E':
                    alert(data);
                    setLoading(false);
                    break;
                case '0':
                    reloadList(email)
                    alert(t("metaverseTrader:registration_completed"));
                    setLoading(false);
                    break;
                default:
                    alert(data);
            }
        }
    }, [t3902, loading]);

    useEffect(() => {
        if(t3901 && t3901.Output2){
            // renderRow안에서 setForm시 infinite-render됨
            let key = {}
            t3901.Output2.forEach((v, k) => {
                key = {
                    ...key,
                    [k] : {
                        szStrategy : v[0], szCurNo : v[1],
                        szStrategy_ID : v[2],
                        szStrategy_YN: v[3], nCommand: v[19]
                    }
                }
            })
            setForm(key)
            setPreForm(key)

        }
    }, [t3901])

    const reqSave = (e) => {
        const type = e.target.name
        const {szStrategy, szCurNo, szStrategy_ID, szStrategy_YN, nCommand} = form[type]

        setLoading(true)
        socketService.sendToAgent({
            Header : {
                function : "D", termtype : "HTS", trcode : "t3902"
            }, 
            Input1 : {
                szStrategy, szCurNo,szStrategy_ID, szStrategy_YN : "1", szUserID : `000${email}`
            }
        });

    }

    const renderMoTable = () => {
        if(t3901 && t3901.Output2){
            return <AssetTableM>
                <thead style={{ display: 'block', width: '100%' }}>
                    <tr className="column" style={{ display: 'flex', width: '100%', flexFlow:"wrap" }}>
                        <th style={{ width: '30%' }}>{t("metaverseTrader:strategy")}</th>
                        <th style={{ width: '20%' }}>{t("metaverseTrader:symbol")}</th>
                        <th style={{ width: '25%' }}>{t("metaverseTrader:strategy_name")}</th>
                        <th style={{ width: '20%' }}>{t("metaverseTrader:p_l")}</th>
                        <th style={{ width: '70%' }}>{t("metaverseTrader:detail_information")}</th>
                        <th style={{ width: '20%' }}>{t("metaverseTrader:run")}</th>
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
                const {nCommand} = form[k]
                const type = v[0].trim()

                return <AcriveTrM className="row" key={k}>
                    <RowMiddleM style={{ width: '30%' }}>{v[0]}: {ob[type]}</RowMiddleM>
                    <RowMiddleM style={{ width: '20%' }}>{v[1]}</RowMiddleM>
                    <RowMiddleM style={{ width: '25%' }}>{v[2]}</RowMiddleM>
                    <RowMiddleM style={{ width: '20%' }}>{v[8]}</RowMiddleM>
                    <RowMiddleM style={{ width: '70%' }}>{element[type]}</RowMiddleM>
                    <RowMiddleM style={{ width: '20%' }}><button name={k} onClick={reqSave}>{t("metaverseTrader:run")}</button></RowMiddleM>
                </AcriveTrM>
            })}
                </tbody>
            </AssetTableM>
        }else{
            return <div>{t("metaverseTrader:no_data")}</div>
        }
    }

    const renderPcTable = () => {
        if(t3901 && t3901.Output2){
            return <AssetTable>
                <thead style={{ display: 'table', width: '100%' }}>
                    <tr className="column">
                        <th style={{ width: '15%' }}>{t("metaverseTrader:strategy")}</th>
                        <th style={{ width: '15%' }}>{t("metaverseTrader:symbol")}</th>
                        <th style={{ width: '20%' }}>{t("metaverseTrader:strategy_name")}</th>
                        <th style={{ width: '15%' }}>{t("metaverseTrader:p_l")}</th>
                        <th style={{ width: '25%' }}>{t("metaverseTrader:detail_information")}</th>
                        <th style={{ width: '10%' }}>{t("metaverseTrader:run")}</th>
                    </tr>
                </thead>
                <tbody
                    style={{
                        display: 'block',
                        overflowY: 'scroll',
                        width: '100%',
                        height: '400px',
                    }}
                >
                {t3901.Output2.filter((v, k) => form[k] !== undefined).map((v, k) => {
                const {nCommand} = form[k]
                const type = v[0].trim()

                return <AcriveTr className="row" key={k}>
                    <RowMiddle style={{ width: '15%' }}>{v[0]}: {ob[type]}</RowMiddle>
                    <RowMiddle style={{ width: '15%' }}>{v[1]}</RowMiddle>
                    <RowMiddle style={{ width: '20%' }}>{v[2]}</RowMiddle>
                    <RowMiddle style={{ width: '15%' }}>{v[8]}</RowMiddle>
                    <RowMiddle style={{ width: '25%' }}>{element[type]}</RowMiddle>
                    <RowMiddle style={{ width: '10%' }}><button name={k} onClick={reqSave}>{t("metaverseTrader:run")}</button></RowMiddle>
                </AcriveTr>
            })}
                </tbody>
            </AssetTable>
        }else{
            return <div>{t("metaverseTrader:no_data")}</div>
        }
    }
    
    if (loading) {
        return <div>{t("metaverseTrader:wait_please")}</div>;
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexFlow: 'wrap' }}>
                <div style={{ width: '100%', minWidth: '360px', marginBottom: '10px' }}>
                {isMobile ? renderMoTable() : renderPcTable()}
                </div>
            </div>
        </>
    );
};

export default index;



type ActiveProps = {
    active: boolean;
};


const ContentHead = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;

    @media (max-width: 600px) {
        // padding: 0px 16px 0px;
    }

    @media (min-width: 600px) {
        max-width: 1300px;
        // padding: 0px 50px 0px;
    }

    & > .title {
        color: #383838;
        font-weight: bold;
        font-size: 26px;
        line-height: 46px;
        color: black;
    }
`;

const ContentBody = styled.div`
    width: 100%;
    min-height: 500px;
    background-color: #fff;

    @media (max-width: 600px) {
        // padding: 10px 16px 0px;
        & .flex_div {
            margin: 0 auto;
            max-width: 1000px;
            & .sub_title {
                font-family: Noto Sans;
                font-style: normal;
                font-weight: bold;
                font-size: 18px;
                line-height: 35px;

                color: #383838;
            }
        }
    }

    @media (min-width: 600px) {
        // padding: 50px 50px 0px;
        margin: 0 auto;
        & .flex_div {
            margin: 0 auto;
            max-width: 1200px;
            & .sub_title {
                font-family: Noto Sans;
                font-style: normal;
                font-weight: bold;
                font-size: 26px;
                line-height: 35px;

                color: #383838;
            }
        }
    }
`;



const DetailInfoSpan = styled.span`
    width: calc(100% - 50px);
    display: inline-block;
    height: 100%;
    float: right;
`;

const AssetTable = styled.table`
    min-width: 500px;
    // margin: 0px auto 0px;
    width: 800px;
    overflow-x: scroll;
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
        display: flex;
        width: 100%;
        border-bottom: 1px solid #e7e7e7;
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
    color: black;
`;


const AssetTableM = styled.table`
    min-width: 300px;
    width: 100%;
    // overflow-x: scroll;
    text-align: left;
    & .column {
        // height: 30px;
        line-height: 19px;
        border-bottom: 1px solid #9a9a9a;
        font-family: Noto Sans;
        font-style: normal;
        font-weight: bold;
        font-size: 14px;
        color: #383838;
    }

    & .row {
        display: flex;
        flex-flow: wrap;
        width: 100%;
        border-bottom: 1px solid #e7e7e7;
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
    color: black;
`;



