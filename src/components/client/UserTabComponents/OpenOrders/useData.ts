import { useTranslation } from "react-i18next";
import useAgentWhenSignedIn from '../../../../hooks/useAgentWhenSignedIn';
import { useTypedSelector } from '../../../../states/useTypedSelector';
import { TransactionInputType } from '../../../../types';
import useCurrentLanguage from '../../../../hooks/useCurrentLanguage';

type InputPropsType = {
    szAccNo: string | undefined;
    email: string | undefined;
    szAccNoPW: string | undefined;
    jwt: string | undefined;
};

const input = ({ szAccNo, szAccNoPW, email, jwt }: InputPropsType) => ({
    Header: {
        function: 'D',
        termtype: 'HTS',
        trcode: 't3600',
        userid: email,
        token: jwt,
    },
    Input1: {
        szAccNo,
        szAccNoPW,
    },
});

const output2Column = [
    '회원처리항목',
    '종목코드',
    '매매구분',
    '주문가격',
    '주문수량',
    '현재가',
    'Stop',
    'Limit',
    '주문상태',
    '주문시각',
    '주문유형',
];

const output2ColumnInEng = [
    'Order No',
    'Symbol ',
    'Side ',
    'Price ',
    'Lot',
    'Current Price',
    'Stop',
    'Limit',
    'CROSS/ISO',
    'Order Time',
    'Leverage',
];

//원래 컬럼 네임. 위가 변형된 컬럼네임
const output2ColumnInEngArch = [
    'szCustItem',
    'szCurNo ',
    'szSide ',
    'szRate ',
    'fLot',
    'szQuote',
    'szStop',
    'szLimit',
    'szStatus',
    'szOrderDateTime',
    'szOrderType',
];

type ReturnType = {
    data: any;
    dataColumn: Array<string>;
    isSuccess: boolean;
};

const useData = (): ReturnType => {
    const {t} = useTranslation()
    const userReducerData = useTypedSelector((state) => state.userReducer.data);
    const { szAccNo, szPasswd, email, jwt } = userReducerData;
    const { currentLanguage } = useCurrentLanguage();

    const { trResult } = useAgentWhenSignedIn({
        input: input({ szAccNo, szAccNoPW: szPasswd, email, jwt }) as TransactionInputType,
        dependency:[szAccNo, szPasswd]
    });

    return {
        data: trResult && trResult.Output2 ? trResult.Output2 : [],
        dataColumn: [
            t("openOrdersUseData:order_no"),
            t("openOrdersUseData:symbol"),
            t("openOrdersUseData:side"),
            t("openOrdersUseData:price"),
            t("openOrdersUseData:lot"),
            t("openOrdersUseData:current_price"),
            t("openOrdersUseData:stop"),
            t("openOrdersUseData:limit"),
            t("openOrdersUseData:cross_iso"),
            t("openOrdersUseData:order_time"),
            t("openOrdersUseData:leverage"),
        ],
        isSuccess: trResult && trResult.Output1 ? true : false,
    };
};

export default useData;
