import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled, { css } from 'styled-components';
import {
    Box,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel
} from "@mui/material"
import { useTranslation } from "react-i18next";


import useAgentToSend from '@/hooks/useAgentToSend';
import { useDispatch, useSelector } from 'react-redux';
import { buildInputForStopLimit, buildInputForMarket } from './util';
// import * as TRANSLATOR from '@/Translator/OrderTab';
import * as CONST from '@/constants/OrderTab';
import ButtonInput from '../../../common/ButtonInput';
import { consoleLogWithColor, consoleWarnWithColor } from '../common/consoleWithColor';
import useUsersData from '@/hooks/useUserData';
import useSymbolList from '@/hooks/useSymbolList';
import socketService from '@/states/socketAgent/SocketService';
import { reset } from '@/states/reducers/orderReducer';
import useScreenSize from '@/hooks/useScreenSize';
import useNinetyOneInterval from '@/hooks/useNinetyOneInterval';
import {formatSymbolLiveData} from '@/lib/formatSymbol';
import unformatNumber from '@/lib/unformatNumber';
import { useTypedSelector } from '@/states/useTypedSelector';

const borderBottomStyle = {
    borderBottom: '1px solid #33353B',
};

const fontBold = {
    fontWeight: 'bold',
};

const paddingRightSix = {
    paddingRight: '6px',
};
const paddingRightEight = {
    paddingRight: '8px',
};

const colorGrey = {
    color: '#E56060',
};


