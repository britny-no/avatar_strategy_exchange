import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Box } from '@mui/material';

import useSymbolList from "../../../hooks/useSymbolList";
import ScrollBar from '../../../styled/ScrollBar';
import styled, { css } from 'styled-components';
import Modal from '../../common/Modal';
import ButtonInput from '../../common/ButtonInput';
import { buildInputForNewOrder } from '../OrderTabComponents/common/InputBuilder';
import { consoleLogWithColor } from '../OrderTabComponents/common/consoleWithColor';
import useAgentToSend from '../../../hooks/useAgentToSend';
import { useTypedSelector } from '../../../states/useTypedSelector';
import { TransactionInputType } from '../../../types';
import formatNumber from '../../../lib/formatNumber';
import useMarginAndLeverage from '../../../hooks/useMarginAndLeverage';

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
    const {t} = useTranslation()
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
        <OrderBookWrapper style={style}>
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
            </OrderBookHeader>
            <Box>
                <OrderBookListWrapper>
                    {sellArr.map(({ price, changePerc, acc, rem }, index) => {
                        // const compositionRate = ((stringPriceToNumber(price) * rem) / totalSellValue).toFixed(2);
                        const compositionRate = Number((rem / totalSellAmount).toFixed(2));

                        return (
                            <SellRow
                                type={'sell'}
                                key={index}
                                onClick={handleClick(price, 'sell')}
                                justifyContent={'center'}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    boxSizing: 'border-box',
                                    justifyContent: 'center'
                                }}
                            >
                                <GridItem justifyContent="center" flexDirection="column" alignItems="flex-start">
                                    <div> {price} </div>
                                </GridItem>
                                <GaugeWrapper>
                                    <Box
                                        style={{ height: '100%', zIndex: 1 }}
                                        alignItems="center"
                                        justifyContent="flex-end"
                                    >
                                        {formatNumber(rem, sumToFixed)}
                                    </Box>
                                    <CompositionRateGauge
                                        direction={'left'}
                                        compositionRate={Number(compositionRate)}
                                        isSell={true}
                                    />
                                </GaugeWrapper>
                            </SellRow>
                        );
                    })}
                    {buyArr.map(({ price, rem, changePerc, acc }, index) => {
                        const compositionRate = Number((rem / totalBuyAmount).toFixed(2));

                        return (
                            <BuyRow
                                type={'sell'}
                                key={index}
                                onClick={handleClick(price, 'buy')}
                                justifyContent={'center'}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    boxSizing: 'border-box',
                                    justifyContent: 'center'
                                }}
                            >
                                <GridItem justifyContent="center" flexDirection="column" alignItems="flex-start">
                                    <div> {price} </div>
                                </GridItem>

                                <GaugeWrapper>
                                    <Box
                                        style={{ height: '100%', zIndex: 1 }}
                                        alignItems="center"
                                        justifyContent="flex-end"
                                    >
                                        {formatNumber(rem, sumToFixed)}
                                    </Box>
                                    <CompositionRateGauge
                                        direction={'left'}
                                        compositionRate={Number(compositionRate)}
                                        isSell={false}
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
        <Box alignItems="center" justifyContent="center">
            <SellButton onClick={handleSubmit('081')}>sell</SellButton>
            <WhiteBackground>
                <div>{price}</div>
                <AmountWrapper alignItems="center" justifyContent="center">
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
    width: 41% !important;
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

const CompositionRateGauge = styled.div<{ compositionRate: number; isSell: boolean; direction: string }>`
    position: absolute;

    left: ${({ direction, compositionRate }) => (direction === 'left' ? `${100 - compositionRate * 100}%` : 0)};
    top: 0;
    height: 90%;
    margin: 1px 0 1px 0;
    width: ${({ compositionRate }) => `${compositionRate * 100}%`};
    background-color: ${({ isSell, theme }) => (isSell ? theme.colors.blue : theme.colors.red)};
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
        //padding: 0 2px;
        //line-height: 25px;
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
