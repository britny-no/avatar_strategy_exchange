import { useTypedSelector } from '../states/useTypedSelector';

/*=======================
|  92번 호가 10단 실시간  |
========================*/
const outputOneInEng = [
    'szSymbol',
    'szDate',
    'szTime',
    'szBuyPrc1',
    'szBuyRem1',
    'szBuyCnt1',
    'szBuyPrc2',
    'szBuyRem2',
    'szBuyCnt2',
    'szBuyPrc3',
    'szBuyRem3',
    'szBuyCnt3',
    'szBuyPrc4',
    'szBuyRem4',
    'szBuyCnt4',
    'szBuyPrc5',
    'szBuyRem5',
    'szBuyCnt5',
    'szBuyPrc6',
    'szBuyRem6',
    'szBuyCnt6',
    'szBuyPrc7',
    'szBuyRem7',
    'szBuyCnt7',
    'szBuyPrc8',
    'szBuyRem8',
    'szBuyCnt8',
    'szBuyPrc9',
    'szBuyRem9',
    'szBuyCnt9',
    'szBuyPrc10',
    'szBuyRem10',
    'szBuyCnt10',
    'szSellPrc1',
    'szSellRem1',
    'szSellCnt1',
    'szSellPrc2',
    'szSellRem2',
    'szSellCnt2',
    'szSellPrc3',
    'szSellRem3',
    'szSellCnt3',
    'szSellPrc4',
    'szSellRem4',
    'szSellCnt4',
    'szSellPrc5',
    'szSellRem5',
    'szSellCnt5',
    'szSellPrc6',
    'szSellRem6',
    'szSellCnt6',
    'szSellPrc7',
    'szSellRem7',
    'szSellCnt7',
    'szSellPrc8',
    'szSellRem8',
    'szSellCnt8',
    'szSellPrc9',
    'szSellRem9',
    'szSellCnt9',
    'szSellPrc10',
    'szSellRem10',
    'szSellCnt10',
];

type ReturnType = {
    data: any;
    dataColumn: Array<string>;
};

const useData = (szCurNo = 'BCE2009Q03BU'): ReturnType => {
    const liveResult = useTypedSelector((state) => state.stateReducer[`92_${szCurNo}`]);
    
    return {
        data: liveResult && liveResult.length > 0 ? liveResult : [],
        dataColumn: outputOneInEng,
    };
};

export default useData;
