import React from 'react';
import styled from 'styled-components';
import SpotCoinItem from './SpotCoinItem';

const SpotCoinList = () => {
    const spotCoinList = ['BNC_BTCUSDT', 'BIN_BTCUSDT', 'BIF_BTCUSDT'];

    return (
        <ListWrapper>
            {spotCoinList.map((coinSymbol) => (
                <SpotCoinItem key={coinSymbol} coinSymbol={coinSymbol} />
            ))}
        </ListWrapper>
    );
};

const ListWrapper = styled.ul`
    display: flex;
    flex-direction: row;
    height: 67px;
`;

export default React.memo(SpotCoinList);
