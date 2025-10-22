import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import Dropdown from 'react-dropdown';
import moment from 'moment';
import Swal from 'sweetalert2';
import 'moment-timezone';

import socketService from '@/states/socketAgent/SocketService';
import { useTypedSelector } from '@/states/useTypedSelector';
import { updateTrId, dotTwo, dotFour } from './component/Script';


type ActiveProps = {
    $active: boolean;
};

export const reloadAsset = (szAccNo: string, selectedSymbol: string) => {
    // 잔고 갱신
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

    socketService.sendToAgent({
        Header: {
            function: 'D',
            termtype: 'HTS',
            trcode: 't2500',
        },
        Input1: {
            szAccNo: szAccNo, //szAccNo,
            nFromDate: moment(moment().add('-30', 'd').toDate()).format('YYYYMMDD'),
            nToDate: moment().format('YYYYMMDD'),
        },
    });
};

const Convert = ({ coinOb, szAccNo, selectedSymbol, setSelectedSymbol }) => {
    const {t} = useTranslation()
    const option = ['BTC', 'ETH', 'USDT', 'XRP'];

    const t0101 = useTypedSelector((state) => state.stateReducer.t0101);
    const t3621 = useTypedSelector((state) => state.stateReducer.t3621);
    const t3608 = useTypedSelector((state) => state.stateReducer.t3608);
    const rate = useTypedSelector((state) => state.stateReducer[`t9731_${selectedSymbol}`]);

    // const [unrealizedProfit, setUnrealizedProfit] = useState(0);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('Spot');
    const [selectedNav, setSelectedNav] = useState('history');

    useEffect(() => {
        const trid = {
            BTC: 1,
            ETH: 2,
            USDT: 3,
            XRP: 4,
        };

        socketService.sendToAgent({
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't9731',
                trid: trid[selectedSymbol],
            },
            Input1: {
                szCurNo: `BIN_${selectedSymbol}USDT`,
                cTermDiv: '3',
                szCritDate: '99999999',
                szCritTime: '999999999',
                nMinTerm: '1',
                nReqCnt: '2000',
            },
        });
    }, [selectedSymbol]);

    useEffect(() => {
        if (t3621) {
            setLoading(false);
            if(t3621.Message.flag === 'E'){
                alert(t3621.Message.data)
            }
        } else {
            setLoading(true);
        }
    }, [t3621]);

    if (loading || (selectedSymbol !== 'USDT' && (!rate || !rate[0]))) {
        return <tr><td>{t("wallet:wait_please")}</td></tr>;
    }

    // coin_amount이 previous balance에 들어가는게 맞지만,Available amount은 대기 수량 제외되야함
    // current값은 previous - expacted값
    const coin_rate = selectedSymbol === 'XRP' ? dotFour(rate ? rate[0][4] : 1) : dotTwo(rate ? rate[0][4] : 1);
    const coin_amount = coinOb[selectedSymbol] ? coinOb[selectedSymbol][0][2] : 0;
    const usdt_amount = t3608.Output2[0][6]; // coinOb['USDT'] ? coinOb['USDT'][0][2] : 0
    const info_ob = {
        szAccNo,
        usdt_amount,
        coin_rate,
    };

    // useEffect(() => {
    //     if (t3608) {
    //         setCoinAmount(dotTwo(t3608.Output2[0][6]));
    //     }
    // }, [t3608]);

    return (
        <>
            <div className="flex_div">
                <span className="sub_title">{t("wallet:convert_title_1")} {type} {t("wallet:convert_title_2")}</span>
            </div>
            <br />
            <Content>
                <div style={{ borderBottom: '1px solid #E1E1E1', paddingBottom: '20px' }}>
                    <NavButton>
                        <NavDeposit $active={type === 'Spot'} onClick={() => setType('Spot')}>
                        {t("wallet:spot")}
                        </NavDeposit>
                        <NavDeposit $active={type !== 'Spot'} onClick={() => setType('Future')}>
                        {t("wallet:future")}
                        </NavDeposit>
                    </NavButton>
                    <FormItem id="convert">
                        <BoldTitle>{t("wallet:coin")}</BoldTitle>
                        <br />
                        <Dropdown
                            options={option}
                            placeholder={t("wallet:select_coin")}
                            value={selectedSymbol}
                            onChange={(e) => setSelectedSymbol(e.value)}
                        />
                        <br />
                        <div>
                            <SmallDiv className="first">
                                <span className="sub_title">{t("wallet:exchange_rate")}</span>
                                <span className="sub_title_value" style={{ color: '#F8585A' }}>
                                    {coin_rate}
                                </span>
                                <br />
                                <span className="sub_title">{t("wallet:available_amount")}</span>
                                <span className="sub_title_value">{dotTwo(t3621 && t3621.Output1? t3621.Output1.avail_trf : 0)}</span>
                            </SmallDiv>
                            <SmallDiv>
                                <span className="sub_title">{selectedSymbol}: {t("wallet:previous_balance")}</span>
                                <span className="sub_title_value">{coin_amount}</span>
                                <br />
                                <span className="sub_title">USDT: {t("wallet:previous_balance")}</span>
                                <span className="sub_title_value">{usdt_amount}</span>
                            </SmallDiv>
                        </div>
                        <br />
                        {type === 'Spot' ? (
                            <SpotForm selectedSymbol={selectedSymbol} coinOb={coinOb} info_ob={info_ob} />
                        ) : (
                            <FutureForm selectedSymbol={selectedSymbol} coinOb={coinOb} info_ob={info_ob} />
                        )}
                    </FormItem>
                </div>
                <NavButton>
                    <NavDeposit $active={selectedNav === 'history'} onClick={() => setSelectedNav('history')}>
                    {t("wallet:exchange_history")}
                    </NavDeposit>
                    <NavDeposit $active={selectedNav !== 'history'} onClick={() => setSelectedNav('rates')}>
                    {t("wallet:daily_rates")}
                    </NavDeposit>
                </NavButton>
                {selectedNav === 'history' ? <ExchangeHistory selectedSymbol={selectedSymbol} /> : <DailyRates />}
            </Content>
        </>
    );
};

