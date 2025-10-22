import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
    Box,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel
} from "@mui/material"
import { useTranslation } from "react-i18next";

import useAgentToSend from '@/hooks/useAgentToSend';
import * as CONST from '@/constants/OrderTab';
import { buildInputForNewOrder } from '../common/InputBuilder';
import ButtonInput from '@/components/common/ButtonInput';
import formatNumber from '@/lib/formatNumber';
import { useTypedSelector } from '@/states/useTypedSelector';
import { TransactionInputType } from '@/types';
import useUsersData from '@/hooks/useUserData';
import useScreenSize from '@/hooks/useScreenSize';
import useMarginAndLeverage from '@/hooks/useMarginAndLeverage';
import useUserMargin from '@/hooks/useUserMargin';
import useSymbolList from '@/hooks/useSymbolList';
import unformatNumber from '@/lib/unformatNumber';
import AmountCalculator from '@/components/client/AmountCalculator';
import useLatestSymbolInfoInterval from '@/hooks/useLatestSymbolInfoInterval';

const borderBottomStyle: React.CSSProperties = {
    display: 'flex',
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

type NewOrderInputType = {
    szAccNo: string | undefined;
    szPasswd: string | undefined;
    szCurNo: string | undefined;
    fOrderSu: number | undefined;
    fOrderPrice: number | undefined;
    szOrdType: 'UOM' | 'UOE' | undefined;
    szDealDiv: '079' | '081' | undefined;
};

const NewOrderForm = ({ language = 'ENG' }) => {
    const { t } = useTranslation()

    const [inputRef, setInputRef] = useState<NewOrderInputType>({
        szAccNo: undefined,
        szPasswd: undefined,
        szCurNo: undefined,
        fOrderSu: 0,
        fOrderPrice: 0,
        szOrdType: 'UOE',
        szDealDiv: undefined,
    });
    const { result, sendTransaction } = useAgentToSend();
    const [priceError, setPriceError] = useState<string>('');
    const [sumError, setSumError] = useState<string>('');
    const [orderTypeError, setOrderTypeError] = useState<string>('');
    const [resultMsg, setResultMsg] = useState<string>('');

    const orderReducerData = useTypedSelector((state) => state.orderReducer.data);
    const { szDealDiv, szRate, fLot } = orderReducerData;
    // const triggeredByOrderBook = szDealDiv && szRate && fLot;

    // const currentSymbol = useTypedSelector((state) => state.symbolReducer.currentSymbol);
    const { currentSymbol, currentSymbolData } = useSymbolList();
    const { PIP_LOWEST, MAX_ORDCNT, MIN_ORDCNT } = currentSymbolData;
    const decimalCnt =  szRate &&  String(szRate).split('.')[1] ? String(szRate).split('.')[1].length : PIP_LOWEST;

    // const { szAccNo, szPasswd, email, jwt } = useTypedSelector((state) => state.userReducer.data);
    const { isMobile } = useScreenSize();
    const { szAccNo, szPasswd, email, jwt } = useUsersData();
    const { data: userMarginData } = useUserMargin();
    const { margin_type, leverage } = useMarginAndLeverage();

    const { close, status, changePerc } = useLatestSymbolInfoInterval({
        symbolInfo: currentSymbolData,
    });

    const isActive = szAccNo ? true : false;
    const dispatch = useDispatch();
    const usableEquity = userMarginData[6];

    /*=======================================
    | 호가창에서 가격이 선택될대              |
    | orderReducer로 부터                    |
    | fLot(수량), szRate(가격) 을 받아와서    |
    | inputRef를 업데이트                    |
    ========================================*/

    useEffect(() => {
        setInputRef({
            ...inputRef,
            fOrderSu: fLot,
            fOrderPrice: szRate,
            szOrdType: 'UOE',
        });
    }, [szDealDiv, szRate, fLot]);

    useEffect(() => {
        if (result?.Message?.data) {
            setResultMsg(result.Message.data);
            // setInputRef({ ...inputRef, fOrderPrice: 0, fOrderSu: 1 });
        }
    }, [result?.Message]);

    useEffect(() => {
        setInputRef({
            ...inputRef,
            fOrderSu: 0,
            fOrderPrice: 0,
        });
    }, [currentSymbol]);

    useEffect(() => {
        if (inputRef.szOrdType === 'UOM') {
            setInputRef({
                ...inputRef,
                fOrderPrice: unformatNumber(close),
            });
        }
    }, [close, inputRef.szOrdType]);

    const handleValidation = () => {
        let isValid = true;

        if (!isActive) {
            setResultMsg(t("trade:login_error"));
            return false;
        }

        if (inputRef.fOrderPrice === undefined || Number(inputRef.fOrderPrice) <= 0 || isNaN(inputRef.fOrderPrice)) {
            setPriceError(t("trade:price_error"));
            isValid = false;
        }
        if (inputRef.fOrderSu === undefined || Number(inputRef.fOrderSu) <= 0 || isNaN(inputRef.fOrderSu)) {
            setSumError(t("trade:amount_error"));
            isValid = false;
        }
        if (inputRef.szOrdType === undefined || (inputRef.szOrdType !== 'UOE' && inputRef.szOrdType !== 'UOM')) {
            setOrderTypeError(t("trade:order_type_error"));
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = (option) => (e) => {
        inputRef.szDealDiv = option;
        inputRef.szCurNo = currentSymbol;
        inputRef.szAccNo = szAccNo;
        inputRef.szPasswd = szPasswd;

        if (handleValidation()) {
            const inputToSend = buildInputForNewOrder({
                ...inputRef,
                email,
                jwt,
                margin_type,
                leverage: leverage + '',
            });
            sendTransaction(inputToSend as TransactionInputType);
            // consoleLogWithColor(
            //     `유저가 ${option === '079' ? '매수' : '매도'}주문을 클릭했습니다 Input은 `,
            //     inputToSend,
            // );
        }
    };

    const handleClick = (e) => {
        setOrderTypeError('');
        setResultMsg('');
        setInputRef({
            ...inputRef,
            szOrdType: e.target.value,
        });
    };

    const handleAmountChange = (amount) => {
        setInputRef({
            ...inputRef,
            [CONST.TARGET_AMOUNT]: amount,
        });
    };

    const resetErrorMsg = (target) => {
        target === CONST.TARGET_PRICE ? setPriceError('') : setSumError('');
    };

    const handleChange = (target, value) => {
        resetErrorMsg(target);
        setResultMsg('');

        setInputRef({
            ...inputRef,
            [target]: value,
        });
    };

    const getTextForOrderValue = () => {
        if (inputRef.fOrderSu === undefined || inputRef.fOrderPrice === undefined) return '0';
        return formatNumber(inputRef.fOrderSu * (inputRef.fOrderPrice / Number(leverage)), decimalCnt);
    };

    const getAvailableMargin = () => {
        const orderValue = unformatNumber(getTextForOrderValue());
        return formatNumber(Number(unformatNumber(usableEquity as string)) - Number(orderValue));
    };

    return (
        <NewOrderWrapper $isMobile={isMobile}>
            <Box justifyContent="space-between" style={{ ...borderBottomStyle }}>
                <div style={{ ...fontBold, fontSize: 16 }}>{currentSymbol}</div>
                <Flex>
                    <div style={{ ...paddingRightEight }}>{t("trade:leverage")}</div>
                    <div style={{ ...colorGrey }}>x {leverage}</div>
                </Flex>
            </Box>

            <Box style={{ position: 'relative'}}>
                <RadioGroup onChange={handleClick}>
                    <Box style={{ width: '100%', display: 'flex', flexWrap: 'wrap', }}>
                        <StFormControlLabel
                            value={CONST.UOM}
                            control={<Radio />}
                            label={t("trade:market_order")}
                            checked={inputRef.szOrdType === CONST.UOM ? true : false}
                        />
                        <StFormControlLabel
                            value={CONST.UOE}
                            checked={inputRef.szOrdType === CONST.UOE ? true : false}
                            control={<Radio />}
                            label={t("trade:limit_order")}
                        />
                    </Box>
                    <ErrorMsg>{orderTypeError && orderTypeError}</ErrorMsg>
                </RadioGroup>
            </Box>
            <Box style={{ position: 'relative' }}>
                <Box 
                    alignItems="center" 
                    justifyContent="space-between" 
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        boxSizing: 'border-box'
                    }}
                >
                    <div>{t("trade:price")}</div>
                    <ButtonInput
                        target={CONST.TARGET_PRICE}
                        handleChange={handleChange}
                        initialValue={inputRef[CONST.TARGET_PRICE]}
                        decimalCnt={decimalCnt}
                        szAccNo={szAccNo}
                        disabled={inputRef.szOrdType === 'UOM' ? true : false}
                    />
                </Box>
                <ErrorMsg>{priceError && priceError}</ErrorMsg>
                <Box
                    justifyContent="flex-end"
                    style={{ padding: 0, position: 'absolute', top: '80%', right: '6%', display:'flex' }}
                >
                    <div style={{ ...paddingRightSix }}>{formatNumber((inputRef[CONST.TARGET_PRICE] || 0) * (inputRef[CONST.TARGET_AMOUNT] || 0), decimalCnt)}</div>
                    {/*<div style={{ ...paddingRightSix }}>{formatNumber(inputRef[CONST.TARGET_PRICE])}</div>*/}
                    <div>USDT</div>
                </Box>
            </Box>

            <Box
                flexDirection="column"
                style={{
                    display: 'flex',
                    position: 'relative',
                    ...borderBottomStyle,
                    padding: '14px 0 25px 0',
                }}
            >
                <Box alignItems="center" justifyContent="space-between" style={{display: 'flex'}}>
                    <div> {t("trade:amount")}</div>
                    <ButtonInput
                        target={CONST.TARGET_AMOUNT}
                        handleChange={handleChange}
                        initialValue={inputRef[CONST.TARGET_AMOUNT]}
                    />
                </Box>
                <ErrorMsg>{sumError && sumError}</ErrorMsg>
            </Box>

            <Box justifyContent="space-between">
                <AmountCalculator
                    handleChange={handleAmountChange}
                    balance={unformatNumber(usableEquity as string)}
                    price={inputRef[CONST.TARGET_PRICE]}
                    maxOrderCount={Number(MAX_ORDCNT)}
                    minOrderCount={Number(MIN_ORDCNT)}
                    leverage={leverage}
                />

                <div style={{ textAlign: 'end', ...paddingRightSix, marginTop: 10 }}>
                    <Box style={{ marginBottom: 10 }}>
                        <div>{t("trade:order_value")}</div>
                        <div style={{ ...fontBold }}>{getTextForOrderValue()} USDT</div>
                    </Box>
                    <Box justifyContent="space-between">
                        <div>{t("trade:available_margin")}</div>
                        <div style={{ ...fontBold }}>{getAvailableMargin()} USDT</div>
                    </Box>
                </div>
            </Box>

            <div style={{ height: 15, position: 'relative', padding: 0 }}>
                <ResultMsg>{resultMsg}</ResultMsg>
            </div>

            <Box justifyContent="space-between">
                <BuyButton variant="contained" onClick={handleSubmit('079')}>
                {t("trade:buy_long")}
                </BuyButton>
                <SellButton variant="outlined" onClick={handleSubmit('081')}>
                {t("trade:sell_short")}
                </SellButton>
            </Box>
        </NewOrderWrapper>
    );
};

export default React.memo(NewOrderForm);

const Flex = styled.div`
    display: flex;
    align-items: center;
`;

const NewOrderWrapper = styled.div<{ $isMobile: boolean }>`
    font-size: ${({ theme }) => theme.fontSizes.content};
    color: ${({ theme }) => theme.colors.normalTextColor};
    height: ${({ theme, $isMobile }) => ($isMobile ? 'auto' : theme.orderTabMenu.height)};
    padding: 20px 20px 10px 20px;
    padding: ${({ theme }) => theme.orderTabMenu.containerPadding};

    & > div {
        padding: 8px 0;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
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
    width: 47%;
    /* width: 185px; */
    text-align: center;
`;
const BuyButton = styled(BaseButton)`
    background-color: ${({ theme }) => theme.colors.blue} !important;
    color: white !important;
    text-transform: none;
    &:hover {
        //background-color: #9e2d3c !important;
    }
`;
const SellButton = styled(BaseButton)`
    background-color: ${({ theme }) => theme.colors.red} !important;
    color: white !important;
    text-transform: none;

    &:hover {
        //background-color: #3f4ca8 !important;
    }
`;

const ErrorMsg = styled.span`
    position: absolute;
    top: 55px;
    color: red;
    font-size: ${({ theme }) => theme.fontSizes.orderTabMessage};
`;

const ResultMsg = styled.div`
    position: absolute;
    color: #3883e6;
    font-size: ${({ theme }) => theme.fontSizes.orderTabMessage};
`;
