import { Grid } from '@material-ui/core';
import React, { useCallback, createRef, useEffec } from 'react';
import ScrollBar from '../../../styled/ScrollBar';
import styled, { css } from 'styled-components';

export default function OrderBook({ style, handleClick, buyArr, sellArr, fClose, fairValue, buyTotal, sellTotal }) {
    const headerHeight = 40;

    return (
        <OrderBookWrapper style={style}>
            <OrderBookHeader style={{ height: headerHeight }}>
                <OrderBookHeaderItem>Price</OrderBookHeaderItem>
                <OrderBookHeaderItem>Amount</OrderBookHeaderItem>
                <OrderBookHeaderItem>Total</OrderBookHeaderItem>
            </OrderBookHeader>
            <Grid container>
                <OrderBookListWrapper>
                    <List>
                        {sellArr.map(({ price, rem, changePerc, status, acc }, index) => {
                            return (
                                <Item
                                    type={'sell'}
                                    key={index}
                                    totalAmount={sellTotal}
                                    itemAmount={acc}
                                    onClick={handleClick(price, 'sell')}
                                >
                                    <ItemPriceWrapper>
                                        <ItemPrice>{price}</ItemPrice>
                                        {/* <ItemChangePerc>{changePerc}</ItemChangePerc> */}
                                    </ItemPriceWrapper>
                                    <ItemAmount>{rem}</ItemAmount>
                                    <ItemAcc>{acc}</ItemAcc>
                                </Item>
                            );
                        })}
                    </List>

                    <OrderBookInfoWrapper className="fair-value">
                        <span>Fair Value: {fairValue}</span>
                        <Price>{fClose}</Price>
                    </OrderBookInfoWrapper>

                    <List>
                        {buyArr.map(({ price, rem, changePerc, status, acc }, index) => {
                            return (
                                <Item
                                    key={index}
                                    type={'buy'}
                                    totalAmount={buyTotal}
                                    itemAmount={acc}
                                    onClick={handleClick(price, 'buy')}
                                >
                                    <ItemPriceWrapper>
                                        <ItemPrice>{price}</ItemPrice>
                                        {/* <ItemChangePerc>{changePerc}</ItemChangePerc> */}
                                    </ItemPriceWrapper>
                                    <ItemAmount>{rem}</ItemAmount>
                                    <ItemAcc>{acc}</ItemAcc>
                                </Item>
                            );
                        })}
                    </List>
                </OrderBookListWrapper>
            </Grid>
        </OrderBookWrapper>
    );
}
const OrderBookWrapper = styled(ScrollBar)`
    border-radius: 4px;
    overflow: auto;
    font-size: ${({ theme }) => theme.fontSizes.content};
`;

const OrderBookHeader = styled.div`
    position: sticky;
    top: 0;
    left: 0;
    background-color: white;
    z-index: 1;
    border-bottom: 1px solid #e3e3e3;
    display: flex;
    justify-content: space-around;
`;

const OrderBookHeaderItem = styled.div`
    line-height: 40px;
    color: #5461bd;
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

const List = styled.ul``;
const Item = styled.li`
    &:hover {
        background-color: ${({ type }) =>
            type === 'buy' ? css`rgba(177, 59, 59, 0.096)` : css`rgba(146, 159, 255, 0.219)`};
    }

    &:before {
        position: absolute;
        display: block;
        content: '';
        left: -10px;
        height: 100%;
        background-color: ${({ type }) =>
            type === 'buy' ? css`rgba(229, 97, 97, 0.541)` : css`rgba(146, 159, 255, 0.6)`};
        z-index: -1;

        ${({ totalAmount, itemAmount }) =>
            css`
                width: calc(${(itemAmount / totalAmount) * 100}% + 10px);
            `};
    }
`;

const ItemPriceWrapper = styled.span``;
const ItemPrice = styled.span`
    width: 100px;
`;

const ItemChangePerc = styled.span`
    width: 40px;
`;

const ItemAmount = styled.span``;
const ItemAcc = styled.span``;

const Price = styled.span`
    font-weight: 600;
`;

const OrderBookInfoWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 5px 30px;
    height: 40px;
    line-height: 30px;
    border-bottom: 1px solid #e3e3e3;
`;
