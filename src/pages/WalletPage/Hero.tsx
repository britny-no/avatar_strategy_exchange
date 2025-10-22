import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Dropdown from 'react-dropdown';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import Calendar from 'react-calendar';
import 'moment-timezone';
import { useTranslation } from 'react-i18next';

import useUsersData from '@/hooks/useUserData';
import socketService from '@/states/socketAgent/SocketService';
import { useTypedSelector } from '@/states/useTypedSelector';

import MyAsset from './MyAsset';
import History from './History';
import Convert from './Convert';
import Transfer from './Transfer';
import DepositWithdraw from './DepositWithdraw';

import './css/DropDown.css';
import WALLET_HERO_BACKGROUND from '@/assets/wallet/bg@2x.png';

import { dotTwo } from './component/Script';
import { BTCSYMBOL, ETHSYMBOL, USDTSYMBOL, DOGESYMBOL, XRPSYMBOL } from './component/Symbol';


export const returnSymbol = (coin: string) => {
    switch (String(coin).trim()) {
        case 'BTC':
            return <BTCSYMBOL />;
        case 'ETH':
            return <ETHSYMBOL />;
        case 'USDT':
            return <USDTSYMBOL />;
        case 'XRP':
            return <XRPSYMBOL />;
        case 'DOGE':
            return <DOGESYMBOL />;

        default:
            break;
    }
};

