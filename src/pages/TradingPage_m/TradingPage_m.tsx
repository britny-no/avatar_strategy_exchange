import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Box } from '@mui/material';
import styled, { css } from 'styled-components';

import Chart from '@/components/client/Chart/Chart';
import OrderBook from '@/components/client/OrderBook';
import SymbolList from '@/components/client/SymbolList';
import OrderTabsMobile from '@/components/client/OrderTabComponents/OrderTabs_m';
import Swipe from './Swipe';


import FavoriteList from '@/components/client/SymbolList/FavoriteList';
import useCurrentLanguage from '@/hooks/useCurrentLanguage';
import { KOREAN, ENGLISH } from '@/constants/Language';
import LeveragePopup from '@/components/client/LeveragePopup/LeveragePopup';
import OrderOptions from '@/components/OrderOptions/';
import Layout from '@/components/layout';
import CoinSelect from '@/components/client/CoinInfo/CoinSelect';
import NewOrderForm from '@/components/client/OrderTabComponents/NewOrderMobile/';
import UserMargin from '@/components/client/UserMargin/';
import CoinStatusMobile from '@/components/client/CoinInfo/CoinStatusMobile';
import useMarginAndLeverage from '@/hooks/useMarginAndLeverage';
import ModifyCancelForm from '@/components/client/OrderTabComponents/ModifyCancel/ModifyCancelForm';
import StopLimitForm from '@/components/client/OrderTabComponents/StopLimit/StopLimitForm';
import { useTypedSelector } from '@/states/useTypedSelector';
import TabMenu from '@/components/common/TabMenu';



export default function TradingPageForMobile() {
    const { t } = useTranslation()
    const { currentLanguage } = useCurrentLanguage();
    const { leverage } = useMarginAndLeverage();
    const tabMenuText = {
        [KOREAN]: ['거래소', '호가', '차트', '주문'],
        [ENGLISH]: ['Chart', 'Order', 'Stop/Limit', 'Modify/Cancel'],
    };

    return (
        <Layout>
            <BodyBackgroundColor>
                <BackgroundColor>
                    <div style={{ height: 60 }}></div>
                    <Box style={{ display: 'flex' }}>
                        <div style={{ width: '50%' }}>
                            <CoinSelect />
                            <OrderOptions isForMobile={true} />
                            <LeverageWrapper>
                                {t("trade:leverage")} <span> x {leverage}</span>
                            </LeverageWrapper>
                        </div>
                        <div style={{ width: '50%' }}>
                            <CoinStatusMobile />
                        </div>
                    </Box>
                </BackgroundColor>
                <div style={{ height: 5 }}></div>

                <TabMenu
                    menu={[t("trade:chart"), t("trade:order"), t("trade:stop_limit"), t("trade:modify_cancel")]}
                    components={[
                        <ChartWrapper key={1} />,
                        <NewOrderForm key={2} />,
                        <StopLimitForm key={3} language={currentLanguage} />,
                        <ModifyCancelForm key={4} language={currentLanguage} />,
                    ]}
                />
                <div style={{ height: 5 }}></div>
                <OrderTabsMobile />
                <div style={{ height: 5 }}></div>
                <UserMarginWrapper />
            </BodyBackgroundColor>
            <div style={{ height: 5 }}></div>
        </Layout>
    );
}

const ChartWrapper = () => {
    return (
        <div style={{ height: '100vw' }}>
            <Chart />
        </div>
    );
};

const UserMarginWrapper = () => {
    return (
        <BackgroundColor>
            <UserMargin />
        </BackgroundColor>
    );
};

const OrderBookWithNewOrderForm = () => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '40%' }}>
                <OrderBook />
            </div>
            <div style={{ width: '60%' }}>
                <NewOrderForm />
            </div>
        </div>
    );
};

const SymbolListWrapper = () => {
    const [isSymbolList, setIsSymbolList] = useState(true);

    const handleToggle = (i) => () => {
        setIsSymbolList(i);
    };

    return (
        <div>
            {/*<Grid container justify="flex-end" alignItems="center" style={{ height: 36 }}>*/}
            {/*    <OptionBtn isSelected={isSymbolList === true} onClick={handleToggle(true)}>*/}
            {/*        종목*/}
            {/*    </OptionBtn>*/}
            {/*    <OptionBtn isSelected={isSymbolList === false} onClick={handleToggle(false)}>*/}
            {/*        관심종목*/}
            {/*    </OptionBtn>*/}
            {/*</Grid>*/}
            <CoinSelect />
            {isSymbolList ? <SymbolList /> : <FavoriteList />}
            <OrderOptions isForMobile={true} />
            <LeveragePopup />
        </div>
    );
};
const OptionBtn = styled.div<{ isSelected: boolean }>`
    border: 1px solid #dbdbdb;
    color: #dbdbdb;
    font-size: 14px;
    border-radius: 4px;
    padding: 2px 13px;
    margin-right: 3px;
    ${({ isSelected }) =>
        isSelected &&
        css`
            border-color: #5461bd;
            color: #5461bd;
        `}
`;

const BackgroundColor = styled.div`
    background-color: ${({ theme }) => theme.colors.primaryColor};
`;

const BodyBackgroundColor = styled.div`
    background-color: ${({ theme }) => theme.colors.bodyBackgroundColor};
`;

const LeverageWrapper = styled.div`
    color: white;
    font-size: 12px;
    text-align: right;
    margin: 10px 14px 10px 10px;

    span {
        color: red;
    }
`;
