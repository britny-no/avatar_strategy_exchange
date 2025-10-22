import { Box } from '@mui/material';
import React, { useState } from 'react';
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

const OrderBook_cheongdam = ({
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
    const headerHeight = 40;

    const [isOpened, setIsOpened] = useState(false);
    const [positions, setPositions] = useState({ x: 10, y: 10 });
    const [price, setPrice] = useState(0);

    const handleClickForMobile = (price, sellOrBuy) => (e) => {
        const positionY = e.target.getBoundingClientRect().top;
        handleClickForMobile(price, sellOrBuy);
        setIsOpened(true);
        setPrice(price);
        setPositions({ x: 0, y: positionY });
    };

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
                <OrderBookHeaderItem>Price</OrderBookHeaderItem>
                <OrderBookHeaderItem>Amount</OrderBookHeaderItem>
                <OrderBookHeaderItem>Total</OrderBookHeaderItem>
            </OrderBookHeader>
            <Box>
                <OrderBookListWrapper>
                    {sellArr.map(({ price, changePerc, acc }, index) => {
                        return (
                            <SellRow
                                type={'sell'}
                                key={index}
                                // onClick={handleClick(price, 'sell')}
                                onClick={isForMobile ? handleClickForMobile(price, 'sell') : handleClick(price, 'sell')}
                                justifyContent={'center'}
                            >
                                <GridItem justifyContent="center" flexDirection="column" alignItems="flex-end">
                                    <div> {price} </div>
                                    <div> {changePerc}</div>
                                </GridItem>
                                <GridItem alignItems="center" justifyContent="flex-start">
                                    {acc}
                                </GridItem>
                                <EmptyGrid></EmptyGrid>
                            </SellRow>
                        );
                    })}
                    {buyArr.map(({ price, rem, changePerc, acc }, index) => {
                        return (
                            <BuyRow
                                type={'sell'}
                                key={index}
                                onClick={isForMobile ? handleClickForMobile(price, 'buy') : handleClick(price, 'buy')}
                                justifyContent={'center'}
                            >
                                <EmptyGrid></EmptyGrid>
                                <GridItem alignItems="center" justifyContent="flex-end">
                                    <div>{acc}</div>
                                </GridItem>
                                <GridItem justifyContent="center" flexDirection="column" alignItems="flex-start">
                                    <div> {price} </div>
                                    <div> {changePerc}</div>
                                </GridItem>
                            </BuyRow>
                        );
                    })}
                </OrderBookListWrapper>
            </Box>
        </OrderBookWrapper>
    );
};

export default OrderBook_cheongdam;

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
    width: 31% !important;
    padding: 5px;
    margin: 3px;
`;
const GridItem = styled(CommonGridSt)``;
const EmptyGrid = styled(CommonGridSt)``;
const SellRow = styled(Box)<{ type: string }>`
    color: #5461bd;
    cursor: pointer;

    &:hover {
        ${GridItem} {
            background-color: #d9dcf1;
        }
    }

    ${GridItem} {
        background-color: #edf2f9;
    }
`;

const BuyRow = styled(Box)<{ type: string }>`
    cursor: pointer;
    color: #cc3c4a;

    &:hover {
        ${GridItem} {
            background-color: #ecccc5;
        }
    }

    ${GridItem} {
        background-color: #f1dcd6;
    }
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
