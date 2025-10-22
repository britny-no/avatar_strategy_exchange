import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useClipboard } from 'use-clipboard-copy';
import {QRCode} from 'react-qrcode-logo';

import socketService from '@/states/socketAgent/SocketService';
import { useTypedSelector } from '@/states/useTypedSelector';
import { reloadAsset } from './Convert';

import { returnSymbol } from './Hero';

type ActiveProps = {
    active: boolean;
};

const Deposit = ({ coinOb, szAccNo, selectedSymbol, depositWithdraw }) => {
    const {t} = useTranslation()
    const t0231_BTC = useTypedSelector((state) => state.stateReducer.t0231_BTC);
    const t0231_ETH = useTypedSelector((state) => state.stateReducer.t0231_ETH);
    const t0231_USDT = useTypedSelector((state) => state.stateReducer.t0231_USDT);
    const t0231_XRP = useTypedSelector((state) => state.stateReducer.t0231_XRP);

    // const t3615_history = useTypedSelector((state) => state.stateReducer.t3615_history);

    const [selectedNav, setSelectedNav] = useState(depositWithdraw || 'deposit');

    useEffect(() => {
        const info = {
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't3608',
            },
            Input1: {
                szAccNo: szAccNo,
                szCurNo: 'BTC',
            },
        };
        socketService.sendToAgent(info);

        if (!t0231_BTC) {
            const info = {
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't0231',
                    trid: '1',
                },
                Input1: {
                    szAccNo: szAccNo,
                    szCurNo: 'BTC',
                },
            };
            socketService.sendToAgent(info);
        }

        if (!t0231_ETH) {
            const info = {
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't0231',
                    trid: '2',
                },
                Input1: {
                    szAccNo: szAccNo,
                    szCurNo: 'ETH',
                },
            };
            socketService.sendToAgent(info);
        }

        if (!t0231_USDT) {
            const info = {
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't0231',
                    trid: '3',
                },
                Input1: {
                    szAccNo: szAccNo,
                    szCurNo: 'USDT',
                },
            };
            socketService.sendToAgent(info);
        }

        if (!t0231_XRP) {
            const info = {
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't0231',
                    trid: '4',
                },
                Input1: {
                    szAccNo: szAccNo,
                    szCurNo: 'XRP',
                },
            };
            socketService.sendToAgent(info);
        }
    }, []);

    const type = selectedNav === "deposit";
    return (
        <>
            <div className="flex_div">
                <span className="sub_title">{t("wallet:deposit")} / {t("wallet:withdraw")}</span>
            </div>
            <br />
            <Content>
                <NavButton>
                    <NavDeposit $active={type} onClick={() => setSelectedNav('deposit')}>
                    {t("wallet:deposit")}
                    </NavDeposit>
                    <NavDeposit $active={!type} onClick={() => setSelectedNav('withdraw')}>
                    {t("wallet:withdraw")}
                    </NavDeposit>
                </NavButton>
                <div style={{ borderBottom: '1px solid #E1E1E1', paddingBottom: '20px' }}>
                    {type ? (
                        <DepositComponent selectedNav={selectedNav} selectedSymbol={selectedSymbol} szAccNo={szAccNo} />
                    ) : (
                        <WithdrawComponent
                            selectedNav={selectedNav}
                            selectedSymbol={selectedSymbol}
                            szAccNo={szAccNo}
                        />
                    )}
                </div>
                <br />
                <br />
                {type ? (
                    <DepositHistory selectedSymbol={selectedSymbol} />
                ) : (
                    <WithdrawHistory selectedSymbol={selectedSymbol} />
                )}
            </Content>
        </>
    );
};

interface ComponentProps {
    selectedNav: string;
    selectedSymbol: string;
    szAccNo: string;
}