const ExchangeHistory = ({ selectedSymbol }) => {
    const {t} = useTranslation()
    const t2500 = useTypedSelector((state) => state.stateReducer.t2500);
    const t3626 = useTypedSelector((state) => state.stateReducer[`t3626_${selectedSymbol}`]);
    // const t3615 = useTypedSelector((state) => state.stateReducer.t3615);

    const RenderRowPcLeft = () => {
        let key = 0;

        if (!t2500) {
            return <tr><td>{t("wallet:wait_please")}</td></tr>;
        } else if (!t2500.Output2) {
            return (
                <tr><td>{t("wallet:no_data")}</td></tr>
            );
        }
        const AccountCodeOb = {
            '001': t("wallet:deposit"),
            '098': t("wallet:wait_please"),
            '120': t("wallet:deposit"),
            '002': t("wallet:withdraw"),
            '125': t("wallet:convert_withdraw"),
            '106': t("wallet:commission"),
            '107': t("wallet:open_commission"),
            '108': t("wallet:close_commission"),
            '061': t("wallet:profit"),
            '062': t("wallet:loss"),
        };
        return t2500.Output2.map((v) => {
            key += 1;

            return (
                <tr className="row" key={key}>
                    <RowMiddle style={{ width: '20%' }}>{v[0]}</RowMiddle>
                    <RowMiddle style={{ width: '25%' }}>{AccountCodeOb[v[2]]}</RowMiddle>
                    <RowMiddle style={{ width: '25%' }}>{v[3]}</RowMiddle>
                    <RowMiddle style={{ width: '30%' }}>{v[4]}</RowMiddle>
                </tr>
            );
        });
    };

    const RenderRowPcRight = () => {
        let key = 0;

        if (!t3626) {
            return (
                <tr>
                    <td>
                        {t("wallet:wait_please")}
                    </td>
                </tr>
            );
        } else if (!t3626[0]) {
            return (
                <tr><td>{t("wallet:no_data")}</td></tr>
            );
        }

        return t3626.map((v) => {
            key += 1;
            return (
                <tr className="row" key={key}>
                    <RowMiddle style={{ width: '10%' }}>{v[1]}</RowMiddle>
                    <RowMiddle style={{ width: '10%' }}>{v[2] === '079' ? t("wallet:in") : t("wallet:out")}</RowMiddle>
                    <RowMiddle style={{ width: '10%' }}>{v[5]}</RowMiddle>
                    <RowMiddle style={{ width: '25%' }}>{v[4]}</RowMiddle>
                    <RowMiddle style={{ width: '25%' }}>{v[6]}</RowMiddle>
                </tr>
            );
        });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', flexFlow: 'wrap' }}>
            <div style={{ overflowX: 'scroll', width: '49%', minWidth: '360px', marginBottom: '10px' }}>
                <AssetTable>
                    <thead style={{ display: 'table', width: '100%' }}>
                        <tr className="column">
                            <th style={{ width: '20%' }}>{t("wallet:no")}</th>
                            <th style={{ width: '25%' }}>{t("wallet:accounting_code")}</th>
                            <th style={{ width: '25%' }}>{t("wallet:point")}</th>
                            <th style={{ width: '30%' }}>{t("wallet:accounting_code")}</th>
                        </tr>
                    </thead>
                    <tbody style={{ display: 'block', overflowY: 'scroll', width: '100%', height: '400px' }}>
                        {RenderRowPcLeft()}
                    </tbody>
                </AssetTable>
            </div>
            <div style={{ overflowX: 'scroll', width: '49%', minWidth: '360px', marginBottom: '10px' }}>
                <AssetTable>
                    <thead style={{ display: 'table', width: '100%' }}>
                        <tr className="column">
                            <th style={{ width: '10%' }}>{t("wallet:currency")}</th>
                            <th style={{ width: '10%' }}>{t("wallet:code")}</th>
                            <th style={{ width: '10%' }}>{t("wallet:rates")}</th>
                            <th style={{ width: '25%' }}>{t("wallet:crypto_amt")}</th>
                            <th style={{ width: '25%' }}>{t("wallet:date_time")}</th>
                        </tr>
                    </thead>
                    <tbody style={{ display: 'block', overflowY: 'scroll', width: '100%', height: '400px' }}>
                        {RenderRowPcRight()}
                    </tbody>
                </AssetTable>
            </div>
        </div>
    );
};

