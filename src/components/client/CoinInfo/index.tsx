import React from 'react';
import styled from 'styled-components';
import CoinSelect from './CoinSelect';
import OrderOptions from '../../OrderOptions/';
import CoinStatus from './CoinStatus';

const Index = () => {
    return (
        <CoinInfoWrapper>
            <CoinInfoLowerWrapper>
                <CoinPriceUpperWrapper>
                    <div>
                        <CoinSelect />
                        {/*<CoinPrice price={preClose} changePerc={changePerc} status={status} />*/}
                    </div>
                    <div style={{ width: 20 }}></div>
                    <div>
                        <OrderOptions />
                    </div>
                    <CoinStatus />
                </CoinPriceUpperWrapper>
            </CoinInfoLowerWrapper>
        </CoinInfoWrapper>
    );
};

export default Index;

const CoinInfoWrapper = styled.div`
    width: 100%;
    //width: 1440px;
    height: 68px;
    background-color: ${({ theme }) => theme.colors.primaryColor};
`;

const CoinInfoLowerWrapper = styled.div`
    //border-top: 1px solid #e3e3e3;
    padding: 20px;
`;

const CoinPriceUpperWrapper = styled.div`
    display: flex;
    //justify-content: space-between;
    align-items: center;
`;