const DepositHistory = ({ selectedSymbol }) => {
    const {t} = useTranslation()
    const t3625 = useTypedSelector((state) => state.stateReducer[`t3625_${selectedSymbol}`]);
    const RenderRowPc = () => {
        let key = 0;

        if (!t3625) {
            return (
                <tr>
                    <td>{t("wallet:wait_please")}</td>
                </tr>
            );
        } else if (t3625 && t3625.length === 0 ) {
            return (
                <tr>
                <td>{t("wallet:no_data")}</td>
            </tr>
            );
        }

        return t3625.map((v) => {
            key += 1;
            return (
                <tr className="row" key={key}>
                    <RowMiddle style={{ width: '15%' }}>{v[6]}</RowMiddle>
                    <RowFirst style={{ width: '10%' }}>
                        <span className="wallet_coin_symbol">{returnSymbol(v[1])}</span>
                        <span>{v[1]}</span>
                    </RowFirst>
                    <RowMiddle style={{ width: '10%' }}>{`${v[4]} ${v[1]}`}</RowMiddle>
                    <RowMiddle style={{ width: '5%' }}>{v[2] === '079' ? t("wallet:in") : t("wallet:out")} </RowMiddle>
                    <RowMiddle
                        style={{ width: '300px', overflow: 'hidden', display: 'block', textOverflow: 'ellipsis' }}
                    >
                        {v[0]}
                    </RowMiddle>
                    {/* <RowMiddle style={{ width: '6%' }}>{v[3] === 'SOM' ? 'Transfer' : 'Convert'}</RowMiddle> */}
                </tr>
            );
        });
    };

    return (
        <>
            <BoldTitle>{t("wallet:deposit_history")}</BoldTitle>
            <br />
            <div style={{ overflowX: 'scroll', marginTop: '20px' }}>
                <AssetTable>
                    <thead style={{ display: 'table', width: '100%' }}>
                        <tr className="column">
                            <th style={{ width: '15%' }}>{t("wallet:date")}</th>
                            <th style={{ width: '10%' }}>{t("wallet:coin")}</th>
                            <th style={{ width: '10%' }}>{t("wallet:amount")}</th>
                            <th style={{ width: '5%' }}>{t("wallet:in_out")}</th>
                            <th style={{ width: '300px' }}>{t("wallet:tx")}</th>
                            {/* <th style={{ width: '6%' }}>Status</th> */}
                        </tr>
                    </thead>
                    {/* <tbody style={{ display: 'block', overflowY: 'scroll', width: '100%', height: '400px' }}>
                        {RenderRowPc()}
                    </tbody> */}
                    <tbody style={{ overflowY: 'scroll', width: '100%', height: '400px' }}>{RenderRowPc()}</tbody>
                </AssetTable>
            </div>
        </>
    );
};

