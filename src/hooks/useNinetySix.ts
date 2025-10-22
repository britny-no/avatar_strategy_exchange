import { useTypedSelector } from '../states/useTypedSelector';

/*=====================
|   96번 실시간 주문   |
=====================*/
type ReturnType = {
    data: Array<Array<string>>;
    dataColumn: Array<string>;
};

const outputOneColumn = [
    'szKey',
    '종목코드',
    '매매구분',
    '주문유형',
    '상태',
    '주문수량',
    '주문환률',
    '주문시간',
    '회원처리항목1',
    '회원처리항목2',
    '회원처리항목3',
    '취정시 회원처리항목1',
    '취정시 회원처리항목2',
    '취정시 회원처리항목3',
    '계좌번호',
    '유지증거금',
    '주문증거금',
];

const convertObjToArray = (arr: Array<any>): Array<Array<string>> => {
    return arr.map((obj) => Object.values(obj.Output1));
};

const useData = (): ReturnType => {
    const szAccNo = useTypedSelector((state) => state.userReducer.data.szAccNo);
    const liveResult = useTypedSelector((state) => state.stateReducer['96']);

    return {
        data: liveResult && liveResult.length > 0 ? convertObjToArray(liveResult) : [],
        dataColumn: outputOneColumn,
    };
};

export default useData;
