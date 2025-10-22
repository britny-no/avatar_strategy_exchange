import { useTranslation } from "react-i18next";

import NewOrderForm from '../NewOrder';
import OrderTabMenu from './OrderTabMenu';
import ModifyCancelForm from '../ModifyCancel';
import StopLimitForm from '../StopLimit/StopLimitForm';
import * as LANGUAGE from '@/constants/Language';
import { useTypedSelector } from '@/states/useTypedSelector';

export default function Index({ language = LANGUAGE.KOREAN }) {
    const { t } = useTranslation()
    const currentTabIndex = useTypedSelector((state) => state.orderReducer.index);
    return (
        <OrderTabMenu
            tabHeight={40}
            tabWidth={140}
            currentTabProp={currentTabIndex ? currentTabIndex : 0}
            // menu={["N/O", "S/L", "M/C", "N/O T"]}
            menu={
                [t("trade:new_order"), t("trade:stop_limit"), t("trade:modify_cancel")]
            }
            components={[
                <NewOrderForm key={0} language={language} />,
                <StopLimitForm key={1} language={language} />,
                <ModifyCancelForm key={2} language={language} />,
            ]}
        />
    );
}