const WithdrawHistory = ({ selectedSymbol }) => {
    const {t} = useTranslation()
    const t3616 = useTypedSelector((state) => state.stateReducer[`t3616_${selectedSymbol}`]);

    // const t3616Origin = useTypedSelector((state) => state.stateReducer[`t3616`]);
    const RenderRowPc = () => {
        let key = 0;

        if (!t3616) {
            return (
                <tr>
                    <td>{t("wallet:wait_please")}</td>
                </tr>
            );
        } else if (t3616 && t3616.length === 0 ) {
            return (
            <tr>
                <td>{t("wallet:no_data")}</td>
            </tr>
            );
        }

        return t3616.map((v) => {
            key += 1;
            return (
                <tr className="row" key={key}>
                    <RowMiddle style={{ width: '3%' }}>{v[1]}</RowMiddle>
                    <RowMiddle style={{ width: '10%' }}>{v[0]}</RowMiddle>
                    <RowMiddle style={{ width: '12%' }}>{v[2]}</RowMiddle>
                    <RowMiddle style={{ width: '12%' }}>{v[3]}</RowMiddle>
                    <RowMiddle style={{ width: '20%' }}>{v[4]}</RowMiddle>
                    <RowMiddle style={{ width: '5%' }}>{v[5]}</RowMiddle>
                    <RowMiddle style={{ width: '5%' }}>{v[6]}</RowMiddle>
                    <RowMiddle style={{ width: '5%' }}>{v[7]}</RowMiddle>
                    <RowMiddle style={{ width: '5%' }}>{v[8]}</RowMiddle>
                    <RowMiddle style={{ width: '5%' }}>{v[9]}</RowMiddle>
                    <RowMiddle style={{ width: '5%' }}>{v[10]}</RowMiddle>
                    <RowMiddle style={{ width: '5%', minWidth: '465px' }}>{v[11]}</RowMiddle>
                    <RowMiddle style={{ width: '5%' }}>{v[13]}</RowMiddle>
                </tr>
            );
        });
    };

    return (
        <>
            <BoldTitle>{t("wallet:withdraw_history")}</BoldTitle>
            <br />
            <div style={{ overflowX: 'scroll', marginTop: '20px' }}>
                <AssetTable>
                    <thead style={{ display: 'table', width: '100%' }}>
                        <tr className="column">
                            <th style={{ width: '3%' }}>{t("wallet:no")}</th>
                            <th style={{ width: '10%' }}>{t("wallet:date")}</th>
                            <th style={{ width: '12%' }}>{t("wallet:account_no")}</th>
                            <th style={{ width: '12%' }}>{t("wallet:datetime")}</th>
                            <th style={{ width: '20%' }}>{t("wallet:wallet_address")}</th>
                            <th style={{ width: '5%' }}>{t("wallet:address_tag")}</th>
                            <th style={{ width: '5%' }}>{t("wallet:amount")}</th>
                            <th style={{ width: '5%' }}>{t("wallet:symbol")}</th>
                            <th style={{ width: '5%' }}>{t("wallet:price")}</th>
                            <th style={{ width: '5%' }}>{t("wallet:treat_stat")}</th>
                            <th style={{ width: '5%' }}>{t("wallet:treat_time")}</th>
                            <th style={{ width: '5%' }}>{t("wallet:txid")}</th>
                            <th style={{ width: '5%' }}>{t("wallet:memo")}</th>
                        </tr>
                    </thead>
                    <tbody style={{ display: 'block', overflowY: 'scroll', width: '100%', height: '400px' }}>
                        {RenderRowPc()}
                    </tbody>
                </AssetTable>
            </div>
        </>
    );
};