const DailyRates = () => {
    const {t} = useTranslation()
    const t9731_convert = useTypedSelector((state) => state.stateReducer['t9731_convert']);

    const RenderRowPcLeft = () => {
        let key = 0;

        if (!t9731_convert) {
            return <tr><td>{t("wallet:wait_please")}</td></tr>;
        }

        return t9731_convert.map((v) => {
            key += 1;
            return (
                <tr className="row" key={key}>
                    <RowMiddle style={{ width: '20%' }}>{moment(Number(v[0])).format('YYYY MM DD HH:mm:ss')}</RowMiddle>
                    <RowMiddle style={{ width: '25%' }}>{v[4] * (1 + 0.0003)}</RowMiddle>
                    <RowMiddle style={{ width: '25%' }}>{v[4] * (1 - 0.0003)}</RowMiddle>
                    <RowMiddle style={{ width: '30%' }}>{v[4]}</RowMiddle>
                </tr>
            );
        });
    };

    return (
        <div style={{ overflowX: 'scroll', width: '100%' }}>
            <AssetTable>
                <thead style={{ display: 'table', width: '100%' }}>
                    <tr className="column">
                        <th style={{ width: '20%' }}>{t("wallet:time")}</th>
                        <th style={{ width: '25%' }}>{t("wallet:buy")}</th>
                        <th style={{ width: '25%' }}>{t("wallet:sell")}</th>
                        <th style={{ width: '30%' }}>{t("wallet:exchange_rate")}</th>
                    </tr>
                </thead>
                <tbody style={{ display: 'block', overflowY: 'scroll', width: '100%', height: '400px' }}>
                    {RenderRowPcLeft()}
                </tbody>
            </AssetTable>
        </div>
    );
};

