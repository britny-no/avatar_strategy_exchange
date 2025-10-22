import React from 'react';
import styled, { css } from 'styled-components';

interface PropsType {
    price: number;
    changePerc: string;
    status: 'up' | 'down';
}

const CoinPrice = ({ price, changePerc, status }: PropsType) => {
    return (
        <CoinPriceWrapper>
            <CoinPriceChangePerc status={status}>{changePerc} %</CoinPriceChangePerc>
        </CoinPriceWrapper>
    );
};

const CoinPriceWrapper = styled.div`
    display: flex;
    align-items: center;
    /* justify-content: space-between; */
    /* width: 205px; */
`;

const CoinPriceName = styled.span<{ status: 'up' | 'down' }>`
    /* width: 160px; */
    font-weight: 700;
    font-size: 30px;
    line-height: 44px;
    ${({ status }) =>
        status === 'up'
            ? css`
                  color: #e56060;
              `
            : status === 'down'
            ? css`
                  color: #5461bd;
              `
            : css`
                  color: black;
              `}
`;

const CoinPriceChangePerc = styled.span<{ status: 'up' | 'down' }>`
    display: inline-block;
    border-radius: 2px;
    text-align: center;
    font-size: 14px;
    line-height: 24px;
    font-weight: 600;
    padding: 2px 6px;
    margin-left: 7px;
    ${({ status }) =>
        status === 'up'
            ? css`
                  background-color: #e56060;
                  color: white;
              `
            : status === 'down'
            ? css`
                  background-color: #5461bd;
                  color: white;
              `
            : css`
                  background-color: #f2f2f2;
                  color: black;
              `}
`;

export default React.memo(CoinPrice);
