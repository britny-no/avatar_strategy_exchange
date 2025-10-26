import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";

import NewOrderForm from '../NewOrder';
import OrderTabMenu from '../OrderTabs/OrderTabMenu';
import ModifyCancelForm from '../ModifyCancel';
import StopLimitForm from '../StopLimit/StopLimitForm';
import * as LANGUAGE from '../../../../constants/Language';
import OpenOrders from '../../UserTabComponents/OpenOrders';
import OpenPositions from '../../UserTabComponents/OpenPositions';
import PositionDetail from '../../UserTabComponents/PositionDetail';
import socketService from "@/states/socketAgent/SocketService";


import TabMenu from '../../../common/TabMenu';
import useUpdateData from '../../UserTabComponents/OpenOrders/useUpdateData';
import { useTypedSelector } from '@/states/useTypedSelector';

const Index = ({ language = LANGUAGE.ENGLISH }) => {
    const { t } = useTranslation()

    const { data, isSuccess } = useUpdateData();
    const userReducerData = useTypedSelector((state) => state.userReducer.data);
    const { szAccNo } = userReducerData;

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


    return (
        <div style={{}}>
            <TabMenu
                reloadComponent={true}
                menu={
                    [t("trade:positions_detail"),
                    // t("trade:open_orders"),
                    t("trade:open_positions")]
                }
                tabWidth={'50%'}
                components={[
                    <Wrapper key={3}>
                        <PositionDetail key={3} />
                    </Wrapper>,
                    // <Wrapper key={0}>
                    //     <OpenOrders />
                    // </Wrapper>,
                    <Wrapper key={1}>
                        <OpenPositions />
                    </Wrapper>,
                ]}
            />
        </div>
    );
};

export default Index;

const Wrapper = ({ children }) => {
    return <div style={{ height: 350, overflow: 'auto' }}>{children}</div>;
};