const SpotForm = ({ selectedSymbol, coinOb, info_ob }) => {
    const {t} = useTranslation()
    const { coin_rate, szAccNo, usdt_amount } = info_ob;
    const coin_amount = coinOb[selectedSymbol] ? coinOb[selectedSymbol][0][2] : 0;

    const [pw, setPw] = useState('');
    const [req_amount, setReqAmount] = useState<number>(0);
    const [currentTrid, setTrid] = useState('-1');
    const [loading, setLoading] = useState(false);

    const t365C = useTypedSelector((state) => state.stateReducer[`t365C_${currentTrid}`]);
    const t221C = useTypedSelector((state) => state.stateReducer[`t221C_${currentTrid}`]);

    const reqT221C = async () => {
        const { value: password } = await Swal.fire({
            title: t("wallet:enter_your_password"),
            // input: t("wallet:password"),
            inputLabel: t("wallet:password"),
            inputPlaceholder: t("wallet:enter_your_password"),
        });

        const filter = [password !== null, Number(req_amount) !== 0];
        const err_index = filter.indexOf(false);
        if (err_index === -1) {
            const trid = updateTrId();
            const info = {
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't221C',
                    trid,
                },
                Input1: {
                    nDate: moment().format('YYYYMMDD'),
                    szAccNo: szAccNo,
                    szPasswd: password,
                    szPNCode: '526',
                    szPOCode: '002',
                    fCashOutM: req_amount,
                    szRACode: '0011',
                    szOutputCur: '00',
                    fMoney: '',
                    szMemo: '',
                    szStaffID: '',
                    szStaffPwd: '',
                },
            };
            setPw(password || '');
            setTrid(trid);
            setLoading(true);
            socketService.sendToAgent(info);
        } else {
            switch (err_index) {
                case 0:
                    break;
                case 1:
                    alert(t("wallet:check_amount"));
                    break;
                default:
                    alert(t("wallet:please_contact_the_admin"));
            }
        }
    };

    const reqT365C = (usdt: number) => {
        const trid = updateTrId();
        const info = {
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't365C',
                trid,
            },
            Input1: {
                szAccNo: szAccNo,
                szPasswd: pw,
                szCurNo: selectedSymbol,
                fOrderSu: usdt / coin_rate,
                fPrice: coin_rate,
                fExePrice: coin_rate,
                szOrdType: 'EOM',
                nRange: '0',
                nAlivingTerm: '0',
                szDealDiv: '079',
                fNxOpenRate: '',
                szOrgCustItem: '',
                szNotMemberAccNo: '',
                szStaffID: '',
                szStaffPW: '',
                cIsStaff: '0',
                szAcceptTime: moment().format('YYYYMMDDhhmmss'),
                szOrderID: '',
                szEXPosID: '',
                txid: '',
            },
        };
        setTrid(trid);
        setLoading(true);
        socketService.sendToAgent(info);
    };

    //t221C응답 처리. initializatioin issue로 reqT365C아래에 뒀습니다
    useEffect(() => {
        if (loading && t221C) {
            const { flag, data } = t221C.Message;
            switch (flag) {
                case 'E':
                    alert(data);
                    setTrid('-1');
                    setLoading(false);
                    break;
                case '0':
                    reqT365C(t221C.Output1.fCachOutM);
                    break;
                default:
                    alert(data);
            }
        }
    }, [t221C, loading]);

    useEffect(() => {
        if (loading && t365C) {
            const { flag, data } = t365C.Message;
            switch (flag) {
                case 'E':
                    alert(data);
                    setTrid('-1');
                    setLoading(false);
                    break;
                case '0':
                    alert(data);
                    // 잔고 갱신
                    reloadAsset(szAccNo, selectedSymbol);
                    setLoading(false);
                    setReqAmount(0);
                    break;
                default:
                    alert(data);
            }
        }
    }, [t365C, loading]);

    if (loading) {
        return <tr><td>{t("wallet:wait_please")}</td></tr>;
    }

    const onChangeAmount = (e) => {
        const { name, value } = e.target;
        const NumValue = Number(value);
        if (value !== '' && NumValue !== 0 && !NumValue) {
            alert(t("wallet:only_number"));
        } else {
            setReqAmount(value);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', flexFlow: 'wrap' }}>
                <InputDiv>
                    <div className="row">
                        <InputBoxDiv>
                            <BoldTitle>{t("wallet:exchange_request_amount")}(USDT)</BoldTitle>
                            <br />
                            <InputBox onChange={onChangeAmount} value={req_amount} />
                        </InputBoxDiv>

                        <InputBoxDiv>
                            <BoldTitle>{t("wallet:expected")} {selectedSymbol}</BoldTitle>
                            <br />
                            <InputBox value={req_amount / coin_rate} disabled />
                        </InputBoxDiv>
                    </div>
                    <div className="row">
                        <InputBoxDiv>
                            <BoldTitle>USDT: {t("wallet:current_balance")}</BoldTitle>
                            <br />
                            <InputBox value={usdt_amount} disabled />
                            {/* usdt_amount - req_amount  */}
                        </InputBoxDiv>

                        <InputBoxDiv>
                            <BoldTitle>{selectedSymbol}: {t("wallet:current_balance")}</BoldTitle>
                            <br />
                            <InputBox value={coin_amount} disabled />
                            {/* coin_amount - (req_amount/coin_rate) */}
                        </InputBoxDiv>
                    </div>
                </InputDiv>
                <GrayPost>
                    <span className="post_title">{t("wallet:exchange_information")}</span>
                    <br />
                    <p className="post_text">
                    {t("wallet:exchange_information_contents_1")}
                        <br />
                        {t("wallet:exchange_information_contents_2")}
                        <br />
                        {t("wallet:exchange_information_contents_3")}
                    </p>
                </GrayPost>
            </div>
            <RequestButton onClick={reqT221C}>
                {/* reqT221C */}
                {t("wallet:request")}
            </RequestButton>
        </>
    );
};

