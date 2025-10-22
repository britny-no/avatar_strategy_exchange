import {useEffect} from 'react';
import { useTranslation } from 'react-i18next';

import useAgentWhenSignedIn from '../../../../hooks/useAgentWhenSignedIn';
import { useTypedSelector } from '../../../../states/useTypedSelector';
import { TransactionInputType } from '../../../../types';
import useCurrentLanguage from '../../../../hooks/useCurrentLanguage';
import { translateOrderType, translateSzPoCode } from '../common/commonUtil';



const input = ({ date, szAccNo, email, jwt }): TransactionInputType => {
    return {
        Header: {
            function: 'D',
            termtype: 'HTS',
            trcode: 't3612',
            userid: email,
            token: jwt,
        },
        Input1: {
            szAccNo,
            // nFromDate: '',
            // nToDate: '',
            nFromDate: date.fromDate,
            nToDate: date.toDate,
        },
    };
};

const output2Column = [
    '회원처리항목',
    '체결번호',
    '종목코드2',
    '주문수량',
    '체결수량',
    '매매구분',
    '주문환율',
    '체결환율',
    '주문형태',
    '주문시각',
    '체결시각',
    '소수최저자리',
];

const output2ColumnInEng = [
    'Order No',
    'Execution No',
    'Symbol',
    'Order Lot',
    'Execution Lot',
    'Order Kinds',
    'Order Price',
    'Execution Price',
    'Order Type',
    'Order Time',
    'Execution Time',
    'Point position',
];

const output2ColumnInEngArch = [
    'szCustItem',
    'szPrOpen_No',
    'szCurNo',
    'fOrderSu',
    'fNxOpenSu',
    'szPOCode',
    'fOrderPrice',
    'fExecPrice',
    'szOrderType',
    'szOrderDateTime',
    'szExecDateTime',
    'fPipLowest',
];

type ReturnType = {
    data: Array<Array<string | number>>;
    dataColumn: Array<string>;
};

const useData = ({ date }): ReturnType => {
    const { t }= useTranslation()
    const userReducerData = useTypedSelector((state) => state.userReducer.data);
    const { szAccNo, email, jwt } = userReducerData;
    const inputField = input({ date, szAccNo, email, jwt });
    const { trResult } = useAgentWhenSignedIn({
        input: inputField,
        dependency: [inputField.Input1.nFromDate, inputField.Input1.nToDate],
    });

    const parseData = (data) => {
        const newData = [...data];
        return newData.map((d, i) => {
            const newD = [...d];
            // 회원처리번호
            newD[0] = newD[0].slice(15, 21);
            // 체결번호
            newD[1] = newD[1].slice(10, 16);
            // szPOCode 주문 유형 예 : 079 080
            newD[5] = translateSzPoCode(newD[5]);
            // UOE --> Limit, UOM --> Market, SCM -> Close
            newD[8] = translateOrderType(newD[8]);

            //(1) 079 -> Buy, 081 -> Sell, 080 -> Close Sell, 082 -> Close Buy
            return newD;
        });
    };

    return {
        data: trResult && trResult.Output2 ? parseData(trResult.Output2) : [],
        dataColumn: [
            t("tradingHistoryUseData:order_no"),
            t("tradingHistoryUseData:execution_no"),
            t("tradingHistoryUseData:symbol"),
            t("tradingHistoryUseData:order_lot"),
            t("tradingHistoryUseData:execution_lot"),
            t("tradingHistoryUseData:order_kinds"),
            t("tradingHistoryUseData:order_price"),
            t("tradingHistoryUseData:execution_price"),
            t("tradingHistoryUseData:order_type"),
            t("tradingHistoryUseData:order_time"),
            t("tradingHistoryUseData:execution_time"),
            t("tradingHistoryUseData:point_position"),
        ]
    };
};

export default useData;
