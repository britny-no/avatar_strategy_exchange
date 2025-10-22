import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components'
import {
    Box,
    Button,
    MenuItem,
    FormControl,
    FormControlLabel,
    Select
} from "@mui/material"
import { useTranslation } from "react-i18next";


import useAgentToSend from '../../../../hooks/useAgentToSend';
import * as CONST from '../../../../constants/OrderTab';
import { buildInputForNewOrder } from '../common/InputBuilder';
import ButtonInput from '../../../common/ButtonInput';
import { consoleLogWithColor } from '../common/consoleWithColor';
import formatNumber from '../../../../lib/formatNumber';
import { useTypedSelector } from '../../../../states/useTypedSelector';
import { TransactionInputType } from '../../../../types';
import useUsersData from '../../../../hooks/useUserData';
import useScreenSize from '../../../../hooks/useScreenSize';
import useMarginAndLeverage from '../../../../hooks/useMarginAndLeverage';
import useUserMargin from '../../../../hooks/useUserMargin';
import useSymbolList from '../../../../hooks/useSymbolList';
import unformatNumber from '../../../../lib/unformatNumber';
import OrderBookMobile from '../../OrderBook_m/';
import AmountCalculator from '../../AmountCalculator/';
import useLatestSymbolInfo from '../../../../hooks/useLatestSymbolInfo';

const borderBottomStyle: React.CSSProperties = {
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
    // fOrderPrice: number | undefined;
    fOrderPrice: any;
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
    // const triggeredByOrderBookMobile = szDealDiv && szRate && fLot;

    // const { szAccNo, szPasswd, email, jwt } = useTypedSelector((state) => state.userReducer.data);
    const { isMobile } = useScreenSize();
    const { szAccNo, szPasswd, email, jwt } = useUsersData();
    const { data: userMarginData } = useUserMargin();
    const { margin_type, leverage } = useMarginAndLeverage();

    const isActive = szAccNo ? true : false;

    const { currentSymbol, currentSymbolData } = useSymbolList();
    const { close, status, changePerc } = useLatestSymbolInfo({
        symbolInfo: currentSymbolData,
    });

    const { PIP_LOWEST, MAX_ORDCNT } = currentSymbolData;
    const decimalCnt =  szRate &&  String(szRate).split('.')[1] ? String(szRate).split('.')[1].length : PIP_LOWEST;

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
        if (inputRef.szOrdType === 'UOM') {
            setInputRef({
                ...inputRef,
                fOrderPrice: unformatNumber(close),
            });
        }
    }, [close, inputRef.szOrdType]);

    useEffect(() => {
        if (result?.Message?.data) {
            setResultMsg(result.Message.data);
            // setInputRef({ ...inputRef, fOrderPrice: 0, fOrderSu: 1 });
        }
    }, [result?.Message]);

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
        console.log('values : ', value);

        setInputRef({
            ...inputRef,
            [target]: value,
        });
    };

    const handleDropdownOptionChange = (e) => {
        setInputRef({
            ...inputRef,
            szOrdType: e.target.value,
        });
    };

    const getTextForOrderValue = () => {
        if (inputRef.fOrderSu === undefined || inputRef.fOrderPrice === undefined) return '0';
        return formatNumber(inputRef.fOrderSu * inputRef.fOrderPrice, PIP_LOWEST);
    };

    const getAvailableMargin = () => {
        const orderValue = unformatNumber(getTextForOrderValue());
        const orderValueAfterLeverage = Number(orderValue) / Number(leverage);
        return formatNumber(Number(unformatNumber(usableEquity as string)) - orderValueAfterLeverage);
    };

    const renderNewOrderForm = () => {
        return (
            <NewOrderWrapper isMobile={isMobile}>
                <Box style={{ position: 'relative', margin: '5px 0' }}>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <StSelect
                                // labelId="demo-simple-select-label"
                                value={inputRef.szOrdType}
                                displayEmpty={true}
                                onChange={handleDropdownOptionChange}
                            >
                                <MenuItem value={CONST.UOE}>{t("trade:limit")}</MenuItem>
                                <MenuItem value={CONST.UOM}>{t("trade:market")}</MenuItem>
                            </StSelect>
                        </FormControl>
                    </Box>
                </Box>

                <AvailableMargin>available margin {usableEquity}</AvailableMargin>

                <Box style={{ position: 'relative' }}>
                    <InputWrapper alignItems="center" justifyContent="space-between">
                        <div className={'color-bluee'}>{t("trade:price")}</div>
                        <ButtonInput
                            target={CONST.TARGET_PRICE}
                            handleChange={handleChange}
                            initialValue={inputRef[CONST.TARGET_PRICE]}
                            decimalCnt={decimalCnt}
                            stepButtonVisible={false}
                            disabled={inputRef.szOrdType === 'UOM' ? true : false}
                        />
                    </InputWrapper>
                    <ErrorMsg>{priceError && priceError}</ErrorMsg>
                    <Box
                        justifyContent="flex-end"
                        style={{ padding: 0, position: 'absolute', top: '80%', right: '6%' }}
                    >
                    </Box>
                </Box>

                <Box
                    flexDirection="column"
                    style={{
                        position: 'relative',
                        ...borderBottomStyle,
                        padding: '2px 0 15px 0',
                    }}
                >
                    <InputWrapper alignItems="center" justifyContent="space-between">
                        <div className={'color-bluee'}> {t("trade:amount")}</div>
                        <ButtonInput
                            target={CONST.TARGET_AMOUNT}
                            handleChange={handleChange}
                            initialValue={inputRef[CONST.TARGET_AMOUNT]}
                            stepButtonVisible={false}
                        />
                    </InputWrapper>
                    <ErrorMsg>{sumError && sumError}</ErrorMsg>
                </Box>
                <AmountCalculator
                    handleChange={handleAmountChange}
                    balance={unformatNumber(usableEquity as string)}
                    price={inputRef[CONST.TARGET_PRICE]}
                    maxOrderCount={Number(MAX_ORDCNT)}
                />
                <div style={{ height: 15, position: 'relative', padding: 0 }}>
                    <ResultMsg>{resultMsg}</ResultMsg>
                </div>
            </NewOrderWrapper>
        );
    };

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '50%' }}>{renderNewOrderForm()}</div>
                <div style={{ width: '50%', maxHeight: '500px' }}>
                    <OrderBookMobile />
                </div>
            </div>
            <div style={{ height: 20 }} />
            <Box justifyContent="space-between" style={{ padding: '0 14px' }}>
                <BuyButton variant="contained" onClick={handleSubmit('079')}>
                    {t("trade:buy_long")}
                </BuyButton>
                <SellButton variant="outlined" onClick={handleSubmit('081')}>
                    {t("trade:sell_short")}
                </SellButton>
            </Box>
        </div>
    );
};

