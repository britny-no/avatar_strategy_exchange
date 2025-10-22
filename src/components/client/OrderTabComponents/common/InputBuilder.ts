// import { NewOrderInputValidator } from './InputValidator';

type NewOrderInput = {
    szAccNo: string | undefined;
    email: string | undefined;
    jwt: string | undefined;
    szPasswd: string | undefined;
    szCurNo: string | undefined;
    fOrderSu: number | undefined;
    fOrderPrice: number | undefined;
    szOrdType: 'UOM' | 'UOE' | undefined;
    szDealDiv: '079' | '081' | undefined;
    margin_type: string;
    leverage: string;
};

export const buildInputForNewOrder = (input: NewOrderInput) => {
    const inputRef = {
        Header: {
            function: 'D' as 'D' | 'A',
            termtype: 'HTS',
            trcode: 't3216',
            userid: input.email,
            token: input.jwt,
        },
        Input1: {
            szAccNo: input.szAccNo,
            szPasswd: input.szPasswd,
            szCurNo: input.szCurNo,
            fOrderSu: input.fOrderSu + '',
            fOrderPrice: input.fOrderPrice + '', //매수/매도 처음 가격
            //   fStopPrice: "", //❌
            //   fLimitPrice: "", //❌
            szOrdType: input.szOrdType,
            //   nRange: "", //❌
            //   nAlivingTerm: "", //❌
            szDealDiv: input.szDealDiv, //정정/취소 [079/081  or 082/080] "
            fNxOpenRate: '', // ??
            //   szSLCustItem: "",  //❌
            //   szOrgCustItem: "", //❌
            //   szNotMemberAccNo: "", //❌
            szStaffID: '', //❌
            szStaffPW: '', //❌
            cIsStaff: '0', //❌
            cModType: '4', //❌
            margin_type: input.margin_type,
            leverage: input.leverage,
        },
    };

    return inputRef;
};

type ModifyCancelEntryInputType = {
    szAccNo: string | undefined;
    szPasswd: string | undefined;
    email: string | undefined;
    jwt: string | undefined;
    szCurNo: string | undefined;
    fOrderSu: number | undefined;
    fOrderPrice: number | undefined;
    szOrdType: 'URE' | 'UODE' | undefined;
    szDealDiv: '079' | '081' | undefined;
    szCustItem: string;
    cModType: '7' | '8'; //7 for modify, 8 for cancel
};

export const buildInputForModifyCancelEntry = (input: ModifyCancelEntryInputType) => {
    const inputRef = {
        Header: {
            function: 'D',
            termtype: 'HTS',
            trcode: input.cModType === '7' ? 't3216' : 't3215',
            userid: input.email,
            token: input.jwt,
        },
        Input1: {
            szAccNo: input.szAccNo,
            szPasswd: input.szPasswd,
            szCurNo: input.szCurNo,
            fOrderSu: input.fOrderSu,
            fOrderPrice: input.fOrderPrice,
            //   fStopPrice: "", //❌
            //   fLimitPrice: "", //❌
            szOrdType: input.szOrdType,
            //   nRange: "", //❌
            //   nAlivingTerm: "", //❌
            szDealDiv: input.szDealDiv,
            fNxOpenRate: '', // ??매수시 매도가, 매도시 매수가"
            szSLCustItem: input.szCustItem, // 지정가정정,취소 [원회원처리항] 청산리밋 정정취소 [LIMIT/STOP  주문회원처리항목] - 매수매도란에선 사용안함
            //   szOrgCustItem: "", //❌
            //   szNotMemberAccNo: "", //❌
            szStaffID: '', //❌
            szStaffPW: '', //❌
            cIsStaff: '0', //❌
            cModType: input.cModType,
        },
    };
    return inputRef;
};

