import { useTranslation } from 'react-i18next';
import React, { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';

import ScrollBar from '../../../styled/ScrollBar';
import styled, { css } from 'styled-components';
import Modal from '../../common/Modal';
import ButtonInput from '../../common/ButtonInput';
import { buildInputForNewOrder } from '../OrderTabComponents/common/InputBuilder';
import { consoleLogWithColor } from '../OrderTabComponents/common/consoleWithColor';
import useAgentToSend from '../../../hooks/useAgentToSend';
import { useTypedSelector } from '../../../states/useTypedSelector';
import { TransactionInputType } from '../../../types';
import useMarginAndLeverage from '../../../hooks/useMarginAndLeverage';
import useSymbolList from '../../../hooks/useSymbolList';

type OrderType = {
    acc: number;
    changePerc: string;
    price: string;
    rem: number;
};

type PropsType = {
    style: Record<string, any>;
    handleClick: (number, string) => (event: React.MouseEvent<HTMLElement>) => void;
    buyArr: Array<OrderType>;
    sellArr: Array<OrderType>;
    fClose: number;
    fPreClose: number;
    fairValue: string;
    buyTotal: number;
    sellTotal: number;
    isForMobile: boolean;
};

const OrderBook = ({
    style,
    handleClick,
    buyArr,
    sellArr,
    fClose,
    fPreClose,
    fairValue,
    buyTotal,
    sellTotal,
    isForMobile = false,
}: PropsType) => {
    const { t } = useTranslation();
    const headerHeight = 40;

    const [isOpened, setIsOpened] = useState(false);
    const [positions, setPositions] = useState({ x: 10, y: 10 });
    const [price, setPrice] = useState(0);
    const { currentSymbolData } = useSymbolList();
    const { MIN_ORDCNT } = currentSymbolData;
    const sumToFixed = Number(MIN_ORDCNT) < 1 ? (1 / Number(MIN_ORDCNT)).toString().length - 1 : 0;
    const handleClickForMobile = (price, sellOrBuy) => (e) => {
        const positionY = e.target.getBoundingClientRect().top;
        handleClickForMobile(price, sellOrBuy);
        setIsOpened(true);
        setPrice(price);
        setPositions({ x: 0, y: positionY });
    };

    const totalSellAmount = sellArr[0] ? Number(sellArr[0].acc) : 0;
    const totalBuyAmount = buyArr[0] ? Number(buyArr[buyArr.length - 1].acc) : 0;

    return (
        <OrderBookWrapper style={style} className={'orderbook-wrapper'}>
            <Modal opened={isOpened} setOpened={setIsOpened} positions={positions} closeButtonVisible={false}>
                <SwiftOrderComponent
                    price={price}
                    closeModal={() => {
                        setIsOpened(false);
                    }}
                />
            </Modal>

            <OrderBookHeader style={{ height: headerHeight }}>
                <OrderBookHeaderItem>{t("trade:price")}</OrderBookHeaderItem>
                <OrderBookHeaderItem>{t("trade:amount")}</OrderBookHeaderItem>
                <OrderBookHeaderItem>{t("trade:total")}</OrderBookHeaderItem>
            </OrderBookHeader>
            <Box display="flex" flexDirection="column">
                <OrderBookListWrapper>
                    {sellArr.map(({ price, changePerc, acc, rem }, index) => {
                        const amountByTotalAmount = Number((rem / totalSellAmount).toFixed(2));
                        const accumulatedAmountByTotalAmount = Number((acc / totalSellAmount).toFixed(2));

                        return (
                            <SellRow
                                type={'sell'}
                                key={index}
                                onClick={isForMobile ? handleClickForMobile(price, 'sell') : handleClick(price, 'sell')}
                                display="flex"
                                justifyContent="center"
                            >
                                <GridItem display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center">
                                    <div> {price} </div>
                                </GridItem>

                                <GaugeWrapper>
                                    <Box display="flex" height="100%" alignItems="center" justifyContent="flex-end">
                                        {rem}
                                    </Box>
                                    <CompositionRateGauge
                                        $direction={'left'}
                                        $compositionRate={Number(amountByTotalAmount)}
                                        $isSell={true}
                                    />
                                </GaugeWrapper>

                                <GaugeWrapper>
                                    <Box display="flex" height="100%" alignItems="center" justifyContent="flex-end">
                                        {acc.toFixed(sumToFixed)}
                                    </Box>
                                    <CompositionRateGauge
                                        $direction={'right'}
                                        $compositionRate={Number(accumulatedAmountByTotalAmount)}
                                        $isSell={true}
                                    />
                                </GaugeWrapper>
                            </SellRow>
                        );
                    })}
                    {buyArr.map(({ price, rem, changePerc, acc }, index) => {
                        const amountByTotalAmount = Number((rem / totalSellAmount).toFixed(2));
                        const accumulatedAmountByTotalAmount = Number((acc / totalSellAmount).toFixed(2));

                        return (
                            <BuyRow
                                display="flex"
                                type={'buy'}
                                key={index}
                                onClick={isForMobile ? handleClickForMobile(price, 'buy') : handleClick(price, 'buy')}
                                justifyContent="center"
                            >
                                <GridItem display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center">
                                    <div> {price} </div>
                                </GridItem>

                                <GaugeWrapper>
                                    <Box display="flex" height="100%" alignItems="center" justifyContent="flex-end">
                                        {rem}
                                    </Box>
                                    <CompositionRateGauge
                                        $direction={'left'}
                                        $compositionRate={Number(amountByTotalAmount)}
                                        $isSell={false}
                                    />
                                </GaugeWrapper>

                                <GaugeWrapper>
                                    <Box display="flex" height="100%" alignItems="center" justifyContent="flex-end">
                                        {acc.toFixed(sumToFixed)}
                                    </Box>
                                    <CompositionRateGauge
                                        $direction={'right'}
                                        $compositionRate={Number(accumulatedAmountByTotalAmount)}
                                        $isSell={false}
                                    />
                                </GaugeWrapper>
                            </BuyRow>
                        );
                    })}
                </OrderBookListWrapper>
            </Box>
        </OrderBookWrapper>
    );
};

export default OrderBook;

const SwiftOrderComponent = ({ price, closeModal }) => {
    const [amount, setAmount] = useState(1);
    const currentSymbol = useTypedSelector((state) => state.symbolReducer.currentSymbol);
    const { szAccNo, szPasswd, email, jwt } = useTypedSelector((state) => state.userReducer.data);
    const { result, sendTransaction } = useAgentToSend();
    const { margin_type, leverage } = useMarginAndLeverage();
    const handleChange = (target, value) => {
        setAmount(value);
    };

    const handleSubmit = (option) => (e) => {
        const inputRef = {
            szDealDiv: option,
            szCurNo: currentSymbol,
            szOrdType: 'UOE' as const,
            szAccNo: szAccNo,
            szPasswd: szPasswd,
            fOrderPrice: Number(price.replace(',', '')),
            fOrderSu: amount,
            margin_type,
            leverage,
            email,
            jwt,
        };

        const inputToSend = buildInputForNewOrder(inputRef);
        consoleLogWithColor(`유저가 ${option === '079' ? '매수' : '매도'}주문을 클릭했습니다 Input은 `, inputToSend);
        sendTransaction(inputToSend as TransactionInputType);
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="center">
            <SellButton onClick={handleSubmit('081')}>sell</SellButton>
            <WhiteBackground>
                <div>{price}</div>
                <AmountWrapper display="flex" alignItems="center" justifyContent="center">
                    <ButtonInput
                        handleChange={handleChange}
                        initialValue={amount}
                        width="100%"
                        target="fOrderSu"
                        stepButtonVisible={false}
                    />
                </AmountWrapper>
            </WhiteBackground>
            <BuyButton onClick={handleSubmit('079')}>buy</BuyButton>
        </Box>
    );
};

const WhiteBackground = styled.div`
    background-color: white;
    width: 50%;
`;

const AmountWrapper = styled(Box)``;

const BaseButton = styled.div`
    width: 60px;
    height: 50px;
    color: white;
    line-height: 50px;
    text-align: center;
    border-radius: 4px;
`;
const BuyButton = styled(BaseButton)`
    background-color: #d13636;
`;
const SellButton = styled(BaseButton)`
    background-color: #6a6ad6;
`;

const CommonGridSt = styled(Box)`
    width: 30% !important;
    padding: 2px;
    margin: 2px;
`;
const GridItem = styled(CommonGridSt)``;
const EmptyGrid = styled(CommonGridSt)``;
const SellRow = styled(Box)<{ type: string }>`
    cursor: pointer;
    color: ${({ theme }) => theme.colors.normalTextColor};
    //price
    ${GridItem}:nth-child(1) {
        color: ${({ theme }) => theme.colors.red};
        text-align: left;
    }

    &:hover {
        background-color: ${({ theme }) => theme.colors.secondaryColor};

        ${GridItem} {
        }
    }

    ${GridItem} {
        //background-color: #edf2f9;
    }
`;

const BuyRow = styled(Box)<{ type: string }>`
    cursor: pointer;
    color: ${({ theme }) => theme.colors.normalTextColor};
    //price
    ${GridItem}:nth-child(1) {
        color: ${({ theme }) => theme.colors.blue};
    }

    &:hover {
        background-color: ${({ theme }) => theme.colors.secondaryColor};

        ${GridItem} {
        }
    }

    ${GridItem} {
        //background-color: #f1dcd6;
    }
`;

const GaugeWrapper = styled(CommonGridSt)`
    position: relative;
`;

const CompositionRateGauge = styled.div<{ $compositionRate: number; $isSell: boolean; $direction: string }>`
    position: absolute;

    left: ${({ $direction, $compositionRate }) => ($direction === 'left' ? `${100 - $compositionRate * 100}%` : 0)};
    top: 0;
    height: 63%;
    margin: 6px 0 6px 0;
    width: ${({ $compositionRate }) => `${$compositionRate * 100}%`};
    background-color: ${({ $isSell, theme }) => ($isSell ? theme.colors.blue : theme.colors.red)};
    opacity: 0.22;
`;

const OrderBookWrapper = styled(ScrollBar)`
    border-radius: 4px;
    overflow: auto;
    font-size: ${({ theme }) => theme.fontSizes.content};
`;

const OrderBookHeader = styled.div`
    position: sticky;
    top: 0;
    left: 0;
    background-color: ${({ theme }) => theme.colors.primaryColor};
    border-bottom: 1px solid ${({ theme }) => theme.colors.secondaryColor};
    z-index: 1;
    display: flex;
    justify-content: space-around;

    div:nth-child(1) {
        text-align: left;
        padding-left: 10px;
    }
    div:nth-child(3) {
        padding-right: 10px;
    }

    & > div {
        width: 33%;
        text-align: right;
    }

    //justify-content: space-around;
`;

const OrderBookHeaderItem = styled.div`
    line-height: 40px;
    color: ${({ theme }) => theme.colors.dimmerTextColor};
`;

const OrderBookListWrapper = styled.div`
    width: 100%;
    & > ul > li {
        padding: 0 10px;
        line-height: 25px;
        cursor: pointer;
        position: relative;
        border-bottom: 1px solid #e3e3e3;

        & > span {
            display: inline-block;
            width: 33.33%;
            text-align: center;
        }
    }
`;
