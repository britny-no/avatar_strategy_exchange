import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useDispatch } from 'react-redux';

import { deleteTr } from '@/states/reducers/stateReducer';
import { useTypedSelector } from '@/states/useTypedSelector';
import socketService from '@/states/socketAgent/SocketService';

import { updateTrId } from './component/Script';
import { reloadList } from './index';
import moment from 'moment';

const ResponsePage = ({ setPath, email,req_number, req_detail_number }) => {
    const dispatch = useDispatch();

    const t2513 = useTypedSelector((state) => state.stateReducer.t2513);
    const t2515 = useTypedSelector((state) => state.stateReducer.t2515);
    const t2713_used_number = useTypedSelector((state) => state.stateReducer.t2713_used_number);
    const t2713 = useTypedSelector((state) => state.stateReducer.t2713);

    const [loading, setLoading] = useState(false);
    const [answer_arr, setAnswerArr] = useState([])
    const [form, setForm] = useState({
        subject: '',
        contents: '',
    });


    const clickListen = (e: any) => {
        const target = e.target
        const parentElement = e.target.parentElement
        const dom = document.getElementById("answer")?.getElementsByClassName('row')
    
        if(dom){
            const func = (dom,  target) => {
                for(let i = 0, len = dom ? dom.length: 0; i < len; i++){
                    const d = dom[i].children[1] as HTMLElement;
                    d.style.display = "none"
                }
                target.nextElementSibling.style.display = "block"
            }

            
            if(target.className.includes("answer_subject")){
                func(dom, target)
            }else if(parentElement.className.includes("answer_subject")){
                func(dom, parentElement)
            }
        }
    }

    useEffect(() => {
        socketService.sendToAgent({
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't2513',
            },
            Input1: {
                szCust_No: email, //szAccNo,
                szReq_Seq_No: req_number,
                szPrc_Seq_No: req_detail_number,
            },
        });
        return () => {
            document.getElementById("answer")?.removeEventListener("click", clickListen)
            dispatch(deleteTr({ key: `t2713`, data: [] }))
            dispatch(deleteTr({ key: `t2513`, data: [] }))
            dispatch(deleteTr({ key: `t2713_used_number`, data: [] }))
            // t2713_used_number
        }
    }, []);

    useEffect(() => {
        if (t2513 && t2513.Output1.szPrc_Seq_No === req_detail_number) {
            document.getElementById("answer")?.addEventListener("click", clickListen)

            const {szQue_Memo, szQue_Title_Data}= t2513.Output1
            
            setForm({
                subject: szQue_Title_Data,
                contents: szQue_Memo.replace(/#/g, '\n'),
            });
        }
    }, [t2513]);

    useEffect(() => {
        if(t2515 && t2515.Output2){
            const response_arr = t2515.Output2.filter(v => v[1] === req_number).map(v => {
                return [v[1], v[3]]
            })
            setAnswerArr(response_arr)
        }
    }, [t2515])

    useEffect(() => {
        answer_arr.filter(v => !t2713_used_number || !t2713_used_number.includes(v[1])).map(v => {
            socketService.sendToAgent({
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't2713',
                },
                Input1: {
                    szCust_No: email, //szAccNo,
                    szReq_Seq_No: v[0],
                    szPrc_Seq_No: v[1],
                },
            });
        })
    }, [answer_arr, t2713_used_number])


    const renderRow  = () => {
        if(t2713){
            return t2713.map(v => {
                const {szQue_Title_Data, szAns_Memo, szProc_Date, szAns_Proc_Date} = v
                return <div className='row' key={v}>
                          <AnswerSubject className='answer_subject'>
                                <span  style={{ display:'inline-block', overflow: "hidden", textOverflow: "ellipsis", width: "46%", whiteSpace:"nowrap"}}>{szQue_Title_Data}  </span>
                                <span  style={{float: 'right', fontSize: '1rem', marginLeft: "10px"}}>ResAt:{moment(szAns_Proc_Date, 'YYYYMMDDhhmmss').format('YYYY.MM.DD')}</span>
                                <span  style={{float: 'right', fontSize: '1rem'}}>ReqAt:{moment(szProc_Date, 'YYYYMMDDhhmmss').format('YYYY.MM.DD')}</span> 
                          </AnswerSubject>
                            <AnswerContent className='answer_contents'>
                            <div style={{width:'100%', marginBottom: '8px'}}>
                                <span>{szQue_Title_Data}  </span>
                            </div>
                                {szAns_Memo}
                            </AnswerContent>
                         </div>
            })
        }
    }
    

    if (loading || !t2513) {
        return <div>Wait please...</div>;
    }


    const { subject, contents } = form;
    return (
        <>
            <div style={{ width: '100%', height: '20px', marginTop: '40px' }}>
                <BackSpan onClick={() => setPath('request_list')}> {'<'} </BackSpan>
            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between', flexFlow: 'wrap' }}>
                <div style={{ display: 'flex', width: '100%', marginBottom: '20px' }}>
                    <input
                        style={{ width: '100%', height: '50px', paddingLeft: '10px' }}
                        placeholder="subject"
                        name="subject"
                        value={subject}
                        readOnly
                    />
                </div>
                <div style={{ display: 'flex', width: '100%', height: '250px' }}>
                    <textarea
                        style={{ width: '100%', height: '250px', padding: '10px' }}
                        placeholder="contents"
                        name="contents"
                        value={contents}
                        readOnly
                    />
                </div>
                <div style={{width: "100%", marginTop: '20px'}} id="answer">
                <span style={{fontSize: "2rem"}}>Answer</span><br/><br/>
                   {
                       renderRow()
                   }
                </div>
             
            </div>
        </>
    );
};

export default ResponsePage;

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

const AnswerSubject = styled.div`
    width: 100%;
    height: 40px;
    line-height: 34px;
    cursor: pointer;
    border-top: 1px solid #00000030;
    border-bottom: 1px solid #00000030;
    &:active {
        background-color: #00000040;
        cursor: pointer;
    }

`;


const AnswerContent = styled.div`
    display: none;
    padding: 10px 0px;
    background-color: #0000000d;
`;

