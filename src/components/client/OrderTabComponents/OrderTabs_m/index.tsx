import React from 'react';
import { useTranslation } from "react-i18next";

import NewOrderForm from '../NewOrder';
import OrderTabMenu from '../OrderTabs/OrderTabMenu';
import ModifyCancelForm from '../ModifyCancel';
import StopLimitForm from '../StopLimit/StopLimitForm';
import * as LANGUAGE from '../../../../constants/Language';
import OpenOrders from '../../UserTabComponents/OpenOrders';
import OpenPositions from '../../UserTabComponents/OpenPositions';
import PositionDetail from '../../UserTabComponents/PositionDetail';

import TabMenu from '../../../common/TabMenu';

const Index = ({ language = LANGUAGE.ENGLISH }) => {
    const { t } = useTranslation()

    return (
        <div style={{}}>
            <TabMenu
                reloadComponent={true}
                menu={
                    [t("trade:positions_detail"), t("trade:open_orders"), t("trade:open_positions")]
                }
                tabWidth={'50%'}
                components={[
                    <Wrapper key={3}>
                     <PositionDetail key={3} />
                    </Wrapper>,
                    <Wrapper key={0}>
                        <OpenOrders />
                    </Wrapper>,
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
