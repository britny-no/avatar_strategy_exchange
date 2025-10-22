import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import moment from 'moment';
import 'moment-timezone';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import useScreenSize from '@/hooks/useScreenSize';
import { useTypedSelector } from '@/states/useTypedSelector';
import socketService from '@/states/socketAgent/SocketService';
import { deleteTr } from '@/states/reducers/stateReducer';
import Martingale from '@/assets/Martingale.png';
import Typhoon from '@/assets/Typhoon.png';
import TrapRepeat from '@/assets/Trap-repeat.png';
import TechBand from '@/assets/Tech-Band.png';

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
                szGubun : "1",
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
            <p className="title">{t("metaverseTrader:avatar_traders")}</p>
            <br/>
            <br/>
            <br/>
        </ContentHead>
        <ContentBody>
            <List  info={{t3901}}/>
        </ContentBody>
    </div>
    );
};



const List = ({ info }) => {
    const {t} = useTranslation()
    const dispatch = useDispatch();
    const { isMobile } = useScreenSize();
    
    const symbols = useTypedSelector((state) => state.symbolReducer.symbols);
    const t3902 = useTypedSelector((state) => state.stateReducer.t3902);
    const  { email } = useTypedSelector((state) => state.userReducer.data);

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        P_MG: { symbol: "BTCUSDT", strategy: ""},
        P_TP: { symbol: "BTCUSDT", strategy: ""},
        P_TR: { symbol: "BTCUSDT", strategy: ""},
        P_TB: { symbol: "BTCUSDT", strategy: ""},
    })
    const {P_MG, P_TP, P_TR, P_TB } = form
    const ob = [
        {
            title: t("metaverseTrader:p_mg_martingale"),
            select_value : P_MG.symbol, select_name: "P_MG@symbol",
            img: Martingale, span_detail: t("metaverseTrader:p_mg_detail"),
            row_strategy : P_MG.strategy, row_name: "P_MG@strategy",
            symbol: "P_MG"
        },
        {
            title: t("metaverseTrader:p_tp_typhoon"),
            select_value : P_TP.symbol, select_name: "P_TP@symbol",
            img: Typhoon, span_detail: t("metaverseTrader:p_tp_detail"),
            row_strategy : P_TP.strategy, row_name: "P_TP@strategy",
            symbol: "P_TP"
        },
        {
            title: t("metaverseTrader:p_tr_trap_repeat"),
            select_value : P_TR.symbol, select_name: "P_TR@symbol",
            img: TrapRepeat, span_detail:t("metaverseTrader:p_tr_detail"),
            row_strategy : P_TR.strategy, row_name: "P_TR@strategy",
            symbol: "P_TR"
        },
        {
            title:t("metaverseTrader:p_tb_tech_band"),
            select_value : P_TB.symbol, select_name: "P_TB@symbol",
            img: TechBand, span_detail: t("metaverseTrader:p_tb_detail"),
            row_strategy : P_TB.strategy, row_name: "P_TB@strategy",
            symbol: "P_TB"
        }
    ]
    

    useEffect(() => {
        if (loading && t3902) {
            const { flag, data } = t3902.Message;
            switch (flag) {
                case 'E':
                    alert(data);
                    setLoading(false);
                    break;
                case '0':
                    dispatch(deleteTr({ key: `t3902`, data: [] }))
                    setLoading(false);
                    alert(t("metaverseTrader:registration_completed"));
                    
                    break;
                default:
                    alert(data);
            }
        }
    }, [t3902, loading]);

    const reqSave = (e) => {
        const type = e.target.name
        const {strategy, symbol} = form[type]
        
        if(strategy !== ""){
            setLoading(true)
            socketService.sendToAgent({
                Header : {
                    function : "D",
                    termtype : "HTS",
                    trcode : "t3902"
                }, 
                Input1 : {
                    szStrategy : type,
                    szCurNo : symbol,
                    szStrategy_ID : strategy,
                    szUserID : `000${email}`,
                    szStrategy_YN : "0"
                }
            });
        }else{
            alert(t("metaverseTrader:enter_the_strategy"))
        }

    }

    const onChangeHandler = (e) =>{
        const { name, value} = e.target
        const k = name.split("@")

        setForm({
            ...form,
            [k[0]] : {
                ...form[k[0]],
                [k[1]] : value
            }
        })
    }

    const renderMoTable = () => {
        return <AssetTableM>
        <thead style={{ display: 'block', width: '100%' }}>
            <tr className="column" style={{ display: 'flex', width: '100%', flexFlow:"wrap" }}>
                <th style={{ width: '45%' }}>{t("metaverseTrader:strategy")}</th>
                <th style={{ width: '45%' }}>{t("metaverseTrader:symbol")}</th>
                <th style={{ width: '80%' }}>{t("metaverseTrader:detail_information")}</th>
                <th style={{ width: '45%' }}>{t("metaverseTrader:strategy_name")}</th>
                <th style={{ width: '45%' }}>{t("metaverseTrader:set")}</th>
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
        {ob.map((v, k) => {
        const { title, select_value, select_name, img, span_detail, row_strategy, row_name, symbol} = v
        return <AcriveTrM className="row" key={k} >
            <RowMiddleM style={{ width: '45%' }}>{title}</RowMiddleM>
            <RowMiddleM style={{ width: '45%' }}>
                <select value={select_value} onChange={onChangeHandler} name={select_name}>
                    <OptionCom symbols={symbols}/>
                </select>
            </RowMiddleM>
            <RowMiddleM style={{ width: '80%' }}>
                <img src={img} style={{ width: '50px', height: "98%" }} />
                <DetailInfoSpanM>{span_detail}</DetailInfoSpanM>
            </RowMiddleM>
            <RowMiddleM style={{ width: '45%' }}><StrategyName value={row_strategy} onChange={onChangeHandler} name={row_name}></StrategyName></RowMiddleM>
            <RowMiddleM style={{ width: '45%' }}><button name={symbol} onClick={reqSave}>Save</button></RowMiddleM>
        </AcriveTrM>
        })}
        </tbody>
    </AssetTableM>
    }
    const renderPcTable = () => {
        return                     <AssetTable>
        <thead style={{ display: 'table', width: '100%' }}>
            <tr className="column">
                <th style={{ width: '15%' }}>{t("metaverseTrader:strategy")}</th>
                <th style={{ width: '15%' }}>{t("metaverseTrader:symbol")}</th>
                <th style={{ width: '40%' }}>{t("metaverseTrader:detail_information")}</th>
                <th style={{ width: '15%' }}>{t("metaverseTrader:strategy_name")}</th>
                <th style={{ width: '15%' }}>{t("metaverseTrader:set")}</th>
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
        {ob.map((v, k) => {
        const { title, select_value, select_name, img, span_detail, row_strategy, row_name, symbol} = v
        return <AcriveTr className="row" key={k}>
            <RowMiddle style={{ width: '15%' }}>{title}</RowMiddle>
            <RowMiddle style={{ width: '15%' }}>
                <select value={select_value} onChange={onChangeHandler} name={select_name}>
                    <OptionCom symbols={symbols}/>
                </select>
            </RowMiddle>
            <RowMiddle style={{ width: '40%' }}>
                <img src={img} style={{ width: '50px', height: "98%" }} />
                <DetailInfoSpan>{span_detail}</DetailInfoSpan>
            </RowMiddle>
            <RowMiddle style={{ width: '15%' }}><StrategyName value={row_strategy} onChange={onChangeHandler} name={row_name}></StrategyName></RowMiddle>
            <RowMiddle style={{ width: '15%' }}><button name={symbol} onClick={reqSave}>{t("metaverseTrader:save")}</button></RowMiddle>
        </AcriveTr>
        })}
        </tbody>
    </AssetTable>
    }

    
    if (loading) {
        return <div>{t("metaverseTrader:wait_please")}</div>;
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexFlow: 'wrap' }}>
                <div style={{  width: '100%', minWidth: '360px', marginBottom: '10px' }}>
                    {isMobile ? renderMoTable() : renderPcTable() }
                </div>
            </div>
        </>
    );
};


export default index;

const OptionComponent = ({symbols}) => {
    const key = Object.keys(symbols)

    if(key[0]){
        return <>
        {key.map((v, k) => {
            return  <option key={k} value={v}>{v}</option>
        })}
    </>
    }else{
        return <option>no value</option>
    }
}
const OptionCom = React.memo(OptionComponent)


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
    min-height: 800px;
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

const StrategyName = styled.input`
    width: 90%
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

const DetailInfoSpanM = styled.span`
    width: calc(100% - 50px);
    display: inline-block;
    height: 100%;
    float: right;
    line-height: 20px;
`;
const AssetTableM = styled.table`
    min-width: 300px;
    // width: 800px;
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

