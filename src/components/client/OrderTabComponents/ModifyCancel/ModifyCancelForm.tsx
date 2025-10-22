import React, { useState, useEffect } from 'react';
import styled from 'styled-components';;
import {
    Box,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel
} from "@mui/material"
import { useTranslation } from "react-i18next";

import useAgentToSend from '../../../../hooks/useAgentToSend';
import { buildInputForModifyCancelEntry, buildInputForModifyCancelStopLimit } from '../common/InputBuilder';
// import * as TRANSLATOR from '../../../../Translator/OrderTab';
import * as CONST from '../../../../constants/OrderTab';
import ButtonInput from '../../../common/ButtonInput';
import { consoleLogWithColor, consoleWarnWithColor } from '../common/consoleWithColor';
import formatNumber from '../../../../lib/formatNumber';
import unformatNumber from '../../../../lib/unformatNumber';
import { useTypedSelector } from '../../../../states/useTypedSelector';
import { TransactionInputType } from '../../../../types';
import { useDispatch } from 'react-redux';
import { reset } from '../../../../states/reducers/orderReducer';
import useScreenSize from '../../../../hooks/useScreenSize';
import socketService from '../../../../states/socketAgent/SocketService';
import useSymbolList from '../../../../hooks/useSymbolList';
import {formatSymbolLiveData} from '../../../../lib/formatSymbol';
import useNinetyOneInterval from '../../../../hooks/useNinetyOneInterval';

const borderBottomStyle = {
    borderBottom: '1px solid #33353B',
};

const fontBold: React.CSSProperties = {
    fontWeight: 'bold',
};

const paddingRightSix: React.CSSProperties = {
    paddingRight: '6px',
};
const paddingRightEight: React.CSSProperties = {
    paddingRight: '8px',
};

const colorGrey: React.CSSProperties = {
    color: '#E56060',
};

