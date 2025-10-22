import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const column = [
    'CUR_NO',
    'NAME_ENG',
    'NAME_KOR',
    'EX_CODE',
    'TERM_YY',
    'TERM_NO1',
    'TERM_QMW',
    'FX_CODE',
    'TRADE_TYPE',
    'CLOSE_DATE',
    'DAY_COUNT',
    'ST_DATE',
    'ED_DATE',
    'ST_TIME',
    'ED_TIME',
    'CLOSE_TIME',
    'MAX_ORDCNT',
    'MIN_ORDCNT',
    'PIP_LOWEST',
    'PIP_COST',
    'ORDER_STAT',
    'MAX_LEVERAGE',
];

export type SymbolInfoType = {
    CUR_NO: string;
    NAME_ENG: string;
    NAME_KOR: string;
    EX_CODE: string;
    TERM_YY: string;
    TERM_NO1: string;
    TERM_QMW: string;
    FX_CODE: string;
    TRADE_TYPE: string;
    CLOSE_DATE: number;
    DAY_COUNT: number;
    ST_DATE: number;
    ED_DATE: number;
    ST_TIME: number;
    ED_TIME: number;
    CLOSE_TIME: number;
    MAX_ORDCNT: number;
    MIN_ORDCNT: number;
    PIP_LOWEST: number;
    PIP_COST: number;
    MAX_LEVERAGE: string;
    ORDER_STAT: string;
    szCurNo: string;
    szDate: string;
    szTime: string;
    fOpen: number;
    fHigh: number;
    fLow: number;
    fClose: number;
    fVolume: number;
    fPreClose: number;
    fBuyPrice: number;
    fSellPrice: number;

    [key: string]: string | number | boolean; // 인덱스 시그니처 추가
};

interface SymbolState {
    currentSymbol: string;
    symbols: Record<string, SymbolInfoType>;
}

const initialState: SymbolState = {
    currentSymbol: 'BTCUSDT',
    symbols: {},
};

const symbolSlice = createSlice({
    name: 'symbol',
    initialState,
    reducers: {
        updateCurrentSymbol: (state, action: PayloadAction<string>) => {
            state.currentSymbol = action.payload;
        },
        updateSymbol: (state, action: PayloadAction<Record<string, any>>) => {
            const json = action.payload
            const returnData = {};

            json.Output2.forEach((symbolArr) => {
                const curNo = String(symbolArr[0]).trim();
        
                returnData[curNo] = {};
                symbolArr.forEach((f, index) => {
                    return (returnData[curNo][column[index]] = f.replace !== undefined ? f.replace(/ /g, '') : f);
                });
            });
            if(Object.keys(state.symbols).length === 0){
                state.symbols = returnData
            }

        },
        appendData: (state, action: PayloadAction<SymbolInfoType>) => {
            const curNo = action.payload.szCurNo;
            const targetCur = state.symbols[curNo];

            if (targetCur) {
                // 기존 기호가 존재하는 경우
                state.symbols[curNo] = {
                    ...targetCur,
                    ...action.payload,
                };
            }
        },
    },
});

// 액션 생성자 내보내기
export const { updateCurrentSymbol, updateSymbol, appendData } = symbolSlice.actions;

// 리듀서 내보내기
export const symbolReducer = symbolSlice.reducer;
