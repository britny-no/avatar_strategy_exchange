import React from 'react';
import styled, { css } from 'styled-components';
import { Skeleton } from "@mui/material";

import useSpotCoin from '@/hooks/useSpotCoin';

const SpotCoinItem = ({ coinSymbol }) => {
    const { loading, symbol, close, changePerc, status } = useSpotCoin(coinSymbol);

    return (
        <SpotCoin>
            {loading ? <Skeleton width={160} height={25} /> : <SpotCoinName>{symbol}</SpotCoinName>}
            {loading ? (
                <Skeleton width={160} height={25} />
            ) : (
                <SpotCoinPriceWrapper>
                    {
                        <SpotCoinPriceSpan status={status as 'up' | 'down'}>
                            {status === 'up' ? '+ ' : status === 'down' ? '- ' : ''}
                            {changePerc} %
                        </SpotCoinPriceSpan>
                    }

                    <SpotCoinPriceSpan status={status as 'up' | 'down'}>{close}</SpotCoinPriceSpan>
                </SpotCoinPriceWrapper>
            )}
        </SpotCoin>
    );
};

const SpotCoin = styled.li`
    width: 200px;
    padding: 5px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &:first-child {
        border-left: none;
    }
`;

const SpotCoinName = styled.p`
    width: 160px;
    font-size: 16px;
    line-height: 23px;
    text-align: center;
`;

const SpotCoinPriceWrapper = styled.div`
    width: 160px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
`;

const SpotCoinPriceSpan = styled.span<{ status: 'up' | 'down' }>`
    font-size: 15px;
    line-height: 22px;
    font-weight: 500;
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
              `} & + & {
        margin-left: 6px;
    }
`;

export default React.memo(SpotCoinItem);
