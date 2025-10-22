import {useTranslation} from "react-i18next";

import useAgentWhenSignedIn from '../../../../hooks/useAgentWhenSignedIn';
import useSymbolList from '../../../../hooks/useSymbolList';
import { useTypedSelector } from '../../../../states/useTypedSelector';
import { TransactionInputType } from '../../../../types';
import useCurrentLanguage from '../../../../hooks/useCurrentLanguage';

type InputPropsType = {
    szAccNo: string | undefined;
    email: string | undefined;
    szAccNoPW: string | undefined;
    jwt: string | undefined;
    currentSymbol: string | undefined;
};

const input = ({ szAccNo, szAccNoPW, email, jwt, currentSymbol }: InputPropsType): TransactionInputType => ({
    Header: {
        function: 'D',
        termtype: 'HTS',
        trcode: 't3602',
        userid: email,
        token: jwt,
    },
    Input1: {
        szAccNo,
        szAccNoPW,
        szCurNo: '',
    },
});

const output2Column = [
    '포지션ID',
    '종목명',
    '매매구분',
    '주문가',
    '수량',
    '현재가',
    '스톱',
    '리밋',
    '총손익',
    '평가손익',
    '이자',
    '상태',
    '체결시각',
    '회원처리항목',
    'Stop회원처리항목',
    'Limit회원처리항목',
    '체결일자',
    'Market',
];

const output2ColumnInEng = [
    'Ticket No',
    'Symbol',
    'Side',
    'Price',
    'Lot',
    'Current Price',
    'Stop',
    'Limit',
    'Price Difference',
    'Gross P&L',
    'Leverage',
    'CROSS/ISO',
    'Market',
    'Order Time',
    'Order No',
    'Stop No',
    'Limit No',
    'Business Date',
];

const output2ColumnInEngArch = [
    'szTicketNo',
    'szCurNo',
    'szSide',
    'szRate',
    'fLot',
    'szQuote',
    'szStop',
    'szLimit',
    'fTotalPL',
    'fGrossPL',
    'fInterest',
    'szStatus',
    'Market',
    'szOrderTime',
    'szCustItem',
    'szStopItem',
    'szLimitItem',
    'nPrOpenDate',
];

type ReturnType = {
    data: Array<Array<string | number>>;
    dataColumn: Array<string>;
    isSuccess: boolean;
    refetchData: () => void;
};

const useData = (): ReturnType => {
    const {t} = useTranslation();
    const userReducerData = useTypedSelector((state) => state.userReducer.data);
    const { currentLanguage } = useCurrentLanguage();
    const { currentSymbol } = useSymbolList();
    const { szAccNo, szPasswd, email, jwt } = userReducerData;

    const { trResult, refetchData } = useAgentWhenSignedIn({
        input: input({ szAccNo, szAccNoPW: szPasswd, email, jwt, currentSymbol }),
    });

    return {
        data: trResult && trResult.Output2 ? trResult.Output2 : [],
        dataColumn: [
            t("openPositionsUseData:ticket_no"),
            t("openPositionsUseData:symbol"),
            t("openPositionsUseData:side"),
            t("openPositionsUseData:price"),
            t("openPositionsUseData:lot"),
            t("openPositionsUseData:current_price"),
            t("openPositionsUseData:stop"),
            t("openPositionsUseData:limit"),
            t("openPositionsUseData:price_difference"),
            t("openPositionsUseData:gross_p_n_l"),
            t("openPositionsUseData:leverage"),
            t("openPositionsUseData:cross_iso"),
            t("openPositionsUseData:market"),
            t("openPositionsUseData:order_time"),
            t("openPositionsUseData:order_no"),
            t("openPositionsUseData:stop_no"),
            t("openPositionsUseData:limit_no"),
            t("openPositionsUseData:business_date"),
        ],
        isSuccess: trResult && trResult.Output1,
        refetchData,
    };
};

export default useData;