const StopLimitForm = ({ language }) => {
    const orderReducerState = useTypedSelector((state) => state.orderReducer);

    const { t } = useTranslation()
    const dispatch = useDispatch();
    const {isMobile} = useScreenSize();
    const STOP_LIMIT_FORM_INDEX =  isMobile ? 2 : 1;
    const [inputRef, setInputRef] = useState<{
        fOrderSu: number;
        fOrderPrice: number;
        stopOrLimitPrice: number;
    }>();
    const [sumError, setSumError] = useState();
    const [stopPriceError, setStopPriceError] = useState<string>();
    const [limitPriceError, setLimitPriceError] = useState<string>();
    const [resultMsg, setResultMsg] = useState('');
    const [isActive, setIsActive] = useState(false);

    const { result, sendTransaction } = useAgentToSend();
    const { szPasswd, szAccNo, email, jwt } = useUsersData();

    const { data, stopOrLimitOrMarket, index,  } = orderReducerState;
    const { szRate, fLot, szQuote, szCurNo, szDealDiv, szCustItem } = data;
    const decimalCnt =  szRate &&  String(szRate).split('.')[1] ? String(szRate).split('.')[1].length : 0;

    const { symbolsInObjectForm: symbols } = useSymbolList();
    const { lastElement } = useNinetyOneInterval(String(symbols[(szCurNo || 'BTCUSDT').trim()]?.CUR_NO));
    // const { close } = szCurNo ? useLatestSymbolInfo({
    //     symbolInfo: symbols[(szCurNo || '').trim()],
    // }) : { close: 0 };
    //
    // console.log('JW szCurNo', symbols[(szCurNo || '').trim()])

    useEffect(() => {
        setInputRef({
            fOrderSu: fLot,
            fOrderPrice: szRate,
            stopOrLimitPrice: szRate,
        });
        setIsActive(
          szRate !== undefined &&
          fLot !== undefined &&
          szCurNo !== undefined &&
          szDealDiv !== undefined &&
          szCustItem !== undefined &&
          index === STOP_LIMIT_FORM_INDEX
            ? true
            : false,
        );
        setResultMsg('');
    }, [orderReducerState]);

    useEffect(() => {
        if (result?.Message?.data) {
            setResultMsg(result.Message.data);
            setIsActive(false);
            // setInputRef({});
        }

    }, [result?.Message?.data]);

    const callT3602 = () => {
        const init = {
            Header : {
                function : "D",
                termtype : "HTS",
                trcode : "t3602"
            },
            Input1 : {
                szAccNo,
            }
        };
        socketService.sendToAgent(init);
    };

    // Incomplete
    const handleValidation = () => {
        let isValid = true;

        const { close } = formatSymbolLiveData(
          lastElement,
          decimalCnt,
        );

        const szClose = unformatNumber(String(close || '0'));

        // if (false && !inputRef.fOrderPrice) {
        //   setEntryPriceError("가격을 확인해주세요");
        //   isValid = false;
        // }
        // if (false && !inputRef.fOrderSu) {
        //   setSumError("수량을 확인해주세요");
        //   isValid = false;
        // }

        if(szDealDiv === "079") {
            if (stopOrLimitOrMarket === CONST.STOP && inputRef.stopOrLimitPrice >= szClose) {
                setStopPriceError(t("trade:price_error"));
                isValid = false;
            }
            if (stopOrLimitOrMarket === CONST.LIMIT && inputRef.stopOrLimitPrice <= szClose) {
                setLimitPriceError(t("trade:price_error"));
                isValid = false;
            }
        }
        if(szDealDiv === '081') {
            if (stopOrLimitOrMarket === CONST.STOP && inputRef.stopOrLimitPrice <= szClose) {
                setStopPriceError(t("trade:price_error"));
                isValid = false;
            }
            if (stopOrLimitOrMarket === CONST.LIMIT && inputRef.stopOrLimitPrice >= szClose) {
                setLimitPriceError(t("trade:price_error"));
                isValid = false;
            }
        }
        return isValid;
    };

    const handleMarket = () => {
        if (!isActive) return;
        const inputToSend = buildInputForMarket({
            fOrderPrice: inputRef.fOrderPrice,
            fOrderSu: inputRef.fOrderSu,
            szAccNo: szAccNo,
            szPasswd: szPasswd,
            szOrdType: CONST.UCM,
            szDealDiv,
            szCurNo,
            szSLCustItem: szCustItem,
            jwt,
            email,
        });
        // build transaction input and send
        consoleLogWithColor(`유저가 시장가청산 주문을 클릭했습니다 Input은 `, inputToSend);

        console.log('szQuote : ', szQuote)

        if(handleValidation()){
            sendTransaction(inputToSend); 
            callT3602();
        }
        dispatch(reset());

    };

    const handleStopLimit = () => {
        if (!isActive) return handleInactivity();
        setResultMsg('');
        const inputToSend = buildInputForStopLimit({
            stopOrLimitPrice: inputRef.stopOrLimitPrice,
            stopOrLimitPriceKey: stopOrLimitOrMarket === CONST.STOP ? CONST.STOP_PRICE : CONST.LIMIT_PRICE,
            fOrderPrice: inputRef.fOrderPrice,
            fOrderSu: inputRef.fOrderSu,
            szAccNo,
            szPasswd: szPasswd,
            szOrdType: stopOrLimitOrMarket === CONST.STOP ? CONST.UCES : CONST.UCEL,
            szDealDiv,
            szCurNo,
            szSLCustItem: szCustItem,
            email,
            jwt,
        });
        // build transaction input and send
        consoleLogWithColor(`유저가 ${stopOrLimitOrMarket} 주문을 클릭했습니다 Input은`, inputToSend);
        
        if(handleValidation()){
            sendTransaction(inputToSend); 
            callT3602();
        }

        dispatch(reset());
    };

    const resetErrorMsg = (target) => {
        // if (target === CONST.TARGET_AMOUNT) {
        //     setSumError();
        // } else if (target === CONST.TARGET_PRICE) {
        //     // setEntryPriceError();
        // } else if (stopOrLimitOrMarket === CONST.STOP) {
        //     setStopPriceError();
        // } else if (stopOrLimitOrMarket === CONST.LIMIT) {
        //     setLimitPriceError();
        // }
    };

    const handleChange = (target, value) => {
        if (target === CONST.TARGET_PRICE) {
            return;
        }
        resetErrorMsg(target);
        setInputRef({
            ...inputRef,
            [target]: value,
        });
    };

    const handleInactivity = () => {
        consoleWarnWithColor(
          '주문이 다음과 같은 이유로 불가능합니다 : 비로그인, 미체결내역 혹은 종목잔고에서 정정/취소하고자 하는 항목 미선택',
        );
    };

    const getTextForPrice = () => {
        switch (stopOrLimitOrMarket) {
            case CONST.STOP:
                return t("trade:s_price") + '(USDT)';
            case CONST.LIMIT:
                return t("trade:l_price") + '(USDT)';
            case CONST.MARKET:
                return t("trade:price") + '(USDT)';
            default:
                return t("trade:price") + '(USDT)';
        }
    };

    return (
      <NewOrderWrapper>
          <Box justifyContent="space-between" style={borderBottomStyle}>
              <div style={{ ...fontBold, fontSize: 16 }}>{szCurNo ? szCurNo : t("trade:not_selected")}</div>
              <Flex>
              </Flex>
          </Box>

          <Box>
              <RadioGroup>
                  <Box>
                      <StFormControlLabel
                        value={CONST.UOE}
                        control={<Radio />}
                        label={t("trade:stop")}
                        checked={stopOrLimitOrMarket === CONST.STOP && true}
                      />
                      <StFormControlLabel
                        value={CONST.UOM}
                        control={<Radio />}
                        label={t("trade:limit")}
                        checked={stopOrLimitOrMarket === CONST.LIMIT && true}
                      />
                      <StFormControlLabel
                        value={CONST.UOM}
                        control={<Radio />}
                        label={t("trade:market")}
                        checked={stopOrLimitOrMarket === CONST.MARKET && true}
                      />
                  </Box>
              </RadioGroup>
          </Box>
          <Box style={{ position: 'relative' }}>
              <Box alignItems="center" justifyContent="space-between" style={{display: 'flex'}}>
                  <div>{getTextForPrice()}</div>
                  {stopOrLimitOrMarket === CONST.MARKET ? (
                    <ButtonInput
                      target={CONST.TARGET_PRICE}
                      disabled={!isActive}
                      decimalCnt={decimalCnt}
                      handleChange={handleChange}
                      initialValue={inputRef && inputRef.fOrderPrice ? inputRef.fOrderPrice : 0}
                    />
                  ) : (
                    <ButtonInput
                      target={'stopOrLimitPrice'}
                      disabled={!isActive}
                      decimalCnt={decimalCnt}
                      handleChange={handleChange}
                      initialValue={inputRef && inputRef.stopOrLimitPrice ? inputRef.stopOrLimitPrice : 0}
                    />
                  )}
              </Box>
              <ErrorMsg>{stopOrLimitOrMarket === CONST.STOP ? stopPriceError : limitPriceError}</ErrorMsg>
          </Box>
          <Box style={{ ...borderBottomStyle, padding: '14px 0 25px 0' }}>
              <Box alignItems="center" justifyContent="space-between" style={{display: 'flex'}}>
                  <div>{t("trade:amount")}</div>
                  <ButtonInput
                    target={CONST.TARGET_AMOUNT}
                    handleChange={handleChange}
                    disabled={!isActive}
                    initialValue={inputRef && inputRef.fOrderSu ? inputRef.fOrderSu : 0}
                  />
              </Box>
              <ErrorMsg>{sumError}</ErrorMsg>
          </Box>

          <Box justifyContent="space-between" style={{ opacity: '0' }}>
              <div>Order Value</div>
              <Flex>
                  <div style={{ ...paddingRightSix, ...fontBold }}>0</div>
                  <div>BTC</div>
              </Flex>
          </Box>
          {/* <Box justifyContent="space-between " style={{ opacity: '0' }}>
              <div>Available margin</div>
              <Flex>
                  <div style={{ ...paddingRightSix, ...fontBold }}>0</div>
                  <div>BTC</div>
              </Flex>
          </Box> */}
          {/* <div style={{ height: 15, position: 'relative', padding: 0 }}>
              <ResultMsg>{resultMsg}</ResultMsg>
          </div> */}

          <Box justifyContent="space-between">
              <OrderButton
                variant="contained"
                onClick={stopOrLimitOrMarket === CONST.MARKET ? handleMarket : handleStopLimit}
              >
                  {/* get text for order button */}
                  {(() => {
                      switch (stopOrLimitOrMarket) {
                          case CONST.MARKET:
                              return t("trade:market")
                          case CONST.STOP:
                              return t("trade:set_stop")
                          case CONST.LIMIT:
                              return t("trade:set_limit");
                          default:
                              return t("trade:market");
                      }
                  })()}
              </OrderButton>
          </Box>
      </NewOrderWrapper>
    );
};

