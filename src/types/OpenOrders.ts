/*=======================
|   Open orders row     |
=======================*/
export type IOpenOrdersRow = {
    szCustItem: string; //회원처리항목
    szCurNo: string; //종목이름
    szSide: '079' | '081'; //매수매도구분
    szRate: number; //가격
    fLot: number; //수량
    szQuote: string; //현재가
    szStop: 0;
    szLimit: 0;
    szStatus: 0 | 1;
    szOrderDateTime: string;
    szOrderType: 'UOE' | 'OE';
};