const DepositComponent = ({ selectedNav, selectedSymbol, szAccNo }: ComponentProps) => {
    const {t} = useTranslation()
    const clipboard = useClipboard();

    const t0231_BTC = useTypedSelector((state) => state.stateReducer.t0231_BTC);
    const t0231_ETH = useTypedSelector((state) => state.stateReducer.t0231_ETH);
    const t0231_USDT = useTypedSelector((state) => state.stateReducer.t0231_USDT);
    const t0231_XRP = useTypedSelector((state) => state.stateReducer.t0231_XRP);

    const address = {
        BTC: t0231_BTC ? t0231_BTC.address : '',
        ETH: t0231_ETH ? t0231_ETH.address : '',
        USDT: t0231_USDT ? t0231_USDT.address : '',
        XRP: t0231_XRP ? t0231_XRP.address : '',
    };
    const destination_tag = {
        BTC: t0231_BTC ? t0231_BTC.destination_tag : '',
        ETH: t0231_ETH ? t0231_ETH.destination_tag : '',
        USDT: t0231_USDT ? t0231_USDT.destination_tag : '',
        XRP: t0231_XRP ? t0231_XRP.destination_tag : '',
    };

    const generateAddr = (e: any) => {
        e.preventDefault();

        const coin_number = {
            BTC: '1',
            ETH: '2',
            USDT: '3',
            XRP: '4',
        };
        const info = {
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't0230',
                trid: coin_number[selectedSymbol],
            },
            Input1: {
                szAccNo: szAccNo,
                szCurNo: selectedSymbol,
            },
        };
        socketService.sendToAgent(info);
    };

    if (address[selectedSymbol]) {
        return (
            <FormItem id="deposit">
                <BoldTitle>{t("wallet:my")} {selectedSymbol} {t("wallet:wallet_address")}</BoldTitle>
                <br />
                <div style={{ borderBottom: '1px solid rgb(225, 225, 225)', paddingBottom: '20px' }}>
                    <AmountInputDiv>
                        <div className="input">
                            <InputBoxDiv>
                                <InputBox
                                    value={address[selectedSymbol].trim()}
                                    ref={clipboard.target}
                                    onChange={() => null}
                                />
                            </InputBoxDiv>
                        </div>
                        <MaxButton className="button" onClick={clipboard.copy}>
                        {t("wallet:copy_address")}
                        </MaxButton>
                    </AmountInputDiv>
                    <BoldTitle>{t("wallet:destination_tag")}</BoldTitle>
                    <br />
                    <AmountInputDiv>
                        <div className="input">
                            <InputBoxDiv>
                                <InputBox
                                    value={destination_tag[selectedSymbol].trim()}
                                    onChange={() => null}
                                    disabled
                                />
                            </InputBoxDiv>
                        </div>
                    </AmountInputDiv>
                </div>
                <br />
                <BoldTitle>{t("wallet:qr_code")}</BoldTitle>
                <br />
                <div style={{ display: 'flex', flexFlow: 'wrap' }}>
                    <InputDiv style={{ width: '100%', maxWidth: '368px' }}>
                        <QrDiv>
                            <QRCode value={address[selectedSymbol]} />
                        </QrDiv>
                    </InputDiv>
                    <GrayPost $active={selectedNav === "deposit"}>
                        <span className="post_title">{t("wallet:withdraw_history")}</span>
                        <br />
                        <br />
                        <p className="post_text">
                        {t("wallet:gray_post_text_1")} {import.meta.env.REACT_APP_EXCHANGE || "EXCHANGE"} {t("wallet:gray_post_text_2")}
                            <br />
                            {t("wallet:gray_post_text_3")}
                            <br />
                            {t("wallet:gray_post_text_4")}
                        </p>
                        <br />
                        <p className="post_text" style={{ color: '#353535' }}>
                        {import.meta.env.REACT_APP_EXCHANGE  || "EXCHANGE"} {t("wallet:gray_post_text_5")}
                        </p>
                    </GrayPost>
                </div>
            </FormItem>
        );
    } else {
        return (
            <div style={{ textAlign: 'center' }}>
                <br />
                <MaxButton onClick={generateAddr}>{t("wallet:generate_address")}</MaxButton>
            </div>
        );
    }
};

