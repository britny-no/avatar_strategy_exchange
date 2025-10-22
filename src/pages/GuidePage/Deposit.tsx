import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import moment from 'moment';
import 'moment-timezone';
import { useTranslation } from 'react-i18next';

import { useTypedSelector } from '@/states/useTypedSelector';
import socketService from '@/states/socketAgent/SocketService';

export const reloadList = ({now_date, szAccNo}) => {
        socketService.sendToAgent({
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't2313',
            },
            Input1: {
                nDate : now_date,
                szAccNo : szAccNo,
                fMoney : "",
                szStaffID : "",
                szStaffPwd : "",
                szMemo : "",
                szRequest_Name : ""

            },
        });

        socketService.sendToAgent({
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't2413',
            },
            Input1: {
                nDate : now_date,
                szAccNo : szAccNo,
                fMoney : "",
                szStaffID : "",
                szStaffPwd : "",
                szMemo : "",
                szRequest_Name : ""

            },
        });
};

const index = () => {
    const {t} = useTranslation()
    const { email,szAccNo } = useTypedSelector((state) => state.userReducer.data);
    const isLoggedIn = useTypedSelector((state) => state.userReducer.isLoggedIn);
    const t0101 = useTypedSelector((state) => state.stateReducer.t0101);
    const t113C = useTypedSelector((state) => state.stateReducer.t113C);

    const t113C_status = t113C && t113C.Output1
    const now_date =  t0101 && t0101.Output1 ? t0101.Output1.nCurBusiDate : moment().format('YYYYMMDD')
    const szBank_AccNo = t113C_status ? t113C.Output1.szBank_AccNo : '123'
    const name = t113C_status? t113C.Output1.szFullName : email

    if (!isLoggedIn ) {
        alert(t("helpCenter:please_login"));
        window.location.href = '/mobile/signin';
        return null;
    }
    
    useEffect(() => {
        if(!t0101){
            socketService.sendToAgent({
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't0101',
                },
                Input1: {
                    szMemberNo : "000",
                },
            });
        }
        reloadList({now_date,szAccNo })
    }, [])



    return (
        <div className='content'> 
        <ContentHead>
            <p className="title">{t("helpCenter:deposit_request")}</p>
            <NavButton>
                    <span style={{float: 'right', fontWeight: 'bold', height: '10px'}}>{t("helpCenter:client_no")}: {szBank_AccNo}</span>
            </NavButton>
        </ContentHead>
        <ContentBody>
            <Deposit info={{now_date, name}} />
        </ContentBody>
    </div>
    );
};

const Deposit = ({ info }) => {
    const {t} = useTranslation()
    const {now_date, name} = info
    const t2313 = useTypedSelector((state) => state.stateReducer.t2313);
    const t2310 = useTypedSelector((state) => state.stateReducer.t2310);
    const  { szAccNo } = useTypedSelector((state) => state.userReducer.data);

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        amount: 0,
    })



    useEffect(() => {
        if (loading && t2310) {
            const { flag, data } = t2310.Message;
            switch (flag) {
                case 'E':
                    alert(data);
                    setLoading(false);
                    break;
                case '0':
                    reloadList({now_date,szAccNo })
                    alert(t("helpCenter:deposit_request_completed"));
                    setLoading(false);
                    setForm({
                        amount: 0
                    });
                    
                    break;
                default:
                    alert(data);
            }
        }
    }, [t2310, loading]);

    const reqDeposit = () => {
        const {amount} = form

        if(  amount > 0){
            setLoading(true)
            socketService.sendToAgent({
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't2310',
                },
                Input1: {
                    nDate : now_date,
                    szAccNo : szAccNo,
                    fMoney : amount,
                    szStaffID : "",
                    szStaffPwd : "",
                    szMemo : "",
                    szRequest_Name : name
    
                },
            });
        }else{
            alert(t("helpCenter:please_number"))
        }

    }

    const onChangeHandler = (e) =>{
        const { name, value} = e.target
        const onlyNumName = ['amount'];
        const NumValue = Number(value);

        if (onlyNumName.includes(name) && value !== '' && NumValue !== 0 && !NumValue) {
            alert(t("helpCenter:please_number"));
        } else {
            setForm({
                ...form,
                [name] : value
            })
        }
    }

    const RenderRow = () => {
        const status_ob = {
            '0' : t("helpCenter:wait"),
            '1' : t("helpCenter:ok"),
            '9' : t("helpCenter:cancel")
        }
        let key = 0;

        if (!t2313) {
            return         <tr>
            <td>{t("helpCenter:wait_please")}</td>
        </tr>;
        } else if (!t2313.Output2) {
            return <tr>
            <td>{t("helpCenter:no_data")}</td>
        </tr>;
        }

        return t2313.Output2.map((v) => {
            key += 1;

            return (
                <AcriveTr
                    className="row"
                    key={key}
                >
                    <RowMiddle style={{ width: '10%' }}>{v[10]}</RowMiddle>
                    <RowMiddle style={{ width: '15%' }}>{v[6]}</RowMiddle>
                    <RowMiddle style={{ width: '15%' }}>{v[0]}</RowMiddle>
                    <RowMiddle style={{ width: '15%' }}>{v[2]}</RowMiddle>
                    <RowMiddle style={{ width: '10%' }}>{status_ob[Number(v[11])]}</RowMiddle>
                    <RowMiddle style={{ width: '35%' }}>{v[9]}</RowMiddle>
                </AcriveTr>
            );
        });
    };

    if (loading) {
        return <div>{t("helpCenter:wait_please")}</div>;
    }

    const { amount } = form
    return (
        <>
            <div style={{ width: '100%', height: '50px',  maxWidth: '800px' }}>
                <div style={{    width: "calc(100% - 100px)", display: "inline-block"}}>
                    <span>Amount: </span>
                    <AmountInput name="amount" value={amount} onChange={onChangeHandler}/>
                </div>
                <RequestButton onClick={reqDeposit}> {t("helpCenter:request")}</RequestButton>
            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between', flexFlow: 'wrap' }}>
                <div style={{ overflowX: 'scroll', width: '100%', minWidth: '360px', marginBottom: '10px' }}>
                    <AssetTable>
                        <thead style={{ display: 'table', width: '100%' }}>
                            <tr className="column">
                                <th style={{ width: '10%' }}>{t("helpCenter:no")}</th>
                                <th style={{ width: '15%' }}>{t("helpCenter:account_no")}</th>
                                <th style={{ width: '15%' }}>{t("helpCenter:datetime")}</th>
                                <th style={{ width: '15%' }}>{t("helpCenter:amount")}</th>
                                <th style={{ width: '10%' }}>{t("helpCenter:stat")}</th>
                                <th style={{ width: '35%' }}>{t("helpCenter:client_no")}</th>
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
                            {RenderRow()}
                        </tbody>
                    </AssetTable>
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

const NavButton = styled.div`
    margin: 10px 0px;
    max-width: 800px;
    height: 22px
`;




const AmountInput = styled.input`
    width: 50%;
    height: 20px;
    border: white;
    border-bottom: 1px solid black;
    max-width: 200px;
    margin-left:10px

    
`

const RequestButton = styled.button`
    float: right;
    width: 100px;
    height: 30px;
    border: 1px solid #00000075;
    border-radius: 4px;
    cursor: pointer;

    &:active {
        background-color: #22222229;
    }
`;

const AssetTable = styled.table`
    min-width: 500px;
    margin: 0px auto 0px;
    width: 1200px;
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

    &:active {
        background-color: #00000040;
        cursor: pointer;
    }
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