const FutureForm = ({ selectedSymbol, coinOb, info_ob }) => {
    const {t} = useTranslation()
    const { coin_rate, szAccNo, usdt_amount } = info_ob;
    const coin_amount = coinOb[selectedSymbol] ? coinOb[selectedSymbol][0][2] : 0;

    const [pw, setPw] = useState('');
    const [req_amount, setReqAmount] = useState(0);
    const [currentTrid, setTrid] = useState('-1');
    const [loading, setLoading] = useState(false);

    const t365C = useTypedSelector((state) => state.stateReducer[`t365C_${currentTrid}`]);
    const t211C = useTypedSelector((state) => state.stateReducer[`t211C_${currentTrid}`]);

    const reqT365C = async () => {
        const { value: password } = await Swal.fire({
            title: t("wallet:enter_your_password"),
            // input: t("wallet:password"),
            inputLabel: t("wallet:password"),
            inputPlaceholder: t("wallet:enter_your_password"),
        });
        const filter = [password !== null, Number(req_amount) !== 0];
        const err_index = filter.indexOf(false);

        if (err_index === -1) {
            const trid = updateTrId();
            const info = {
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't365C',
                    trid,
                },
                Input1: {
                    szAccNo: szAccNo,
                    szPasswd: password,
                    szCurNo: selectedSymbol,
                    fOrderSu: req_amount,
                    fPrice: coin_rate,
                    fExePrice: coin_rate,
                    szOrdType: 'EOM',
                    nRange: '0',
                    nAlivingTerm: '0',
                    szDealDiv: '081',
                    fNxOpenRate: '',
                    szOrgCustItem: '',
                    szNotMemberAccNo: '',
                    szStaffID: '',
                    szStaffPW: '',
                    cIsStaff: '0',
                    szAcceptTime: moment().format('YYYYMMDDhhmmss'),
                    szOrderID: '',
                    szEXPosID: '',
                    txid: '',
                },
            };
            setPw(password || '');
            setTrid(trid);
            setLoading(true);
            socketService.sendToAgent(info);
        } else {
            switch (err_index) {
                case 0:
                    break;
                case 1:
                    alert(t("wallet:check_amount"));
                    break;
                default:
                    alert(t("wallet:please_contact_the_admin"));
            }
        }
    };

    const reqT211C = () => {
        const trid = updateTrId();
        const info = {
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't211C',
                trid,
            },
            Input1: {
                nDate: moment().format('YYYYMMDD'),
                szAccNo: szAccNo,
                szPasswd: pw,
                szPNCode: '526',
                szPOCode: '001',
                fCashBalanceM: req_amount * coin_rate,
                fInputBillM: '',
                fEtcBillM: '',
                szRACode: '0001',
                szInputCur: '00',
                fMoney: '',
                szStaffID: '',
                szStaffPwd: '',
                szMemo: '',
                szRequest_Name: '',
            },
        };
        setTrid(trid);
        setLoading(true);
        socketService.sendToAgent(info);
    };
    //t221C응답 처리. initializatioin issue로 reqT365C아래에 뒀습니다
    useEffect(() => {
        if (loading && t365C) {
            const { flag, data } = t365C.Message;
            switch (flag) {
                case 'E':
                    alert(data);
                    setTrid('-1');
                    setLoading(false);
                    break;
                case '0':
                    reqT211C();
                    break;
                default:
                    alert(data);
            }
        }
    }, [t365C, loading]);

    useEffect(() => {
        if (loading && t211C) {
            const { flag, data } = t211C.Message;
            switch (flag) {
                case 'E':
                    alert(data);
                    setLoading(false);
                    setTrid('-1');
                    break;
                case '0':
                    alert(t("wallet:request_success")); // message가 영어여서 리터럴로 대체
                    // 잔고 갱신
                    reloadAsset(szAccNo, selectedSymbol);
                    setLoading(false);
                    setReqAmount(0);
                    break;
                default:
                    alert(data);
            }
        }
    }, [t211C, loading]);

    if (loading) {
        return <tr><td>{t("wallet:wait_please")}</td></tr>;
    }

    const onChangeAmount = (e) => {
        const { name, value } = e.target;
        const NumValue = Number(value);
        if (value !== '' && NumValue !== 0 && !NumValue) {
            alert(t("wallet:only_number"));
        } else {
            setReqAmount(value);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', flexFlow: 'wrap' }}>
                <InputDiv>
                    <div className="row">
                        <InputBoxDiv>
                            <BoldTitle>{t("wallet:exchange_request_amount")}({selectedSymbol})</BoldTitle>
                            <br />
                            <InputBox onChange={onChangeAmount} value={req_amount} />
                        </InputBoxDiv>

                        <InputBoxDiv>
                            <BoldTitle>{t("wallet:expected")} USDT({t("wallet:point")})</BoldTitle>
                            <br />
                            <InputBox value={req_amount * coin_rate} disabled />
                        </InputBoxDiv>
                    </div>
                    <div className="row">
                        <InputBoxDiv>
                            <BoldTitle>{selectedSymbol}: {t("wallet:current_balance")}</BoldTitle>
                            <br />
                            <InputBox value={coin_amount} disabled />
                            {/*  coin_amount - req_amount */}
                            {/*  coin_amount - req_amount */}
                        </InputBoxDiv>

                        <InputBoxDiv>
                            <BoldTitle>USDT: {t("wallet:current_balance")}</BoldTitle>
                            <br />
                            <InputBox value={usdt_amount} disabled />
                            {/* usdt_amount - req_amount*coin_rate */}
                        </InputBoxDiv>
                    </div>
                </InputDiv>
                <GrayPost>
                    <span className="post_title">{t("wallet:exchange_information")}</span>
                    <br />
                    <p className="post_text">
                    {t("wallet:exchange_information_contents_1")}
                        <br />
                        {t("wallet:exchange_information_contents_2")}
                        <br />
                        {t("wallet:exchange_information_contents_3")}
                    </p>
                </GrayPost>
            </div>
            <RequestButton onClick={reqT365C}>
                {/* reqT365C */}
                {t("wallet:request")}
            </RequestButton>
        </>
    );
};
export default Convert;