// 푸쉬전 수정 사항
// SocketService 48, 65, 68, 87 주석
const Hero = () => {
    const {t} = useTranslation()
    const location = useLocation();
    const { isLoggedIn, email } = useUsersData();

    if (!location.state) {
        window.location.href = '/';
        return null;
    } else if (!location.state.szAccNo || !isLoggedIn) {
        alert(t("wallet:please_login"));
        window.location.href = '/mobile/signin';
        return null;
    }

    const { sub_path, szAccNo, locationCoin, depositWithdraw } = location.state;


    const t372C = useTypedSelector((state) => state.stateReducer.t372C);
    const t3608 = useTypedSelector((state) => state.stateReducer.t3608);
    const t0101 = useTypedSelector((state) => state.stateReducer.t0101);

    const [coinOb, setCoinOb] = useState({});
    const [unrealizedProfit, setUnrealizedProfit] = useState(0);
    const [selectedSymbol, setSelectedSymbol] = useState(locationCoin || 'BTC');
    const [symbolOption, setSymbolOption] = useState<Array<string>>(['BTC', 'ETH', 'USDT', 'XRP']);
    const [calendarStatus, setCalenderStatus] = useState(false);
    const [calendarFlag, setCalendarFlag] = useState('');
    const [fromDateValue, setFromDateValue] = useState(moment().add('-30', 'd').toDate());
    const [toDateValue, setToDateValue] = useState(moment().toDate());


    useEffect(() => {
        socketService.sendToAgent({
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't372C',
            },
            Input1: {
                szAccNo: szAccNo,
            },
        });

        if (!t3608) {
            socketService.sendToAgent({
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't3608',
                },
                Input1: {
                    szAccNo: szAccNo,
                },
            });
        }

        if (!t0101) {
            socketService.sendToAgent({
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't0101',
                },
                Input1: {
                    szMemberNo: '000',
                },
            });
        }
        // 다른 component에서 t9732 호출해서 여기서는 호출 안함
    }, []);

    useEffect(() => {
        const selected_from_day = moment(fromDateValue).format('YYYYMMDD');
        const business_day = t0101 ? String(t0101.Output1.nCurBusiDate) : moment(toDateValue).format('YYYYMMDD');
        const symbolOb = {
            'BTC' : 1,
            'ETH' : 2,
            'USDT' : 3,
            'XRP' : 4,
        }
        

        socketService.sendToAgent({
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't3626',
                trid: symbolOb[selectedSymbol]
            },
            Input1: {
                accno: szAccNo,
                cur_no: selectedSymbol,
                po_code: '',
                from_dt: selected_from_day,
                to_dt: business_day,
            },
        });

        socketService.sendToAgent({
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't2500',
            },
            Input1: {
                szAccNo: szAccNo, //szAccNo,
                nFromDate: selected_from_day,
                nToDate: business_day,
            },
        });

        socketService.sendToAgent({
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't3616',
                trid: symbolOb[selectedSymbol]
            },
            Input1: {
                accno: szAccNo, //szAccNo,
                cur_no: selectedSymbol,
                from_dt: selected_from_day,
                to_dt: business_day,
                treat_stat: '',
            },
        });

        socketService.sendToAgent({
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't3625',
                trid: symbolOb[selectedSymbol]
            },
            Input1: {
                accno: szAccNo, //szAccNo,
                cur_no: selectedSymbol,
                po_code: '',
                from_dt: selected_from_day,
                to_dt: business_day,
            },
        });

        socketService.sendToAgent({
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't3621',
            },
            Input1: {
                accno: szAccNo,
                cur_no: selectedSymbol,
            },
        });
    }, [selectedSymbol, fromDateValue, toDateValue]);

    useEffect(() => {
        let coin_ob = {
            BTC: [[0, 0, 0]],
            ETH: [[0, 0, 0]],
            USDT: [[0, 0, 0]],
            XRP: [[0, 0, 0]],
        };
        if (t372C && t372C.Output2) {
            const symbol_option: Array<string> = [];

            t372C.Output2.forEach((v) => {
                const coin_symbol = String(v[1]).trim();
                v[1] = coin_symbol;
                symbol_option.push(coin_symbol);

                coin_ob = {
                    ...coin_ob,
                    [coin_symbol]: [v],
                };
            });

            // setSelectedSymbol(t372C.Output2[0][1]);
            setCoinOb(coin_ob);
        } else {
            setCoinOb(coin_ob);
        }
    }, [t372C]);

    // useEffect(() => {
    //     if (locationCoin) {
    //         setSelectedSymbol(locationCoin);
    //     }
    // }, [locationCoin]);

    useEffect(() => {
        if (t3608) {
            setUnrealizedProfit(dotTwo(t3608.Output2[0][6]));
        }
    }, [t3608]);
    const BodySwitch = () => {
        switch (sub_path) {
            case '/asset':
                return <MyAsset coinOb={coinOb} szAccNo={szAccNo}  selectedSymbol={selectedSymbol} />;
            case '/history':
                return <History coinOb={coinOb} szAccNo={szAccNo} selectedSymbol={selectedSymbol} />;
            case '/convert':
                return (
                    <Convert
                        coinOb={coinOb}
                        szAccNo={szAccNo}
                        selectedSymbol={selectedSymbol}
                        setSelectedSymbol={setSelectedSymbol}
                    />
                );
            case '/transfer':
                return <Transfer coinOb={coinOb} />;
            case '/deposit_withdraw':
                return (
                    <DepositWithdraw
                        coinOb={coinOb}
                        szAccNo={szAccNo}
                        selectedSymbol={selectedSymbol}
                        depositWithdraw={depositWithdraw}
                    />
                );

            default:
                break;
        }
    };

    if (!t372C || !t3608) {
        return <div>{t("wallet:wait_please")}</div>;
    }

    // const [fromDateValue, setFromDateValue] = useState(new Date());
    // const [toDateValue, setToDateValue] = useState(new Date());

    const openCalendar = (e, flag) => {
        setCalenderStatus(true);
        setCalendarFlag(flag);
    };
    const datePicker = (e) => {
        calendarFlag === 'from' ? setFromDateValue(e) : setToDateValue(e);
        setCalenderStatus(false);
    };

    if(locationCoin){
        setSelectedSymbol(locationCoin)
        location.state.locationCoin = undefined
    }
    return (
        <HeroWrap>
            <div className="background">
                <img src={WALLET_HERO_BACKGROUND} alt="background" />
            </div>
            <ContentHead>
                <p className="title">{t("wallet:my_wallet")}</p>
                <WalletInfoDiv>
                    <div className="flex_div" id="hero">
                        <div className="flex_div_child_text">
                            <span className="wallet_info_title">{t("wallet:my_asset")}</span>
                            <span className="wallet_info_content">
                                {coinOb[selectedSymbol] ? coinOb[selectedSymbol][0][2] : 0}{' '}
                                <span className="wallet_info_coin_unit">{selectedSymbol}</span>
                            </span>
                        </div>
                        <div className="flex_div_child_text">
                            <span className="wallet_info_title">{t("wallet:unrealized_profit_less")}</span>
                            <span className="wallet_info_content">
                                {unrealizedProfit} <span className="wallet_info_coin_unit">USDT</span>
                            </span>
                        </div>
                        <div className="flex_div_child_button_1">
                            <span className="wallet_coin_symbol">{returnSymbol(selectedSymbol)}</span>
                            <Dropdown
                                options={symbolOption}
                                value={selectedSymbol}
                                placeholder="Select an option"
                                onChange={(e) => {
                                    setSelectedSymbol(e.value);
                                    location.state.locationCoin = undefined
                                }}
                            />
                        </div>
                        <div className="flex_div_child_button_1">
                            {calendarStatus ? (
                                <div style={{ position: 'absolute' }}>
                                    <Calendar
                                        locale="en-US"
                                        formatDay={(locale, date) => moment(date).format('DD')}
                                        value={calendarFlag === 'from' ? fromDateValue : toDateValue}
                                        onChange={datePicker}
                                    />
                                </div>
                            ) : null}
                            <div className="date_picker_root_div">
                                <div className="date_picker_div" onClick={(e) => openCalendar(e, 'from')}>
                                    <span className="date">{t("wallet:from")}</span>
                                    <br />
                                    <span>
                                        {moment(fromDateValue).format('YYYY-MM-DD')}
                                        <span> </span>
                                    </span>
                                </div>
                                <div className="date_picker_div" onClick={(e) => openCalendar(e, 'to')}>
                                    <span className="date">{t("wallet:to")}</span>
                                    <br />
                                    <span>{moment(toDateValue).format('YYYY-MM-DD')}</span>
                                    <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            version="1.1"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="white"
                                        >
                                            <title>calendar</title>
                                            <path d="M22.125 4.5h-4.125v-2.625h-1.5v2.625h-9v-2.625h-1.5v2.625h-4.125c-0.621 0.001-1.124 0.504-1.125 1.125v15.75c0.001 0.621 0.504 1.124 1.125 1.125h20.25c0.621-0.001 1.124-0.504 1.125-1.125v-15.75c-0.001-0.621-0.504-1.124-1.125-1.125h-0zM21.75 21h-19.5v-15h3.75v1.875h1.5v-1.875h9v1.875h1.5v-1.875h3.75z" />
                                            <path d="M5.25 10.5h1.5v1.5h-1.5v-1.5z" />
                                            <path d="M9.375 10.5h1.5v1.5h-1.5v-1.5z" />
                                            <path d="M13.125 10.5h1.5v1.5h-1.5v-1.5z" />
                                            <path d="M17.25 10.5h1.5v1.5h-1.5v-1.5z" />
                                            <path d="M5.25 13.875h1.5v1.5h-1.5v-1.5z" />
                                            <path d="M9.375 13.875h1.5v1.5h-1.5v-1.5z" />
                                            <path d="M13.125 13.875h1.5v1.5h-1.5v-1.5z" />
                                            <path d="M17.25 13.875h1.5v1.5h-1.5v-1.5z" />
                                            <path d="M5.25 17.25h1.5v1.5h-1.5v-1.5z" />
                                            <path d="M9.375 17.25h1.5v1.5h-1.5v-1.5z" />
                                            <path d="M13.125 17.25h1.5v1.5h-1.5v-1.5z" />
                                            <path d="M17.25 17.25h1.5v1.5h-1.5v-1.5z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex_div_child_button_2">
                            <InqueryButton className="wallet_info_button">{t("wallet:inquery")}</InqueryButton>
                        </div>
                    </div>
                </WalletInfoDiv>
            </ContentHead>
            <ContentBody>{BodySwitch()}</ContentBody>
        </HeroWrap>
    );
};

