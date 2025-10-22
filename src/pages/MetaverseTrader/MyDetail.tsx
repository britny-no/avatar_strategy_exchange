import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useDispatch } from 'react-redux';

import "./detail.css"
import socketService from '@/states/socketAgent/SocketService';
import { useTypedSelector } from '@/states/useTypedSelector';
import {reloadList} from "./AvatarsDetail"
import { deleteTr } from '@/states/reducers/stateReducer';

const Detail = ({setPopup, popup}) => {
    const dispatch = useDispatch();

    const  { email } = useTypedSelector((state) => state.userReducer.data);
    const t3903 = useTypedSelector((state) => state.stateReducer.t3903);
    const t3904 = useTypedSelector((state) => state.stateReducer.t3904);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState(popup)

    useEffect(() => {

        return () => {
            dispatch(deleteTr({ key: `t3904`, data: [] }))
            dispatch(deleteTr({ key: `t3903`, data: [] }))
        }
    }, [])

    useEffect(() => {
        if (loading && t3903) {
            const { flag, data } = t3903.Message;
            switch (flag) {
                case 'E':
                    alert(data);
                    setLoading(false);
                    break;
                case '0':
                    reloadList(email)
                    setPopup(false)
                    alert("신청 완료됐습니다");
                    setLoading(false);
                    break;
                default:
                    alert(data);
            }
        }
    }, [t3903, loading]);

    useEffect(() => {
        if (loading && t3904) {
            const { flag, data } = t3904.Message;
            switch (flag) {
                case 'E':
                    alert(data);
                    setLoading(false);
                    break;
                case '0':
                    reloadList(email)
                    setPopup(false)
                    alert("신청 완료됐습니다");
                    setLoading(false);
                    break;
                default:
                    alert(data);
            }
        }
    }, [t3904, loading]);

    const deleteRow = () => {
        setLoading(true)
        socketService.sendToAgent({
            Header : {
                function : "D",
                termtype : "HTS",
                trcode : "t3904"
            }, 
            Input1 : {
                szStrategy : popup[0],
                szCurNo : popup[1],
                szStrategy_ID : popup[2],
                szUserID : `000${email}`
        }}) 
    }
    
    const changeRow = () => {
        setLoading(true)
        socketService.sendToAgent({
            Header : {
                function : "D",
                termtype : "HTS",
                trcode : "t3903"
            }, 
            Input1 : {
                szStrategy : popup[0],
                szCurNo : popup[1],
                szStrategy_ID : popup[2],
                szUserID : `000${email}`,
                f1st_OrderSu: form[9],
                fNext_Order_Mul : form[10],
                f1st_Tick: form[11],
                fNext_Tick_Mul: form[12],
                nMax_Level: form[13],
                n1Start_Time: form[14],
                n1End_Time: form[15],
                n2Start_Time: form[16],
                n2End_Time: form[17],
                n3Start_Time: form[18],
                n3End_Time: form[19],
                nCommand: form[20],
                szChart_Name: form[21],
                nValue1: form[22],
                nValue2: form[23],
                nValue3: form[24],
                nValue4: form[25],
                nOpen_Value1: form[26],
                nClose_Value1: form[27],
                sz_Dir_Chart_Name: form[28],
                nDir_Value1: form[29],
                nDir_Value2: form[30],
                nDir_Value3: form[31],
                nDir_Value4: form[32],
                nDir_Open_Value1: form[33],
                fMin_Price: form[34],
                fMax_Price: form[35],
                fProfit_Per: form[36],
                fLoss_Per: form[37],
                fProfit: form[38],
                fLoss: form[39]
        }}) 
        dispatch(deleteTr({ key: `t3901`, data: [] }))
    }


    const onChangeHandler = (e) =>{
        const { name, value} = e.target
        form[Number(name)] = value
        setForm([...form])
    }

    return <BackgroundDiv>
        <HeadDiv>
            <CloseSpan onClick={() => setPopup(false)}>x</CloseSpan>
            {localStorage.getItem('mmex_userlevel') === '1' ?  <>
                <ActionButton onClick={deleteRow}>Delete</ActionButton>
                <ActionButton onClick={changeRow}>Save</ActionButton>
            </> : null}
        </HeadDiv>
        <div style={{display: "flex",  flexFlow: "wrap"}}>
            <RootDiv>
                <div className="container">
                    <div className="item"><p>Order Lot</p></div>
                    <div className="item">1st Lot</div>
                    <div className="item"><input value={form[9]} onChange={onChangeHandler} name="9"/></div>
                    <div className="item">Next Lot(Multiple)</div>
                    <div className="item"><input value={form[10]} onChange={onChangeHandler} name="10"/></div>
                </div><br/>
                <div className="container">
                    <div className="item"><p>Tick Distance</p></div>
                    <div className="item">1st Lot</div>
                    <div className="item"><input value={form[11]} onChange={onChangeHandler} name="11"/></div>
                    <div className="item">Next Tick(Multiple)</div>
                    <div className="item"><input value={form[12]} onChange={onChangeHandler} name="12"/></div> 
                </div><br/>
                <div className="container">
                    <div className="item"><p>Level</p></div>
                    <div className="item">Max</div>
                    <div className="item"><input value={form[13]} onChange={onChangeHandler} name="13"/></div>
                </div><br/>
                <div className="container_3">
                    <div className="item"><p>Time</p></div>
                    <div className="item">Start1</div>
                    <div className="item"><input value={form[14]} onChange={onChangeHandler} name="14"/></div> 
                    <div className="item">End1</div>
                    <div className="item"><input value={form[15]} onChange={onChangeHandler} name="15"/></div> 
                    <div className="item">Start2</div>
                    <div className="item"><input value={form[16]} onChange={onChangeHandler} name="16"/></div> 
                    <div className="item">End2</div>
                    <div className="item"><input value={form[17]} onChange={onChangeHandler} name="17"/></div>
                    <div className="item">Start3</div>
                    <div className="item"><input value={form[18]} onChange={onChangeHandler} name="18"/></div>
                    <div className="item">End3</div>
                    <div className="item"><input value={form[19]} onChange={onChangeHandler} name="19"/></div>
                </div><br/>
                <div className="container">
                    <div className="item"><p>Command</p></div>
                    <div className="item"></div>
                    <div className="item">
                        <select value={form[20]} onChange={onChangeHandler} name="20" style={{cursor: "pointer"}}>
                                <option value="0">Pause</option>
                                <option value="1">Close All</option>
                                <option value="2">Stop</option>
                                <option value="3">Both</option>
                                <option value="4">Sell</option>
                                <option value="5">Buy</option>
                            </select> 
                    </div>
                </div><br/>
            </RootDiv>
            <RootDiv>
            <div className="container_2">
                    <div className="item"><p>Technical Chart</p></div>
                    <div className="item">Base</div>
                    <div className="item"><input value={form[21]} onChange={onChangeHandler} name="21"/></div>
                    <div className="item">Base(Constant1)</div>
                    <div className="item"><input value={form[22]} onChange={onChangeHandler} name="22"/></div>
                    <div className="item">Base(Constant2)</div>
                    <div className="item"><input value={form[23]} onChange={onChangeHandler} name="23"/></div>
                    <div className="item">Base(Constant3)</div>
                    <div className="item"><input value={form[24]} onChange={onChangeHandler} name="24"/></div>
                    <div className="item">Base(Constant4)</div>
                    <div className="item"><input value={form[25]} onChange={onChangeHandler} name="25"/></div>
                    <div className="item">Base(Open)</div>
                    <div className="item"><input value={form[26]} onChange={onChangeHandler} name="26"/></div>
                    <div className="item">Base(Close)</div>
                    <div className="item"><input value={form[27]} onChange={onChangeHandler} name="27"/></div>
                    <div className="item">Direction</div>
                    <div className="item"><input value={form[28]} onChange={onChangeHandler} name="28"/></div>
                    <div className="item">Direction(Constant1)</div>
                    <div className="item"><input value={form[29]} onChange={onChangeHandler} name="29"/></div>
                    <div className="item">Direction(Constant2)</div>
                    <div className="item"><input value={form[30]} onChange={onChangeHandler} name="30"/></div>
                    <div className="item">Direction(Constant3)</div>
                    <div className="item"><input value={form[31]} onChange={onChangeHandler} name="31"/></div>
                    <div className="item">Direction(Constant4)</div>
                    <div className="item"><input value={form[32]} onChange={onChangeHandler} name="32"/></div>
                    <div className="item">Direction(Open)</div>
                    <div className="item"><input value={form[33]} onChange={onChangeHandler} name="33"/></div>
                </div><br/>
            

                <div className="container">
                    <div className="item"><p>Price</p></div>
                    <div className="item">Min</div>
                    <div className="item"><input value={form[34]} onChange={onChangeHandler} name="34"/></div>
                    <div className="item">Max</div>
                    <div className="item"><input value={form[35]} onChange={onChangeHandler} name="35"/></div>
                </div><br/>

                <div className="container_4">
                    <div className="item"><p>P&L</p></div>
                    <div className="item">Profit(%)</div>
                    <div className="item"><input value={form[36]} onChange={onChangeHandler} name="36"/></div>
                    <div className="item">Loss(%)</div>
                    <div className="item"><input value={form[37]} onChange={onChangeHandler} name="37"/></div>
                    <div className="item">Profit(Point)</div>
                    <div className="item"><input value={form[38]} onChange={onChangeHandler} name="38"/></div>
                    <div className="item">Loss(%)</div>
                    <div className="item"><input value={form[39]} onChange={onChangeHandler} name="39"/></div>
                </div>
            </RootDiv>
        <br/>
        </div>
    </BackgroundDiv>
}

export default Detail

const BackgroundDiv = styled.div`
    width: 100%;
    height: 100%;
    background: white;
`

const HeadDiv = styled.div`
    height:30px;
    padding: 0 4px;
    margin-bottom:10px;
`

const CloseSpan = styled.span`
    font-size: 20px;
    cursor: pointer;
`

const ActionButton = styled.button`
    width: 50px;
    height: 25px;
    float: right;
    margin: 0 6px;
`

const RootDiv = styled.table`
    @media (max-width: 600px) {
        width: 100%;
    }

    @media (min-width: 600px) {
        width: 48%;
        margin-right: 6px;
    }
`