export default React.memo(StopLimitForm);

const Flex = styled.div`
    display: flex;
    align-items: center;
`;

const NewOrderWrapper = styled.div`
    height: ${({ theme }) => theme.orderTabMenu.height};
    font-size: ${({ theme }) => theme.fontSizes.content};
    padding: ${({ theme }) => theme.orderTabMenu.containerPadding};
    color: ${({ theme }) => theme.colors.normalTextColor};
    & > div {
        padding: ${({ theme }) => theme.orderTabMenu.divPadding};
    }
`;

const StFormControlLabel = styled(FormControlLabel)`
    color: ${({ theme }) => theme.colors.normalTextColor} !important;
    span {
        font-size: 14px !important;
    }
    span:first-child {
        color: ${({ theme }) => theme.colors.orange} !important;
    }
`;

const BaseButton = styled(Button)`
    /* width: 43%; */
    height: 40px;
    font-size: ${({ theme }) => theme.fontSizes.content} !important;
    border-radius: 2px !important;
    font-weight: 700 !important;
    width: 370px;
    text-align: center;
`;
const OrderButton = styled(BaseButton)`
    background: ${({ theme }) => theme.colors.orange} !important;
    color: ${({ theme }) => theme.colors.normalTextColor} !important;
    text-transform: none;
`;

const ErrorMsg = styled.span`
    position: absolute;
    bottom: -7px;
    color: red;
    font-size: 14px;
`;

const ResultMsg = styled.div`
    position: absolute;
    /* bottom: -7px; */
    color: #3883e6;
    font-size: 14px;
`;
