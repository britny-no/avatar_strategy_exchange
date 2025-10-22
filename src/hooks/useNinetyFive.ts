import { useTypedSelector } from '../states/useTypedSelector';

const outputColumnInEng = [
    'szKey',
    'szMemberNo', // 회원사ID
    'szClOrdID', //주문 접수번호
    'szNoticeNo', // 통지번호
    'szOrdType', // 주문유형
    'szCode', // 종목코드
    'szOrderID', // 거래소 접수번호
    'szPGCode', // 투자자구분
    'fAmount', // 약정수량
    'szRate', // 약정지수
    'szQuote', // 현재가
    'szExeTime', // 약정시각
    'szOrgCustItem1', // 주문시 회원처리항목1
    'szOrgCustItem2', // 주문시 회원처리항목2
    'szOrgCustItem3', // 주문시 회원처리항목3
    'szAccNo', // 계좌번호
    'szCustItem1', // 회원처리항목1
    'szCustItem2', // 회원처리항목2
    'szCustItem3', // 회원처리항목3
    'szFundBasket', // Fund & Basket code
    'szSide', // 매매구분
    'szState', // 체결상태
    'szInType', // 체결구분
    'szStop', // Stop
    'szLimit', // Limit
    'fTotalPL', // 핍손익
    'fGrossPL', // 일일손익(가격으로 환산된 손익)
    'szOrgTicketNo', // 원체결번호
    'szOpenTime', // 신규주문 체결시간
    'szAccName', // 계좌명
    'fRevRate', // 체결시 반대지수
    'fCommition', // 수수료
    'fOpenMarkup', // OM (전환매시 사용)
    'szUserID', // 고객ID
    'szFXCMPosID', // TicketNo
    'fInterest', // 이자
    'fCloseMarkup', // CM (전환매시 사용)
    'fMtMargin', // 유지증거금
    'fOrderMargin', // 주문증거금
    'fOutBalance', // 미결제금액
    'fPipCost', // 체결시 Pip Cost
];

const outputColumn = [
    'szKey',
    '회원사ID',
    '주문 접수번호',
    '통지번호',
    '주문유형',
    '종목코드',
    '거래소 접수번호',
    '투자자구분',
    '약정수량',
    '약정지수',
    '현재가',
    '약정시각',
    '주문시 회원처리항목1',
    '주문시 회원처리항목2',
    '주문시 회원처리항목3',
    '계좌번호',
    '회원처리항목1',
    '회원처리항목2',
    '회원처리항목3',
    'Fund & Basket code',
    '매매구분',
    '체결상태',
    '체결구분',
    'Stop',
    'Limit',
    '핍손익',
    '일일손익(가격으로 환산된 손익)',
    '원체결번호',
    '신규주문 체결시간',
    '계좌명',
    '체결시 반대지수',
    '수수료',
    'OM (전환매시 사용)',
    '고객ID',
    'TicketNo',
    '이자',
    'CM (전환매시 사용)',
    '유지증거금',
    '주문증거금',
    '미결제금액',
    '체결시 Pip Cost',
];

type NinetyFiveDataType = {
    szKey: string;
    szMemberNo: string;
    szClOrdID: string;
    szNoticeNo: string;
    szOrdType: string;
    szCode: string;
    szOrderID: string;
    szPGCode: string;
    fAmount: number;
    szRate: string;
    szQuote: string;
    szExeTime: string;
    szOrgCustItem1: string;
    szOrgCustItem2: string;
    szOrgCustItem3: string;
    szAccNo: string;
    szCustItem1: string;
    szCustItem2: string;
    szCustItem3: string;
    szFundBasket: string;
    szSide: string;
    szState: string;
    szInType: string;
    szStop: string;
    szLimit: string;
    fTotalPL: number;
    fGrossPL: number;
    szOrgTicketNo: string;
    szOpenTime: string;
    szAccName: string;
    fRevRate: number;
    fCommition: number;
    fOpenMarkup: number;
    szUserID: string;
    szFXCMPosID: string;
    fInterest: number;
    fCloseMarkup: number;
    fMtMargin: number;
    fOrderMargin: number;
    fOutBalance: number;
    fPipCost: number;
};

const convertObjToArray = (arr: Array<LiveResultReturnType>): Array<Array<string | number>> => {
    return arr.map((obj) => Object.values(obj.Output1));
};

type LiveResultReturnType = {
    Header: {
        function: 'F';
        termtype: 'HTS';
        trcode: '95';
    };
    Output1: NinetyFiveDataType;
};

type ReturnType = {
    data: Array<Array<string | number>>;
    dataColumn: Array<string>;
};

const useData = (): ReturnType => {
    const liveResult = useTypedSelector((state) => state.stateReducer['95']);

    return {
        data: liveResult && liveResult.length > 0 ? convertObjToArray(liveResult) : [],
        dataColumn: outputColumn,
    };
};

export default useData;