export const buildInputForModifyCancelStopLimit = (input) => {
    const inputRef = {
        Header: {
            function: 'D',
            termtype: 'HTS',
            trcode: 't3215',
            userid: input.email,
            token: input.jwt,
        },
        Input1: {
            [input.stopOrLimitPriceKey]: input.stopOrLimitPrice,
            szAccNo: input.szAccNo,
            szPasswd: input.szPasswd,
            szCurNo: input.szCurNo,
            fOrderSu: input.fOrderSu,
            fOrderPrice: input.fOrderPrice, //매수/매도 처음 가격
            //   fStopPrice: "", //❌ 첫번째 라인에서 처리해주고있다.
            //   fLimitPrice: "", //❌ 첫번째 라인에서 처리해주고있다.
            szOrdType: input.szOrdType,
            //   nRange: "", //❌
            //   nAlivingTerm: "", //❌
            szDealDiv: input.szDealDiv === '079' ? '082' : input.szDealDiv === '081' ? '080' : null,
            fNxOpenRate: '', // ??"매수시 매도가, 매도시 매수가"
            szSLCustItem: input.szSLCustItem, //"limit/stop주문회원처리항목"
            szOrgCustItem: input.szOrgCustItem, //
            //   szNotMemberAccNo: "", //❌
            szStaffID: '', //❌
            szStaffPW: '', //❌
            cIsStaff: '0', //❌
            cModType: input.cModType,
        },
    };

    return inputRef;
};

export const buildInputForStopLimit = (input) => {
    const inputRef = {
        Header: {
            function: 'D',
            termtype: 'HTS',
            trcode: 't3215',
            userid: input.email,
            token: input.jwt,
        },
        Input1: {
            [input.stopOrLimitPriceKey]: input.stopOrLimitPrice,
            szAccNo: input.szAccNo,
            szPasswd: input.szPasswd,
            szCurNo: input.szCurNo,
            fOrderSu: input.fOrderSu,
            fOrderPrice: input.fOrderPrice, //매수/매도 처음 가격
            // fStopPrice: input.stopOrLimitPrice,
            // fLimitPrice: input.stopOrLimitPrice,
            szOrdType: input.szOrdType,
            //   nRange: "", //❌
            //   nAlivingTerm: "", //❌
            szDealDiv: input.szDealDiv === '079' ? '082' : input.szDealDiv === '081' ? '080' : null, //정정/취소 [079/081  or 082/080] "
            fNxOpenRate: '', // ??
            // szSLCustItem: "", // //❌
            szOrgCustItem: input.szSLCustItem,
            //   szNotMemberAccNo: "", //❌
            szStaffID: '', //❌
            szStaffPW: '', //❌
            cIsStaff: '0', //❌
            cModType: '4', //❌
        },
    };

    return inputRef;
};

export const buildInputForMarket = (input) => {
    const inputRef = {
        Header: {
            function: 'D',
            termtype: 'HTS',
            trcode: 't3215',
            userid: input.email,
            token: input.jwt,
        },
        Input1: {
            szAccNo: input.szAccNo,
            szPasswd: input.szPasswd,
            szCurNo: input.szCurNo,
            fOrderSu: input.fOrderSu,
            fOrderPrice: input.fOrderPrice, //매수/매도 처음 가격
            // fStopPrice: input.stopOrLimitPrice,
            // fLimitPrice: input.stopOrLimitPrice,
            szOrdType: 'UCM',
            //   nRange: "", //❌
            //   nAlivingTerm: "", //❌
            szDealDiv: input.szDealDiv === '079' ? '082' : input.szDealDiv === '081' ? '080' : null, //정정/취소 [079/081  or 082/080] ",
            fNxOpenRate: '', // ??
            // szSLCustItem: "", // //❌
            szOrgCustItem: input.szSLCustItem,
            //   szNotMemberAccNo: "", //❌
            szStaffID: '', //❌
            szStaffPW: '', //❌
            cIsStaff: '0', //❌
            cModType: '4', //❌
        },
    };

    return inputRef;
};
