import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { useTypedSelector } from '@/states/useTypedSelector';
import socketService from '@/states/socketAgent/SocketService';

import { updateTrId } from './component/Script';
import { reloadList } from './index';

const RequestPage = ({ setPath }) => {
    const { email } = useTypedSelector((state) => state.userReducer.data);

    const [loading, setLoading] = useState(false);
    const [currentTrid, setCurrentTrid] = useState('-1');

    const t2510 = useTypedSelector((state) => state.stateReducer[`t2510_${currentTrid}`]);

    const [form, setForm] = useState({
        subject: '',
        contents: '',
    });

    const submitForm = () => {
        const { subject, contents } = form;
        if (subject !== '' && contents !== '') {
            const trid = updateTrId();

            setCurrentTrid(trid);
            setLoading(true);
            socketService.sendToAgent({
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't2510',
                    trid,
                },
                Input1: {
                    szCust_No: email, //szAccNo,
                    szReq_Seq_No: 0,
                    szQue_Title_Data: subject,
                    szQue_Data1: '',
                    szQue_Data2: '',
                    szQue_Data3: '',
                    szQue_Memo: contents,
                },
            });
        } else {
            alert('내용을 기입해주세요');
        }
    };

    useEffect(() => {
        if (loading && t2510) {
            const { flag, data } = t2510.Message;
            setLoading(false);

            switch (flag) {
                case 'E':
                    alert(data);
                    setCurrentTrid('-1');
                    break;
                case '0':
                    if (email) reloadList(email);
                    setForm({
                        subject: '',
                        contents: '',
                    });
                    alert('등록완료됐습니다');
                    break;
                default:
                    alert(data);
            }
        }
    }, [t2510, loading]);

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    if (loading) {
        return <div>Wait please...</div>;
    }

    const { subject, contents } = form;
    return (
        <>
            <div style={{ width: '100%', height: '20px', marginTop: '40px' }}>
                <BackSpan onClick={() => setPath('request_list')}> {'<'} </BackSpan>
                <RequestButton onClick={submitForm}>Submit</RequestButton>
            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between', flexFlow: 'wrap' }}>
                <div style={{ display: 'flex', width: '100%', marginBottom: '20px' }}>
                    <input
                        style={{ width: '100%', height: '50px', paddingLeft: '10px' }}
                        placeholder="subject"
                        name="subject"
                        onChange={onChangeHandler}
                        value={subject}
                    />
                </div>
                <div style={{ display: 'flex', width: '100%', height: '500px' }}>
                    <textarea
                        style={{ width: '100%', height: '500px', padding: '10px' }}
                        placeholder="contents"
                        name="contents"
                        onChange={onChangeHandler}
                        value={contents}
                    />
                </div>
            </div>
        </>
    );
};

export default RequestPage;

const BackSpan = styled.span`
    width: 100px;
    height: 30px;
    line-heigt: 34px;
    font-size: 24px;
    cursor: pointer;
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