const Content = styled.div`
    max-width: 1200px;
    margin: 0px auto;
`;
const FormItem = styled.div``;

const SmallDiv = styled.div`
    @media (max-width: 750px) {
        &.first {
            border-bottom: 1px solid #ededed;
            margin: 4px 0px 10px;
            padding-bottom: 8px;
        }
    }
    @media (min-width: 750px) {
        margin: 4px 0px;
        &.first {
            margin-right: 30px;
        }
    }
    width: 328px;
    display: inline-block;
    color: #383838;
    font-family: Noto Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 11px;

    & .sub_title {
        line-height: 15px;
    }

    & .sub_title_value {
        float: right;
        line-height: 15px;
    }
`;

const BoldTitle = styled.span`
    display: inline-block;
    margin-bottom: 4px;
    font-family: Noto Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 20px;
`;

const InputDiv = styled.div`
    & .row {
        max-width: 800px;
    }

    margin-right: 8px;
`;
const InputBoxDiv = styled.div`
    display: inline-block;
    width: 48%;
    min-width: 360px;
    margin-bottom: 8px;
`;
const InputBox = styled.input`
    border: 1px solid #dddddd;
    box-sizing: border-box;
    border-radius: 4px;
    width: 328px;
    height: 48px;
`;

const GrayPost = styled.div`
    width: 328px;
    background: #f5f5f5;
    border-radius: 4px;
    padding: 20px;
    margin: 8px 0px;

    & .post_title {
        font-family: Noto Sans;
        font-style: normal;
        font-weight: 600;
        font-size: 13px;
        line-height: 18px;
        color: #173959;
    }

    & .post_text {
        font-family: Noto Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 11px;
        line-height: 15px;
        color: #777777;
    }
`;

const RequestButton = styled.button`
    margin-top: 16px;
    width: 328px;
    height: 40px;
    background: #173959;
    border-radius: 4px;
    color: #ffffff;
`;
const AssetTable = styled.table`
    min-width: 500px;
    margin: 0px auto 0px;
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
        line-height: 55px;

        td:nth-child(6) {
            width: 20%;
        }
    }
`;

const RowMiddle = styled.td`
    font-weight: normal;
    font-size: 14px;
    color: black;
`;

const NavButton = styled.div`
    margin: 20px 0px;

    & > button {
        margin-right: 8px;
        padding: 0px;
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
    ${({$active}) =>
        $active &&
        css`
            font-weight: 700 !important;
            color: #173959 !important;
            border-bottom: 1px solid #173959 !important;
        `}
`;