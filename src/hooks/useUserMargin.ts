import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

import formatNumber from '../lib/formatNumber';
import socketService from '../states/socketAgent/SocketService';
import { useTypedSelector } from '../states/useTypedSelector';
import { TransactionInputType } from '../types';
import useUsersData from './useUserData';

type UserMarginOutput = {
    data: Array<number | string>;
    dataColumn: Array<string>;
    refetch: () => void;
};


const getTrInfo = ({ szAccNo, email, jwt }): TransactionInputType => {
    return {
        Header: { function: 'D', termtype: 'HTS', trcode: 't3608', userid: email, token: jwt },
        Input1: { szAccNo: szAccNo },
    };
};

const useUserMargin = (): UserMarginOutput => {
    const { t } = useTranslation()
    const { szAccNo, email, jwt } = useUsersData();
    const data = useTypedSelector((state) => state.stateReducer[`t3608`]);

    const refetch = () => {
        if (szAccNo) {
            socketService.sendToAgent(getTrInfo({ szAccNo, email, jwt }));
        }
    };

    useEffect(() => {
        refetch();
    }, [szAccNo]);

    return {
        data: data ? parseData(data.Output2[0]) : [],
        dataColumn: [
            t("trade:balance"),
            t("trade:open_position_margin"),
            t("trade:gross_p_n_l"),
            t("trade:valuation_equity"),
            t("trade:required_order_margin"),
            t("trade:maintenance_position_margin"),
            t("trade:available_margin"),
            t("trade:margin_call_rage")
        ],
        refetch,
    };
};

const parseData = (data) => {
    return data.map((d) => formatNumber(d));
};

export default useUserMargin;
