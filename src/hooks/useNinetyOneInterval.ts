import { useTypedSelector } from '../states/useTypedSelector';

type ReturnType = {
    data: Array<Array<string>>;
    dataColumn: Array<string>;
    lastElement: NinetyOneDataType | Record<string, any>;
};

type NinetyOneDataType = {
    szSymbol: string;
    szDate: string;
    szTime: string;
    szOpen: string;
    szHigh: string;
    szLow: string;
    szClose: string;
    szVolume: string;
    szBuyPrice: string;
    szSellPrice: string;
    szPreClose: string;
    szBuyOrSell: string;
};

const outputTwoInKor = [
    '종목코드',
    '일자',
    '시간',
    '시가',
    '고가',
    '저가',
    '현재가',
    '거래량',
    '매수호가',
    '매도호가',
    '전일가',
    'buyOrSell',
];

const outputTwoInEng = [
    'szSymbol',
    'szDate',
    'szTime',
    'szOpen',
    'szHigh',
    'szLow',
    'szClose',
    'szVolume',
    'szBuyPrice',
    'szSellPrice',
    'szPreClose',
    'buyOrSell',
];

const useNinetyOneInterval = (szCurNo: string): ReturnType => {
    const liveResult = useTypedSelector((state) => state.stateReducer[`91_interval_${szCurNo}`]);

    const convertObjToArray = (arr: Array<any>): Array<Array<string>> => {
        return arr.map((obj) => Object.values(obj.Output1));
    };

    return {
        data: liveResult && liveResult.length > 0 ? convertObjToArray(liveResult) : [],
        dataColumn: outputTwoInKor,
        lastElement: liveResult ? liveResult[liveResult.length - 1].Output1 : {},
    };
};

export default useNinetyOneInterval;