export default React.memo(NewOrderForm);

const Flex = styled.div`
    display: flex;
    align-items: center;
`;

const NewOrderWrapper = styled.div<{ isMobile: boolean }>`
    font-size: ${({ theme }) => theme.fontSizes.content};
    color: ${({ theme }) => theme.colors.normalTextColor};
    height: ${({ theme, isMobile }) => (isMobile ? 'auto' : theme.orderTabMenu.height)};
    // padding: ${({ theme }) => theme.orderTabMenu.containerPadding};
    padding-left: 12px;
    padding-right: 4px;

    & > div {
        padding: ${({ theme, isMobile }) => (isMobile ? '6px 0' : theme.orderTabMenu.divPadding)};
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
    width: 49%;
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

const InputWrapper = styled(Box)`
    border-radius: 5px;
    padding: 5px;
    padding-left: 10px;
    background-color: ${({ theme }) => theme.colors.inputFieldColor};

    .color-blue {
        color: #799dff;
    }
`;

const AvailableMargin = styled.div`
    color: ${({ theme }) => theme.colors.orange};
`;

const StSelect = styled(Select)`
    border: 2px solid ${({ theme }) => theme.colors.inputFieldColor};
    border-radius: 5px;

    color: ${({ theme }) => theme.colors.normalTextColor} !important;
    font-size: ${({ theme }) => theme.fontSizes.content} !important;

    svg {
        color: ${({ theme }) => theme.colors.normalTextColor} !important;
    }

    li {
        background-color: ${({ theme }) => theme.colors.inputFieldColor} !important;
    }
`;
