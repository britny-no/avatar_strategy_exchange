import React, {useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {format} from 'date-fns';
import {useLocation} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import TradingHistory from '@/components/client/TradeHistory';
import useData from '@/components/client/TradeHistory/useData';
import WALLET_HERO_BACKGROUND from '@/assets/wallet/bg@2x.png';
import socketService from '@/states/socketAgent/SocketService';
import {useTypedSelector} from '@/states/useTypedSelector';
import { deleteTr } from '@/states/reducers/stateReducer';


interface LocationState {
  sub_path: string;
  szAccNo: string
  locationCoin: undefined | string;
  depositWithdraw: undefined | string;
}

const Hero = () => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {szAccNo} = useTypedSelector(state => state.userReducer.data);
  const t3608 = useTypedSelector((state) => state.stateReducer.t3608);
  const t3612 = useTypedSelector((state) => state.stateReducer.t3612);
  const t3634 = useTypedSelector((state) => state.stateReducer.t3634);
  const location = useLocation();
  const {sub_path} =  location.state;

  // console.log(t3634)
  const [unrealizedProfit, setUnrealizedProfit] = useState(0);
  const [fromDate, setSelectedFromDate] = React.useState<Date | null>(new Date(moment().format('YYYY-MM-DD')));
  const [toDate, setSelectedToDate] = React.useState<Date | null>(new Date(moment().format('YYYY-MM-DD')));
  const [_fromDate, setFromDate] = React.useState<Date | null>(fromDate);
  const [_toDate, setToDate] = React.useState<Date | null>(toDate);
  const [openDate, setOpenDate] = useState(false);
  const [closeArr, setCloseArr] = useState([0,0]); 

  const dateToNumber = (date) => {
    if(!date) return undefined;
    const formattedDate = format(date, 'yyyyMMdd');
    return +formattedDate;
  };

  const { data: tradingHistoryData, dataColumn } = useData({
    date: {fromDate: dateToNumber(fromDate), toDate: dateToNumber(toDate)}, subPath: sub_path
  });
  if (!t3608) {
    const info = {
      Header: {
        function: 'D',
        termtype: 'HTS',
        trcode: 't3608'
      },
      Input1: {
        szAccNo: szAccNo
      }
    };
    socketService.sendToAgent(info);
  }

  const handleClickDate = () => {
    setOpenDate(true);
  }

  const handleDateChange = (key: 'from' | 'to', date: Date | null) => {
    setFromDate(date);
    setToDate(date);
    setOpenDate(false);
  };

  useEffect(() => {
    searchCloseValue(_toDate)

    return  () => {
        dispatch(deleteTr({ key: `t3634`, data: null }))
    }
  }, [])

  useEffect(() => {
    if(t3634 && t3634.Output1){
      setCloseArr([t3634.Output1.nCloseCnt, t3634.Output1.nPosCnt])
    }
  }, [t3634])

  useEffect(() => {
    if (t3608 && t3608.Output2) {
      setUnrealizedProfit(Math.round(t3608.Output2[0][6] * 100) / 100);
    }
  }, [t3608]);


  const callT3612 = (more = false) => {

    setSelectedFromDate(null);
    setSelectedToDate(null);
    searchCloseValue(_toDate)

    setTimeout(() => {
      setSelectedFromDate(_fromDate);
      setSelectedToDate(_toDate);
    }, 100);
  };

  const searchCloseValue = (date: Date | null) => {
    socketService.sendToAgent({
      "Header" : {
        "function" : "D", "termtype" : "HTS", "trcode" : "t3644"},
      "Input1" : {"szAccNo" :  szAccNo, "nDate" :  moment(fromDate).format('YYYYMMDD'), "ToDate" : moment(toDate).format('YYYYMMDD'),  "con_key" : ""}}
      );
  }



  return (
    <HeroWrap>
      <div className="background">
        <img src={WALLET_HERO_BACKGROUND} alt="background" />
      </div>
      <ContentHead>
        <p className="title">{t("executionList:order_execution_detail")}</p>
        <WalletInfoDiv>
          <div className="flex_div" id="hero">

            <div className="flex_div_child_text">
              <span className="wallet_info_title">{t("executionList:unrealized_profit_less")}</span>
              <span className="wallet_info_content">{unrealizedProfit} <span
                className="wallet_info_coin_unit">USDT</span></span>
            </div>

            <div className="flex_div_child_text">
              <span className="wallet_info_title">{t("executionList:account")}</span>
              <span className="wallet_info_content">{szAccNo}</span>
            </div>
            <div className="flex_div_child_button">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  format="yyyy/MM/dd"
                  label={t("executionList:date")}
                  value={_toDate}
                  onChange={(date) => handleDateChange('to', date)}
                />
              </LocalizationProvider>
              <InqueryButton className="wallet_info_button" onClick={() => callT3612()}>{t("executionList:inquery")}</InqueryButton>
            </div>
          </div>
        </WalletInfoDiv>
      </ContentHead>
      <ContentBody>
        <HistoryBox>
          <TradingHistory tradingHistoryData={tradingHistoryData} dataColumn={dataColumn} />
        </HistoryBox>
      </ContentBody>
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

    @media (max-width: 600px){
        padding: 0px 16px 0px;
    }

    @media (min-width: 600px){
        max-width: 1300px;
        padding: 70px 50px 0px;
    }

    &> .title {
        margin-bottom: 30px;
        font-weight: bold;
        font-size: 34px;
        line-height: 46px;
        color: #ffffff;
    }
`;

const WalletInfoDiv = styled.div`
    @media (max-width: 900px){
        margin-bottom:16px;
    }

    @media (min-width: 900px){
        margin-bottom:24px;
        height: 148px;
    }
    width: 100%;
    background: rgba(255, 255, 255, 0.22);
    border-radius: 4px;
    & .flex_div{
        display: flex;
        align-content: center;
        margin:  10px;
        padding: 10px;
        height: 100%;
        flex-flow: wrap;
        & .flex_div_child_text{
            margin: 10px 10px 0px 10px;
            width: 20%;
            height: 70px;
            min-width: 190px;
            display: flex;
            flex-direction: column;
            & .wallet_info_title {
                color: #FFAB2E;
            }
    
            & .wallet_info_content{
                display: inline-block;
                margin-top: 13px;
                color: #FFFFFF;
                font-family: Lato;
                font-style: normal;
                font-weight: bold;
                font-size: 24px;
                line-height: 29px;
            }  
    
            & .wallet_info_coin_unit{
                font-family: Noto Sans;
                font-style: normal;
                font-weight: 500;
                font-size: 16px;
                line-height: 22px;
                color: #CACACA;
            }
        }
        
        .MuiFormControl-root{
          .MuiFormLabel-root{ 
            color:#fff;
            font-size:14px;
          }
          .MuiInputBase-root{
            width:214px;
            &::before{ border-bottom: 1px solid #fff; }
           
            .MuiInputBase-input{
              color:#fff;
              font-size:15px;
            }
            .MuiSvgIcon-root{ fill:#fff; }
          }
        }

        & .flex_div_child_button{
            display: flex;
            justify-content: end;
            margin: 10px 10px 0px 10px;
            width: 51%;
            height: 80px;
            min-width: 320px;

            & .wallet_coin_symbol{
                margin: auto 0;
            }
        }
    }
`;

const InqueryButton = styled.button`
    @media (max-width: 900px){
        width: 100px;
        height: 30px;
        margin: 24px auto auto 4px;
    }

    @media (min-width: 900px){
        width: 130px;
        height: 50px;
        padding: 12px 33px;
        margin: auto 30px;
    }

    background-color: transparent;
    cursor: pointer;
    color: #FFFFFF;
    border: 1px solid #FFFFFF;
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
    background: #ffffff;
  
    @media (max-width: 600px){
        padding: 10px 0px 0px;
    }

    @media (min-width: 600px){
        padding: 20px 50px 70px;
    }

    &> .title {
        margin-bottom: 30px;
        font-weight: bold;
        font-size: 34px;
        line-height: 46px;
        color: #ffffff;
    }
`;

const SummaryBox = styled.div`
  max-width: 1200px;
  margin: 10px auto;
  width: auto;
  height: auto;
`
const HistoryBox = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: auto;
  height: auto;
  background: #030B14;
  >div{
    max-width:100% !important;
  }
`;