const WithdrawComponent = ({ selectedNav, selectedSymbol, szAccNo }: ComponentProps) => {
    const {t} = useTranslation()
    const t9732_BIN_BTCUSDT = useTypedSelector((state) => state.stateReducer.t9732_BIN_BTCUSDT);
    const t9732_BIN_ETHUSDT = useTypedSelector((state) => state.stateReducer.t9732_BIN_ETHUSDT);
    const t9732_BIN_XRPUSDT = useTypedSelector((state) => state.stateReducer.t9732_BIN_XRPUSDT);
    const t3620 = useTypedSelector((state) => state.stateReducer.t3620);

    const [form, setForm] = useState({
        targetAdd: '',
        amount: 0,
        fee: 0,
        actualAmount: 0,
        secretPw: '',
        targetExtr: '',
    });
    const [currentTrid, setTrid] = useState('-1');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (loading && t3620) {
            const { flag, data } = t3620.Message;
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
                    setForm({
                        targetAdd: '',
                        amount: 0,
                        fee: 0,
                        actualAmount: 0,
                        secretPw: '',
                        targetExtr: '',
                    });
                    break;
                default:
                    alert(data);
            }
        }
        // if(t3620 && t3620.Message.code === '00000'){
        //     alert('출금 신청이 완료됐습니다')
        // }else if(t3620 && t3620.Message.code !== '00000'){
        //     alert(t3620.Message.data)
        // }
    }, [t3620, loading]);

    const onChangeHandler = (e: any) => {
        const { name, value } = e.target;
        const onlyNumName = ['amount', 'fee', 'actualAmount'];
        const NumValue = Number(value);
        const fee_ob = {
            BTC: 0.001,
            ETH: 0.01,
            USDT: 20,
            XRP: 1,
        };
        const fee_status = value === 0 || value === '';

        if (onlyNumName.includes(name) && value !== '' && NumValue !== 0 && !NumValue) {
            alert(t("wallet:only_number"));
        } else {
            switch (name) {
                // actualAmount계산시 보여줄 소수점 끝자리를 정해야합니다
                case 'amount':
                    setForm({
                        ...form,
                        amount: value,
                        fee: fee_status ? 0 : fee_ob[selectedSymbol],
                        actualAmount: fee_status ? 0 : Number(value) + fee_ob[selectedSymbol],
                    });
                    break;
                default:
                    setForm({ ...form, [name]: value });
            }
        }
    };

    const reqWithdraw = (e: any) => {
        e.preventDefault();
        const { targetAdd, amount, secretPw, targetExtr } = form;
        const amt_prc_ob = {
            BTC: t9732_BIN_BTCUSDT ?   t9732_BIN_BTCUSDT.Output1.fClose : 0,
            ETH:  t9732_BIN_ETHUSDT ?   t9732_BIN_ETHUSDT.Output1.fClose : 0,
            USDT: 1,
            XRP: t9732_BIN_XRPUSDT ?   t9732_BIN_XRPUSDT.Output1.fClose : 0,
        };

        if (targetAdd === '' || secretPw === '' || amount === 0 || (selectedSymbol === 'XRP' && targetExtr === '')) {
            alert(t("wallet:please_fill_information"));
        } else {
            const info = {
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't3620',
                },
                Input1: {
                    accno: szAccNo,
                    cur_no: selectedSymbol,
                    target_addr: targetAdd,
                    target_extr: targetExtr,
                    amount: amount,
                    amt_prc: amt_prc_ob[selectedSymbol],
                    pswd: secretPw,
                },
            };
            setLoading(true);
            console.log(info)
            socketService.sendToAgent(info);
        }
    };

    if (loading) {
        return <div>{t("wallet:wait_please")}</div>;
    }

    const { targetAdd, amount, fee, actualAmount, secretPw, targetExtr } = form;
    return (
        <FormItem id="withdraw">
            <BoldTitle>{selectedSymbol} {t("wallet:send_to")}</BoldTitle>
            <br />
            <div style={{ display: 'flex', flexFlow: 'wrap' }}>
                <div style={{ paddingBottom: '20px' }}>
                    <AmountInputDiv>
                        <div className="input">
                            <InputBoxDiv>
                                <InputBox name="targetAdd" value={targetAdd} onChange={onChangeHandler} />
                            </InputBoxDiv>
                        </div>
                        <MaxButton className="button">{t("wallet:check_address")}</MaxButton>
                    </AmountInputDiv>
                    {selectedSymbol === 'XRP' ? (
                        <>
                            <BoldTitle>{t("wallet:address_more_options")}</BoldTitle>
                            <br />
                            <AmountInputDiv>
                                <div className="input">
                                    <InputBoxDiv>
                                        <InputBox name="targetExtr" value={targetExtr} onChange={onChangeHandler} />
                                    </InputBoxDiv>
                                </div>
                            </AmountInputDiv>
                        </>
                    ) : null}
                    <div style={{ display: 'flex' }}>
                        <InputBoxDiv style={{ margin: '10px 10px 0px 0px' }}>
                            <BoldTitle>{t("wallet:amount")}</BoldTitle>
                            <br />
                            <InputBox name="amount" value={amount} onChange={onChangeHandler} />
                        </InputBoxDiv>

                        <InputBoxDiv style={{ width: '110px', marginTop: '10px' }}>
                            <BoldTitle>{t("wallet:fee")}</BoldTitle>
                            <br />
                            <InputBox name="fee" value={fee} onChange={onChangeHandler} readOnly />
                        </InputBoxDiv>
                    </div>
                    <InputBoxDiv>
                        <BoldTitle>{t("wallet:actual_withdraw_amount")}</BoldTitle>
                        <br />
                        <InputBox name="actualAmount" value={actualAmount} onChange={onChangeHandler} readOnly />
                    </InputBoxDiv>
                    <br />
                    <InputBoxDiv>
                        <BoldTitle>{t("wallet:secret_password")}</BoldTitle>
                        <br />
                        <InputBox type="password" name="secretPw" value={secretPw} onChange={onChangeHandler} />
                    </InputBoxDiv>
                    <br />
                    <RequestButton onClick={reqWithdraw}> {t("wallet:withdraw_request")}</RequestButton>
                </div>
                <GrayPost $active={selectedNav === "deposit"}>
                    <span className="post_title">{t("wallet:gray_post_title")}</span>
                    <br />
                    <br />
                    <p className="post_text">
                    {t("wallet:gray_post_text_1")} {import.meta.env.REACT_APP_EXCHANGE || "EXCHANGE"} {t("wallet:gray_post_text_2")}
                        <br />
                        {t("wallet:gray_post_text_3")}
                        <br />
                        {t("wallet:gray_post_text_4")}
                    </p>
                    <br />
                    <p className="post_text" style={{ color: '#353535' }}>
                    {import.meta.env.REACT_APP_EXCHANGE || "EXCHANGE"} {t("wallet:gray_post_text_5")}
                    </p>
                </GrayPost>
            </div>
        </FormItem>
    );
};

