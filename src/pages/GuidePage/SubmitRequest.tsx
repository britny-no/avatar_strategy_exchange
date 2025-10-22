import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import moment from 'moment';
import 'moment-timezone';
import { useTranslation } from 'react-i18next';

import { useTypedSelector } from '@/states/useTypedSelector';
import socketService from '@/states/socketAgent/SocketService';

import RequestPage from '../SubmitRequest/RequestPage';
import ResponsePage from '../SubmitRequest/ResponsePage';

export const reloadList = (email: string) => {
    socketService.sendToAgent({
        Header: {
            function: 'D',
            termtype: 'HTS',
            trcode: 't2511',
        },
        Input1: {
            szCust_No: email, //szAccNo,
            szFrom_Date: moment(moment().add('-60', 'd').toDate()).format('YYYYMMDD000000'),
            szTo_Date: moment().format('YYYYMMDD999999'),
        },
    });

    socketService.sendToAgent({
        Header: {
            function: 'D',
            termtype: 'HTS',
            trcode: 't2515',
        },
        Input1: {
            szCust_No: email, //szAccNo,
            szFrom_Date: moment(moment().add('-60', 'd').toDate()).format('YYYYMMDD000000'),
            szTo_Date: moment().format('YYYYMMDD999999'),
        },
    });
};

const index = () => {
    const {t} = useTranslation()
    const { email } = useTypedSelector((state) => state.userReducer.data);
    const isLoggedIn = useTypedSelector((state) => state.userReducer.isLoggedIn);

    const [path, setPath] = useState('request_list');
    const [response_data, setResponseData] = useState({ email: email, req_number: 0, req_detail_number: 0 });


    if (!isLoggedIn) {
        alert(t("helpCenter:please_login"));
        window.location.href = '/mobile/signin';
        return null;
    }


    const renderBody = () => {
        const { email, req_number, req_detail_number } = response_data;
        switch (path) {
            case 'request_list':
                return <RequestList setPath={setPath} setResponseData={setResponseData} />;
            case 'request_page':
                return <RequestPage setPath={setPath} />;
            case 'response_page':
                return <ResponsePage setPath={setPath} email={email} req_number={req_number} req_detail_number={req_detail_number} />;
            default:
                return <div>Sorry</div>;
        }
    };
    return (
        <div className='content'> 
        <ContentHead>
            <p className="title">{t("helpCenter:submit_a_request")}</p>
        </ContentHead>
        <ContentBody>{renderBody()}</ContentBody>
    </div>
    );
};

const RequestList = ({ setPath, setResponseData }) => {
    const {t} = useTranslation()
    const t2511 = useTypedSelector((state) => state.stateReducer.t2511);
    const { email } = useTypedSelector((state) => state.userReducer.data);

    useEffect(() => {
        if (email) reloadList(email);
    }, []);

    const RenderNotice = () => {
        let key = 0;

        if (!t2511) {
            return <tr><td>{t("helpCenter:wait_please")}</td></tr>;
        } else if (!t2511.Output2) {
            return <tr>
                <td>{t("helpCenter:no_data")}</td>
            </tr>;
        }

        return t2511.Output2.filter(v =>  v[0].trim() === "GongJi").map((v) => {
            key += 1;

            return (
                <AcriveTr
                    className="row"
                    key={key}
                    onClick={() => {
                        setPath('response_page');
                        setResponseData({ email: "GongJi",req_number: v[1], req_detail_number: v[3] });
                    }}
                >
                    <RowMiddle style={{ width: '15%' }}>{t("helpCenter:notice")}</RowMiddle>
                    <RowMiddle style={{ width: '15%' }}></RowMiddle>
                    <RowMiddle style={{ width: '70%' }}>{v[2]}</RowMiddle>
                </AcriveTr>
            );
        });
    }

    const RenderRow = () => {
        let key = 0;

        if (!t2511) {
            return <tr><td>{t("helpCenter:wait_please")}</td></tr>;
        } else if (!t2511.Output2) {
            return <tr>
        <td>{t("helpCenter:no_data")}</td>
    </tr>;
        }

        return t2511.Output2.filter(v =>  v[0].trim() === email).map((v) => {
            key += 1;

            return (
                <AcriveTr
                    className="row"
                    key={key}
                    onClick={() => {
                        setPath('response_page');
                        setResponseData({ email, req_number: v[1], req_detail_number: v[3] });
                    }}
                >
                    <RowMiddle style={{ width: '15%' }}>{v[1]}</RowMiddle>
                    <RowMiddle style={{ width: '15%' }}>{v[3]}</RowMiddle>
                    <RowMiddle style={{ width: '70%' }}>{v[2]}</RowMiddle>
                </AcriveTr>
            );
        });
    };

    return (
        <>
            <div style={{ width: '100%', height: '50px' }}>
                <RequestButton onClick={() => setPath('request_page')}>+ {t("helpCenter:request")}</RequestButton>
            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between', flexFlow: 'wrap' }}>
                <div style={{ overflowX: 'scroll', width: '100%', minWidth: '360px', marginBottom: '10px' }}>
                    <AssetTable>
                        <thead style={{ display: 'table', width: '100%' }}>
                            <tr className="column">
                                <th style={{ width: '15%' }}>{t("helpCenter:no")}</th>
                                <th style={{ width: '15%' }}>{t("helpCenter:stat")}</th>
                                <th style={{ width: '70%' }}>{t("helpCenter:request_subject")}</th>
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
                            {RenderNotice()}
                            {RenderRow()}
                        </tbody>
                    </AssetTable>
                </div>
            </div>
        </>
    );
};

export default index;

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

const NavTitle = styled.li`
    padding: 10px 0px;
    font-weight: bold;
    font-size: 15px;
    line-height: 20px;
    color: #383838;
`

const NavLi = styled.li`
    cursor: pointer;
    margin: 10px 0px;
    font-weight: bold;
    border-radius: 2px;
    padding: 6px 12px;
    background: rgb(253, 236, 212);
`
