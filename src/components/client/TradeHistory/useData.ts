import { useTranslation } from 'react-i18next';

import useAgentWhenSignedIn from '../../../hooks/useAgentWhenSignedIn';
import { useTypedSelector } from '../../../states/useTypedSelector';
import { TransactionInputType } from '../../../types';
import useCurrentLanguage from '../../../hooks/useCurrentLanguage';
import { translateOrderType, translateSzPoCode } from './common/commonUtil';

const input = ({ date, szAccNo, email, jwt, subPath }): TransactionInputType => {
    switch(subPath){
        case '/detail':
            return {
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't3607',
                    userid: email,
                    token: jwt,
                },
                Input1: {
                    szAccNo,
                    nFromDate: date.fromDate,
                    nToDate: date.toDate,
                },
            };
        case '/close':
            return {
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't3644',
                },
                Input1: {
                    szAccNo,
                    nDate: date.fromDate,
                    nToDate: date.toDate,
                    con_key: ''
                },
            };
        default:
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
                    nFromDate: date.fromDate,
                    nToDate: date.toDate,
                },
            };

    }
};

type ReturnType = {
    data: Array<Array<string | number>>;
    dataColumn: Array<string>;
    output1: {
        con_gb: string 
        con_key: string 
        nCloseCnt: number 
        nPosCnt: number
        szCnt: string
        szMsg: string
        fCommission: number
        fPNL: number
};
};

const useData = ({ date, subPath }): ReturnType => {
    const {t} = useTranslation()
    date = {fromDate: String(date.fromDate), toDate: String(date.toDate)}
    const userReducerData = useTypedSelector((state) => state.userReducer.data);
    const { szAccNo, email, jwt } = userReducerData;

    const inputField = input({ date, szAccNo, email, jwt, subPath });
    const trCode = inputField.Header.trcode;
    const { trResult } = useAgentWhenSignedIn({
        input: inputField,
        dependency: [inputField.Input1.nDate, inputField.Input1.nFromDate, inputField.Input1.nToDate, subPath],
    });
    // console.log('@@@@@@')
    // console.log(inputField)
    // console.log(trResult)

    const column = {
        t3612: [
            t("executionList:order_no"),
            t("executionList:execution_no"),
            t("executionList:symbol"),
            t("executionList:order_lot"),
            t("executionList:execution_lot"),
            t("executionList:order_kinds"),
            t("executionList:order_price"),
            t("executionList:execution_price"),
            t("executionList:order_type"),
            t("executionList:order_time"),
            t("executionList:execution_time"),
            t("executionList:point_position"),
        ],
        t3607: [
            t("executionList:order_no"),
            t("executionList:execution_no"),
            t("executionList:symbol"),
            t("executionList:side"),
            t("executionList:lot"),
            t("executionList:order_price"),
            t("executionList:stop_price"),
            t("executionList:limit_price"),
            t("executionList:order_kinds"),
            t("executionList:order_type"),
            t("executionList:stat"),
            t("executionList:order_time"),
            t("executionList:manager_id"),
            t("executionList:ip_address"),
        ],
        t3644: [
            t("executionList:execution_no"),
            t("executionList:account_no"),
            t("executionList:symbol"),
            t("executionList:close_lot"),
            t("executionList:open_time"),
            t("executionList:close_time"),
            t("executionList:open_price"),
            t("executionList:close_price"),
            t("executionList:p_l_price"),
            t("executionList:p_l"),
            t("executionList:open_commission"),
            t("executionList:close_commission"),
            t("executionList:order_type"),
            t("executionList:side"),
            t("executionList:point_position"),
    ]
    };

    const parseData = (data) => {
        const newData = [...data];
        switch(trCode){
            case 't3612':
                return newData.map((d) => {
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
            case 't3607':
                return newData.map((d) => {
                    const newD = [...d];
                    // 회원처리번호
                    newD[0] = newD[0].slice(15, 21);
                    // 체결번호
                    newD[1] = newD[1].slice(10, 16);
                    // szPOCode 주문 유형 예 : 079 080
                    newD[3] = translateSzPoCode(newD[3]);
                    // UOE --> Limit, UOM --> Market, SCM -> Close
                    newD[8] = translateOrderType(newD[8]);
                    newD[9] = translateOrderType(newD[9]);
    
                    //(1) 079 -> Buy, 081 -> Sell, 080 -> Close Sell, 082 -> Close Buy
                    return newD;
                });
            case 't3644':
                return newData.map((d) => {
                    const newD = [...d];
    
                    // 회원처리번호
                    newD[0] = newD[0].slice(10, 16);
                    // newD[3] = translateSzPoCode(newD[3]);
                    // 체결번호
                    // newD[1] = newD[1].slice(15, 21);
                    // // szPOCode 주문 유형 예 : 079 080
                    // newD[5] = translateSzPoCode(newD[5]);
                    // // UOE --> Limit, UOM --> Market, SCM -> Close
                    newD[12] = translateOrderType(newD[12]);
                    newD[13] = translateSzPoCode(newD[13]);
    
                    //(1) 079 -> Buy, 081 -> Sell, 080 -> Close Sell, 082 -> Close Buy
                    return newD;
                });
        }

        return newData;
    };

    return {
        data: trResult && trResult.Output2 ? parseData(trResult.Output2) : [],
        dataColumn: column[trCode],
        // conKey: trResult?.Output1?.con_key || '',
        output1: trResult?.Output1
    };
};

export default useData;