export default Deposit;

const Content = styled.div`
    max-width: 1200px;
    margin: 0px auto;
`;
const FormItem = styled.div``;

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

    @media (min-width: 750px) {
        margin-right: 8px;
    }
`;
const InputBoxDiv = styled.div`
    display: inline-block;
    width: 100%;
    max-width: 328px;
    margin-bottom: 8px;
`;
const InputBox = styled.input`
    border: 1px solid #dddddd;
    box-sizing: border-box;
    border-radius: 4px;
    width: 100%;
    height: 48px;
`;

const GrayPost = styled.div<{$active: boolean}>`
    ${({$active}) =>
        $active
            ? css`
                  @media (max-width: 750px) {
                      margin: 8px 0px;
                  }

                  @media (min-width: 750px) {
                      height: 200px;
                  }
              `
            : css`
                  @media (max-width: 750px) {
                      margin: 8px 0px;
                  }

                  @media (min-width: 750px) {
                      height: 200px;
                      margin-left: 10px;
                  }
              `}

    width: 100%;
    max-width: 368px;
    background: rgba(255, 107, 107, 0.04);
    border-radius: 4px;
    padding: 20px;

    & .post_title {
        font-family: Noto Sans;
        font-style: normal;
        font-weight: 600;
        font-size: 13px;
        line-height: 18px;
        color: #ff6b6b;
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

const QrDiv = styled.div`
    width: 100%;
    height: 100%;
    max-width: 368px;
    max-height: 368px;
    border: 1px solid #dddddd;
    box-sizing: border-box;
    border-radius: 4px;
`;

const AssetTable = styled.table`
    min-width: 1500px;
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

const NavDeposit = styled.button<{$active: boolean}>`
  ${({ $active }) =>
    $active &&
    css`
      font-weight: 700 !important;
      color: #173959 !important;
      border-bottom: 1px solid #173959 !important;
    `}
`;


const AmountInputDiv = styled.div`
    display: flex;
    flex-flow: wrap;
    @media (max-width: 700px) {
        & .input {
            width: 100%;
        }
    }

    @media (min-width: 700px) {
        & .input {
            display: inline-block;
            width: 330px;
            margin-right: 10px;
        }
    }
`;

const MaxButton = styled.button`
    border: 1px solid #f49405;
    box-sizing: border-box;
    border-radius: 4px;
    width: 110px;
    height: 48px;
    color: #f49405;

    &: active {
        color: #ffffff;
        background-color: #f49405;
    }
`;

const RequestButton = styled.button`
    margin-top: 16px;
    max-width: 328px;
    width: 100%;
    height: 40px;
    background: #173959;
    border-radius: 4px;
    color: #ffffff;
`;
