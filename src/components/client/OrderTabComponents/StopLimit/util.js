export const buildInputForStopLimit = (input) => {
    let inputRef = {
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
    let inputRef = {
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
