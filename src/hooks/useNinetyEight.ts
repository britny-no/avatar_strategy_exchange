import { useTypedSelector } from '../states/useTypedSelector';

const outputOneColumn = [
    'szkey',
    'szStopPrc',
    'szLimitPrc',
    'cStatus',
    'szOrgCustItem1',
    'szOrgCustItem2',
    'szOorgCustItem3',
    'szCustItem1',
    'szCustItem2',
    'szCustItem3',
    'szAccNo',
];

/*=========================
| 98번 실시간 stop/limit   |
| 지정/정정/취소 에 사용됨  |
==========================*/

type NinetyEightOutputType = {
    szkey: string;
    szStopPrc: string;
    szLimitPrc: string;
    cStatus: string;
    szOrgCustItem1: string;
    szOrgCustItem2: string;
    szOorgCustItem3: string;
    szCustItem1: string;
    szCustItem2: string;
    szCustItem3: string;
    szAccNo: string;
};

type ReturnType = {
    data: Array<Array<string>>;
    dataColumn: Array<string>;
};

type LiveResultReturnType = {
    Header: {
        function: 'F';
        termtype: 'HTS';
        trcode: '98';
    };
    Output1: NinetyEightOutputType;
};

const convertObjToArray = (arr: Array<LiveResultReturnType>): Array<Array<string>> => {
    return arr.map((obj) => Object.values(obj.Output1));
};

const useData = (): ReturnType => {
    const liveResult: Array<LiveResultReturnType> = useTypedSelector((state) => state.stateReducer[`98`]);

    return {
        data: liveResult && liveResult.length > 0 ? convertObjToArray(liveResult) : [],
        dataColumn: outputOneColumn,
    };
};

export default useData;