const ModifyCancelForm = ({ language }) => {
    const { t } = useTranslation()
    const {isMobile} = useScreenSize();
    const MODIFY_CANCEL_FORM_INDEX = isMobile ? 4 : 2;
    const orderReducerState = useTypedSelector((state) => state.orderReducer);
    const { szAccNo, szPasswd, email, jwt } = useTypedSelector((state) => state.userReducer.data);
    const dispatch = useDispatch();
    const { result, sendTransaction } = useAgentToSend();

    // Input value needed for submission
    //szAccNo
    //szPasswd
    //szCurNo
    //fOrderSu <=fLot
    //fOrderPrice <= szRate
    //szDealDiv <= szSide
    //szSLCustItem <= szCustItem
    const { triggeredBy, stopOrLimit, data, index } = orderReducerState;
    const { szRate, fLot, szQuote, szCurNo, szDealDiv, szCustItem, szSLCustItem, stopOrLimitPrice } = data;

    const { symbolsInObjectForm: symbols } = useSymbolList();
    const { lastElement } = useNinetyOneInterval(String(symbols[(szCurNo || 'BTCUSDT').trim()]?.CUR_NO));


    const decimalCnt =  szRate &&  String(szRate).split('.')[1] ? String(szRate).split('.')[1].length : 0;
    const orderTabIndex = isMobile ? index + 1 :  index;
    // const { triggeredBy } = data;
    const [inputRef, setInputRef] = useState({
        fOrderPrice: 0,
        fOrderSu: 0,
        stopOrLimitPrice: 0,
    });
    const [resultMsg, setResultMsg] = useState<string>('');
    const [sumError, setSumError] = useState<string>('');
    const [entryPriceError, setEntryPriceError] = useState<string>('');
    const [stopPriceError, setStopPriceError] = useState<string>('');
    const [limitPriceError, setLimitPriceError] = useState<string>('');

    const isActive =
        szRate !== undefined &&
        fLot !== undefined &&
        szCurNo !== undefined &&
        szDealDiv !== undefined &&
        szCustItem !== undefined &&
        szAccNo !== undefined &&
        szPasswd !== undefined &&
        orderTabIndex === MODIFY_CANCEL_FORM_INDEX
            ? true
            : false;

    useEffect(() => {
        if (result?.Message?.data) {
            setResultMsg(result.Message.data);
        }
    }, [result?.Message?.data]);

    useEffect(() => {
        setSumError('');
        setStopPriceError('');
        setLimitPriceError('');
        setEntryPriceError('');
        setInputRef({
            ...inputRef,
            fOrderSu: fLot,
            fOrderPrice: szRate,
            stopOrLimitPrice,
        });
        setResultMsg('');
    }, [orderReducerState]);

    // Incomplete
    const handleValidation = () => {
        let isValid = true;

        const { close } = formatSymbolLiveData(
          lastElement,
          decimalCnt,
        );

        const szClose = unformatNumber(String(close || '0'));

        if (!isActive) {
            setResultMsg(t("trade:modify_cancel_target_unselected"));
        }

        if (inputRef.fOrderPrice === 0 || isNaN(inputRef.fOrderPrice)) {
            setEntryPriceError(t("trade:price_error"));
            isValid = false;
        }
        if (inputRef.fOrderSu === 0 || isNaN(inputRef.fOrderSu)) {
            setSumError(t("trade:amount_error"));
            isValid = false;
        }

        if(szDealDiv === "079") {
            if (stopOrLimit === CONST.STOP && inputRef.stopOrLimitPrice >= szClose) {
                setStopPriceError(t("trade:price_error"));
                isValid = false;
            }
            if (stopOrLimit === (CONST.LIMIT as string) && inputRef.stopOrLimitPrice <= szClose) {
                setLimitPriceError(t("trade:price_error"));
                isValid = false;
            }
        }
        if(szDealDiv === '081') {
            if (stopOrLimit === CONST.STOP && inputRef.stopOrLimitPrice <= szClose) {
                setStopPriceError(t("trade:price_error"));
                isValid = false;
            }
            if (stopOrLimit === (CONST.LIMIT as string) && inputRef.stopOrLimitPrice >= szClose) {
                setLimitPriceError(t("trade:price_error"));
                isValid = false;
            }
        }
        // if (stopOrLimit === CONST.STOP && inputRef.stopOrLimitPrice >= inputRef.fOrderPrice) {
        //     setStopPriceError(TRANSLATOR.STOP_PRICE_ERROR(language));
        //     isValid = false;
        // }
        // if (stopOrLimit === (CONST.LIMIT as string) && inputRef.stopOrLimitPrice <= inputRef.fOrderPrice) {
        //     setLimitPriceError(TRANSLATOR.LIMIT_PRICE_ERROR(language));
        //     isValid = false;
        // }

        return isValid;
    };

    const handleModifyCancelStopLimit = ({ szOrdType, cModType }) => () => {
        if (!isActive) return handleInactivity();
        const inputToSend = buildInputForModifyCancelStopLimit({
            stopOrLimitPrice: inputRef.stopOrLimitPrice,
            stopOrLimitPriceKey: stopOrLimit === CONST.STOP ? CONST.STOP_PRICE : CONST.LIMIT_PRICE,
            fOrderPrice: inputRef.fOrderPrice,
            fOrderSu: inputRef.fOrderSu,
            szAccNo,
            szPasswd,
            szOrdType,
            szDealDiv,
            szCurNo,
            szSLCustItem: szSLCustItem,
            szOrgCustItem: szCustItem,
            cModType,
            email,
            jwt,
        });
        // build transaction input and send
        consoleLogWithColor(
            `유저가 ${
                cModType === '0' ? `${stopOrLimit} 정정` : cModType === '1' ? `${stopOrLimit} 취소` : 'error'
            }을 주문을 클릭했습니다 Input은 `,
            inputToSend,
        );

        handleValidation() && sendTransaction(inputToSend as TransactionInputType);
    };

    const handleModifyCancelEntry = ({ szOrdType, cModType }) => () => {
        if (!isActive) return handleInactivity();
        const inputToSend = buildInputForModifyCancelEntry({
            fOrderPrice: inputRef.fOrderPrice,
            fOrderSu: inputRef.fOrderSu,
            szAccNo,
            szPasswd,
            szOrdType,
            szDealDiv,
            szCurNo,
            szCustItem,
            cModType,
            email,
            jwt,
        });
        // build transaction input and send
        consoleLogWithColor(
            `유저가 ${
                cModType === '7' ? '지정가 정정' : cModType === '8' ? '지정가 취소' : 'error'
            }을 주문했습니다 Input은 `,
            inputToSend,
        );
        handleValidation() && sendTransaction(inputToSend as TransactionInputType);

        dispatch(reset());
        const input = {
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't3600',
            },
            Input1: {
                szAccNo,
            },
        };
        socketService.sendToAgent(input);
    };

    const resetErrorMsg = (target) => {
        if (target === CONST.TARGET_AMOUNT) {
            setSumError('');
        } else if (target === CONST.TARGET_PRICE) {
            setEntryPriceError('');
        } else if (stopOrLimit === CONST.STOP) {
            setStopPriceError('');
        } else if (stopOrLimit === (CONST.LIMIT as string)) {
            setLimitPriceError('');
        }
    };

    const handleChange = (target, value) => {
        resetErrorMsg(target);
        setInputRef({
            ...inputRef,
            [target]: value,
        });
    };

    const handleInactivity = () => {
        consoleWarnWithColor(
            '정정/취소가 다음과 같은 이유로 불가능합니다 : 비로그인, 미체결내역 혹은 종목잔고에서 정정/취소하고자 하는 항목 미선택',
        );
    };

    const getTextForPrice = () => {
        switch (triggeredBy) {
            case CONST.OPEN_ORDERS:
                return t("trade:price") + '(USDT)';
            case CONST.OPEN_POSITIONS:
                return stopOrLimit === CONST.STOP
                    ? t("trade:s_price") + '(USDT)'
                    : t("trade:l_price") + '(USDT)';
            default:
                return t("trade:price") + '(USDT)';
        }
    };

    const getLeftButtonText = () => {
        switch (triggeredBy) {
            case CONST.OPEN_ORDERS:
                return t("trade:m_order_modify");
            case CONST.OPEN_POSITIONS:
                return stopOrLimit === CONST.STOP
                    ? t("trade:stop_modify")
                    : t("trade:limit_modify")
            default:
                return t("trade:m_order_modify");
        }
    };
    const getRightButtonText = () => {
        switch (triggeredBy) {
            case CONST.OPEN_ORDERS:
                return t("trade:m_order_cancel");
            case CONST.OPEN_POSITIONS:
                return stopOrLimit === CONST.STOP
                    ? t("trade:stop_cancel")
                    : t("trade:limit_cancel")
            default:
                return t("trade:m_order_cancel")
        }
    };

    const getTotalOrderPrice = (isForAvailableMargin) => {
        if (
            isNaN(
                triggeredBy === CONST.OPEN_POSITIONS
                    ? inputRef.stopOrLimitPrice * inputRef.fOrderSu
                    : inputRef.fOrderPrice * inputRef.fOrderSu,
            )
        ) {
            return 0;
        }

        const multiplyBy = isForAvailableMargin ? 0.1 : 1;
        switch (triggeredBy) {
            case CONST.OPEN_ORDERS:
                return formatNumber(inputRef.fOrderPrice * inputRef.fOrderSu * multiplyBy);
            case CONST.OPEN_POSITIONS:
                return formatNumber(inputRef.stopOrLimitPrice * inputRef.fOrderSu * multiplyBy);
            default:
                return 0;
        }
    };

    const getErrorMessage = () => {
        switch (triggeredBy) {
            case CONST.OPEN_ORDERS:
                return entryPriceError;
            case CONST.OPEN_POSITIONS:
                return stopOrLimit === CONST.STOP ? stopPriceError : limitPriceError;
            default:
                return null;
        }
    };

    const getClickEventForModify = () => {
        switch (triggeredBy) {
            case CONST.OPEN_ORDERS:
                return handleModifyCancelEntry({
                    szOrdType: CONST.URE,
                    cModType: '7',
                });
            case CONST.OPEN_POSITIONS:
                return handleModifyCancelStopLimit({
                    szOrdType: stopOrLimit === CONST.STOP ? CONST.UCES : CONST.UCEL,
                    cModType: '0',
                });
            default:
                return handleInactivity;
        }
    };

    const getClickEventForCancel = () => {
        switch (triggeredBy) {
            case CONST.OPEN_ORDERS:
                return handleModifyCancelEntry({
                    szOrdType: CONST.UODE,
                    cModType: '8',
                });
            case CONST.OPEN_POSITIONS:
                return handleModifyCancelStopLimit({
                    szOrdType: stopOrLimit === CONST.STOP ? CONST.UCES : CONST.UCEL,
                    cModType: '1',
                });
            default:
                return handleInactivity;
        }
    };

    return (
        <NewOrderWrapper>
            <Box justifyContent="space-between" style={borderBottomStyle}>
                <div style={{ ...fontBold, fontSize: 16 }}>{szCurNo ? szCurNo : t("trade:not_selected")}</div>
            </Box>

            <Box>
                <RadioGroup>
                    <Box>
                        <StFormControlLabel
                            value={CONST.UOE}
                            control={<Radio />}
                            label={t("trade:limit_order")}
                            checked={triggeredBy === CONST.OPEN_ORDERS ? true : false}
                        />
                        <StFormControlLabel
                            value={CONST.UOM}
                            control={<Radio />}
                            label={t("trade:stop")}
                            checked={triggeredBy === CONST.OPEN_POSITIONS && stopOrLimit === CONST.STOP ? true : false}
                        />
                        <StFormControlLabel
                            value={CONST.UOM}
                            control={<Radio />}
                            label={t("trade:limit")}
                            checked={
                                triggeredBy === CONST.OPEN_POSITIONS && (stopOrLimit as string) === CONST.LIMIT
                                    ? true
                                    : false
                            }
                        />
                    </Box>
                </RadioGroup>
            </Box>

            <Box flexDirection="column" style={{ position: 'relative' }}>
                <Box alignItems="center" justifyContent="space-between" style={{ display: 'flex' }}>
                    <div>{getTextForPrice()}</div>
                    <ButtonInput
                        target={
                            triggeredBy === CONST.OPEN_ORDERS
                                ? CONST.TARGET_PRICE
                                : triggeredBy === CONST.OPEN_POSITIONS
                                ? 'stopOrLimitPrice'
                                : undefined
                        }
                        disabled={!isActive}
                        initialValue={
                            triggeredBy === CONST.OPEN_ORDERS
                                ? inputRef[CONST.TARGET_PRICE]
                                : triggeredBy === CONST.OPEN_POSITIONS
                                ? inputRef.stopOrLimitPrice
                                : 0
                        }
                        decimalCnt={decimalCnt}
                        handleChange={handleChange}
                    />
                </Box>
                <ErrorMsg>{getErrorMessage()}</ErrorMsg>
                <Box
                    justifyContent="flex-end"
                    style={{ padding: 0, position: 'absolute', top: '80%', right: '6%' }}
                >
                </Box>
            </Box>

            <Box
                flexDirection="column"
                style={{ position: 'relative', ...borderBottomStyle, padding: '14px 0 25px 0' }}
            >
                <Box alignItems="center" justifyContent="space-between" style={{ display: 'flex' }}>
                    <div>{t("trade:amount")}</div>
                    <ButtonInput
                        target={CONST.TARGET_AMOUNT}
                        disabled={!isActive}
                        initialValue={inputRef[CONST.TARGET_AMOUNT] ? inputRef[CONST.TARGET_AMOUNT] : 0}
                        decimalCnt={decimalCnt}
                        handleChange={handleChange}
                    />
                </Box>
                <ErrorMsg>{sumError}</ErrorMsg>
            </Box>
            <Box justifyContent="space-between" style={{ display: 'flex' }}>
                <div>{t("trade:order_value")}</div>
                <Flex>
                    <div style={{ ...paddingRightSix, ...fontBold }}>{getTotalOrderPrice(false)}</div>
                    <div>USDT</div>
                </Flex>
            </Box>
            <Box justifyContent="space-between" style={{ display: 'flex' }}>
                <div>{t("trade:available_margin")}</div>
                <Flex>
                    <div style={{ ...paddingRightSix, ...fontBold }}>{getTotalOrderPrice(true)}</div>
                    <div>USDT</div>
                </Flex>
            </Box>
            <div style={{ height: 15, position: 'relative', padding: 0 }}>
                <ResultMsg>{resultMsg}</ResultMsg>
            </div>

            <Box justifyContent="space-between">
                <ModifyButton variant="contained" onClick={getClickEventForModify()}>
                    {getLeftButtonText()}
                </ModifyButton>

                <CancelButton variant="outlined" onClick={getClickEventForCancel()}>
                    {getRightButtonText()}
                </CancelButton>
            </Box>
        </NewOrderWrapper>
    );
};

export default React.memo(ModifyCancelForm);

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
    height: 40px;
    width: 47%;
    font-size: ${({ theme }) => theme.fontSizes.content} !important;
    border-radius: 2px !important;
    font-weight: 700 !important;
    text-align: center;
`;
const ModifyButton = styled(BaseButton)`
    text-transform: none;
    background: ${({ theme }) => theme.colors.orange} !important;
    color: ${({ theme }) => theme.colors.normalTextColor} !important;
`;
const CancelButton = styled(BaseButton)`
    border: 1px solid ${({ theme }) => theme.colors.orange} !important;
    color: ${({ theme }) => theme.colors.orange} !important;
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
    color: #3883e6;
    font-size: 14px;
`;
