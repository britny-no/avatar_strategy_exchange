import React, { useEffect } from 'react';
import { Box, Button } from '@mui/material';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";

import TabMenu from '@/components/common/TabMenu';
import OpenOrders from '@/components/client/UserTabComponents/OpenOrders';
import TradingHistory from '@/components/client/UserTabComponents/TradingHistory';
import OpenPositions from '@/components/client/UserTabComponents/OpenPositions';
import PositionDetail from '@/components/client/UserTabComponents/PositionDetail';
import OrderTabMenu from '@/components/client/OrderTabComponents/OrderTabs';
import CoinInfo from '@/components/client/CoinInfo';
import Chart from '@/components/client/Chart/Chart';
import Trades from '@/components/client/Trades';
import UserMargin from '@/components/client/UserMargin';
import OrderBook from '@/components/client/OrderBook';
import SymbolDetail from '@/components/client/SymbolDetail';
import useCurrentLanguage from '@/hooks/useCurrentLanguage';
import Layout from '@/components/layout';
import socketService from "@/states/socketAgent/SocketService";
import useSymbolList from "@/hooks/useSymbolList";
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/states/useTypedSelector';
import useUpdateData from '@/components/client/UserTabComponents/OpenOrders/useUpdateData';

const TradingPage = () => {
    const { t } = useTranslation();
    const { currentSymbol } = useSymbolList();
    const { currentLanguage } = useCurrentLanguage();
    const userReducerData = useTypedSelector((state) => state.userReducer.data);
    const { szAccNo } = userReducerData;

    const { data, originalData, isSuccess, dataColumn } = useUpdateData();

    useEffect(() => {
        const input = {
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't3600',
            },
            Input1: {
                szAccNo: szAccNo,
            },
        };
        socketService.sendToAgent(input);
    }, [data, isSuccess]);

    useEffect(() => {
        const info = {
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't9731',
                trid: '1',
            },
            Input1: {
                szCurNo: currentSymbol,
                cTermDiv: '2',
                szCritDate: '99999999',
                szCritTime: '999999999',
                nMinTerm: '1',
                nReqCnt: '500',
            },
        };

        socketService.sendToAgent(info);
    }, [currentSymbol]); // Added currentSymbol as a dependency

    return (
        <Layout theme="dark">
            <div style={{ height: 80 }}></div>
            <div
                style={{
                    // maxWidth: 2100,
                    // margin: 'auto',
                    // minWidth: 1445,
                    width: '100vw',
                    overflow: 'auto',
                    fontSize: '12px',
                    // paddingRight: 30,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        padding: '0 15px 0 0',
                        minWidth: 1500,
                        overflow: 'auto',
                        flexFlow: 'wrap'
                    }}
                >
                    <Box width="100%">
                        <CoinInfo />
                    </Box>
                    <Box style={{ flex: '1', marginRight: 5, flexWrap: 'nowrap' }}>
                        <Box display="flex" marginY={1}>
                            <Box flex={1} marginRight={1}>
                                <Chart />
                            </Box>
                            <Box>
                                <TabMenu
                                    menu={[t("trade:order_book"), t("trade:trades")]}
                                    components={[<OrderBook key={0} />, <Trades key={1} />]}
                                    tabWidth={145}
                                />
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="flex-start">
                            <Box flex={1} position="relative">
                                <TabMenu
                                    reloadComponent={true}
                                    menu={[
                                        t("trade:positions_detail"),
                                        // t("trade:open_orders"),
                                        t("trade:trading_history"),
                                        t("trade:open_positions"),
                                    ]}
                                    tabWidth={189}
                                    components={[
                                        <PositionDetail key={3} />,
                                        // <OpenOrders key={0} />,
                                        <TradingHistory key={1} />,
                                        <OpenPositions key={2} />,
                                    ]}
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            // minWidth: '450px',
                            marginTop: "8px",
                            flexGrow: 0,
                            maxWidth: 'none',
                            flexBasis: 'auto'
                        }}
                    >
                        <OrderTabMenu language={currentLanguage} />
                        <Box marginTop={1}>
                            <TabMenu
                                menu={[t("trade:margin"), t("trade:detail")]}
                                components={[<UserMargin key={0} />, <SymbolDetail key={1} />]}
                                tabWidth={108}
                            />
                        </Box>
                    </Box>
                </Box>
            </div>
            <div style={{ height: 6 }}></div>
        </Layout>
    );
};

export default TradingPage;