export default Hero;

const HeroWrap = styled.div`
    position: relative;
    width: 100%;
    padding: 98px 0 40px;
    .background {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -1;
        top: 0;
        left: 0;
        > img {
            height: 100%;
        }
    }
`;

const ContentHead = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;

    @media (max-width: 600px) {
        padding: 0px 16px 0px;
    }

    @media (min-width: 600px) {
        max-width: 1300px;
        padding: 70px 50px 0px;
    }

    & > .title {
        margin-bottom: 30px;
        font-weight: bold;
        font-size: 34px;
        line-height: 46px;
        color: #ffffff;
    }
`;
const WalletInfoDiv = styled.div`
    @media (max-width: 500px) {
        margin-bottom: 16px;
        height: 360px;
        & .flex_div_child_button_1 {
            display: flex;
            justify-content: end;
            margin: 10px 10px 0px 10px;
            // width: 50%;
            height: 40px;
            // min-width: 320px;
            flex-flow: wrap;
            justify-content: left;
            & .wallet_coin_symbol {
                margin: auto 0;
            }
        }
    }

    @media (max-width: 900px) {
        margin-bottom: 16px;
        & .flex_div_child_button_1 {
            display: flex;
            justify-content: end;
            margin: 10px 10px 0px 10px;
            // width: 50%;
            height: 40px;
            // min-width: 320px;
            flex-flow: wrap;
            justify-content: left;
            & .wallet_coin_symbol {
                margin: auto 0;
            }
        }
    }

    @media (min-width: 900px) {
        margin-bottom: 24px;
        height: 180px;
        & .flex_div_child_button_1 {
            display: flex;
            justify-content: end;
            margin: 10px 10px 0px 10px;
            // width: 50%;
            height: 80px;
            // min-width: 320px;
            flex-flow: wrap;
            justify-content: left;
            & .wallet_coin_symbol {
                margin: auto 0;
            }
        }
    }
    & .flex_div_child_button_2 {
        display: flex;
        justify-content: end;
        margin: 10px 10px 0px 10px;
        // width: 50%;
        height: 80px;
        // min-width: 320px;
        flex-flow: wrap;
        justify-content: left;
        & .wallet_coin_symbol {
            margin: auto 0;
        }
    }

    width: 100%;
    background: rgba(255, 255, 255, 0.22);
    border-radius: 4px;
    & .flex_div {
        display: flex;
        align-content: center;
        margin: 10px;
        padding: 10px;
        height: 100%;
        flex-flow: wrap;
        & .flex_div_child_text {
            margin: 10px 10px 0px 10px;
            width: 20%;
            height: 70px;
            min-width: 190px;
            display: flex;
            flex-direction: column;
            & .wallet_info_title {
                color: #ffab2e;
            }

            & .wallet_info_content {
                display: inline-block;
                margin-top: 13px;
                color: #ffffff;
                font-family: Lato;
                font-style: normal;
                font-weight: bold;
                font-size: 24px;
                line-height: 29px;
            }

            & .wallet_info_coin_unit {
                font-family: Noto Sans;
                font-style: normal;
                font-weight: 500;
                font-size: 16px;
                line-height: 22px;
                color: #cacaca;
            }
        }

        & .date_picker_root_div {
            display: flex;
            margin-right: 12px;
        }
        & .date_picker_div {
            height: 52px;
            margin: auto;
            color: white;
            border-bottom: 0.2px solid white;
            padding: 2px 2px 0px 2px;
            line-height: 22px;
            cursor: pointer;

            & .date {
                font-size: 12px;
            }
        }
    }
`;

const InqueryButton = styled.button`
    @media (max-width: 900px) {
        width: 100px;
        height: 30px;
        margin: 24px auto auto 4px;
    }

    @media (min-width: 900px) {
        width: 130px;
        height: 50px;
        padding: 12px 33px;
        margin: auto 10px;
    }

    background-color: transparent;
    cursor: pointer;
    color: #ffffff;
    border: 1px solid #ffffff;
    box-sizing: border-box;
    border-radius: 4px;
    font-family: Noto Sans;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 25px;
`;

const ContentBody = styled.div`
    width: 100%;
    min-height: 500px;
    background-color: #fff;

    @media (max-width: 600px) {
        padding: 10px 16px 0px;
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
        padding: 50px 70px 0px;
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
