/*==================================
              지정가취소!!
====================================*/
// const lookUpTable= {
//   ⭐szAccNo: "00010057100001",
//   ⭐szPasswd: "0000",
//   ⭐szCurNo: "BCE2009Q03BU", //종목코드
//   ⭐fOrderSu: "1.0", //무조건 1
//   ⭐fOrderPrice: "49000", //매수/매도 처음 가격
//   ❌fStopPrice: "", //현재매수/매도 가격 이하
//   ❌fLimitPrice: "", //현재매수/매도 가격 이상
//   ❌szOrdType: "UODE", //정정[URE for 지정가정정 || UCEL/UCES for 청산limit] , 취소 [UODE 지정가주문취소 , UCEL/UCES 청산LIMIT 취소]
//   ❌nRange: "", //전체 사용안함
//   ❌nAlivingTerm: "", //전체 사용안함
//   ⭐szDealDiv: "079/081", //정정/취소 [079/081  or 082/080] "
//   ⭐fNxOpenRate: "매수시 매도가, 매도시 매수가", //전체 매수시 매도가, 매도시 매수가
//   ⭐szSLCustItem: "회원처리항목", // 지정가정정,취소 [원회원처리항] 청산리밋 정정취소 [LIMIT/STOP  주문회원처리항목] - 매수매도란에선 사용안함
//   ❌szOrgCustItem: "", //신규 매수/매도 주문일땐 사용안함 / 전매도, 환매수일땐 회원처리항목
//   ❌szNotMemberAccNo: "", //전체 사용안함
//   ❌szStaffID: "", //직원주문낼때만사용
//   ❌szStaffPW: "", //직원주문낼때만사용
//   ❌cIsStaff: "0", //직원주문(1), 이외(0)
//   ❌cModType: "8", // 매수, 매도시는 4 지정가취소 8  청산리밋취소 1
// },

/*==================================
              청산limit 취소!!
====================================*/
// const lookUpTable= {
//   ⭐szAccNo: "00010057100001",
//   ⭐szPasswd: "0000",
//   ⭐szCurNo: "BCE2009Q03BU", //종목코드
//   ⭐fOrderSu: "1.0", //무조건 1 (?)
//   ⭐fOrderPrice: "49000", //매수/매도 처음 가격
//   ⭐fStopPrice: "", //현재매수/매도 가격 이하
//   ⭐fLimitPrice: "", //현재매수/매도 가격 이상
//   ❌szOrdType: "UCEL or UCES", //정정[URE for 지정가정정 || UCEL/UCES for 청산limit] , 취소 [UODE 지정가주문취소 , UCEL/UCES 청산LIMIT 취소]
//   ❌nRange: "", //전체 사용안함
//   ❌nAlivingTerm: "", //전체 사용안함
//   ⭐szDealDiv: "082/080", //정정/취소 [079/081  or 082/080] "
//   ⭐fNxOpenRate: "매수시 매도가, 매도시 매수가", //전체 매수시 매도가, 매도시 매수가
//   ⭐szSLCustItem: "limit/stop주문회원처리항목", // 지정가정정,취소 [원회원처리항] 청산리밋 정정취소 [LIMIT/STOP  주문회원처리항목] - 매수매도란에선 사용안함
//   ⭐szOrgCustItem: "잔고 회원처리항목", //신규 매수/매도 주문일땐 사용안함 / 전매도, 환매수일땐 회원처리항목
//   ❌szNotMemberAccNo: "", //전체 사용안함
//   ❌szStaffID: "", //직원주문낼때만사용
//   ❌szStaffPW: "", //직원주문낼때만사용
//   ❌cIsStaff: "0", //직원주문(1), 이외(0)
//   ❌cModType: "1", // 매수, 매도시는 4 지정가취소 8  청산리밋취소 1
// },


/*==================================
              지정가 정정!!
====================================*/
// const lookUpTable= {
//   ⭐szAccNo: "00010057100001",
//   ⭐szPasswd: "0000",
//   ⭐szCurNo: "BCE2009Q03BU", //종목코드
//   ⭐fOrderSu: "1.0", //무조건 1
//   ⭐fOrderPrice: "매수 매도가격 아래 위", //매수/매도 처음 가격
//   ❌fStopPrice: "", //현재매수/매도 가격 이하
//   ❌fLimitPrice: "", //현재매수/매도 가격 이상
//   ❌szOrdType: "URE", //정정[URE for 지정가정정 || UCEL/UCES for 청산limit] , 취소 [UODE 지정가주문취소 , UCEL/UCES 청산LIMIT 취소]
//   ❌nRange: "", //전체 사용안함
//   ❌nAlivingTerm: "", //전체 사용안함
//   ⭐szDealDiv: "079/081", //정정/취소 [079/081  or 082/080] "
//   ⭐fNxOpenRate: "매수시 매도가, 매도시 매수가", //전체 매수시 매도가, 매도시 매수가
//   ⭐szSLCustItem: "회원처리항목", // 지정가정정,취소 [원회원처리항] 청산리밋 정정취소 [LIMIT/STOP  주문회원처리항목] - 매수매도란에선 사용안함
//   ❌szOrgCustItem: "", //신규 매수/매도 주문일땐 사용안함 / 전매도, 환매수일땐 회원처리항목
//   ❌szNotMemberAccNo: "", //전체 사용안함
//   ❌szStaffID: "", //직원주문낼때만사용
//   ❌szStaffPW: "", //직원주문낼때만사용
//   ❌cIsStaff: "0", //직원주문(1), 이외(0)
//   ❌cModType: "7", // 매수, 매도시는 4 지정가취소 8  청산리밋취소 1
// },

/*==================================
              청산limit 정정!!
====================================*/
// const lookUpTable= {
//   ⭐szAccNo: "00010057100001",
//   ⭐szPasswd: "0000",
//   ⭐szCurNo: "BCE2009Q03BU", //종목코드
//   ⭐fOrderSu: "1.0", //무조건 1 (?)
//   ⭐fOrderPrice: "매수 매도가격 아래 위", //매수/매도 처음 가격
//   ⭐fStopPrice: "정정할가격", //현재매수/매도 가격 이하
//   ⭐fLimitPrice: "정정할가격", //현재매수/매도 가격 이상
//   ❌szOrdType: "UCEL or UCES", //정정[URE for 지정가정정 || UCEL/UCES for 청산limit] , 취소 [UODE 지정가주문취소 , UCEL/UCES 청산LIMIT 취소]
//   ❌nRange: "", //전체 사용안함
//   ❌nAlivingTerm: "", //전체 사용안함
//   ⭐szDealDiv: "082/080", //정정/취소 [079/081  or 082/080] "
//   ⭐fNxOpenRate: "매수시 매도가, 매도시 매수가", //전체 매수시 매도가, 매도시 매수가
//   ⭐szSLCustItem: "limit/stop주문회원처리항목", // 지정가정정,취소 [원회원처리항] 청산리밋 정정취소 [LIMIT/STOP  주문회원처리항목] - 매수매도란에선 사용안함
//   ⭐szOrgCustItem: "잔고 회원처리항목", //신규 매수/매도 주문일땐 사용안함 / 전매도, 환매수일땐 회원처리항목
//   ❌szNotMemberAccNo: "", //전체 사용안함
//   ❌szStaffID: "", //직원주문낼때만사용
//   ❌szStaffPW: "", //직원주문낼때만사용
//   ❌cIsStaff: "0", //직원주문(1), 이외(0)
//   ❌cModType: "0", // 매수, 매도시는 4 지정가취소 8  청산리밋취소 1
// },
