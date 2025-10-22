import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type defaultStateType = {
    loout : any
}
const defaultState: any = {
    loout: null
};

const stateSlice = createSlice({
    name: 'state',
    initialState: defaultState,
    reducers: {
        updateLive(state, action: PayloadAction<any>){
            const key = action.payload.key;
            const data = action.payload.data;
            if(key && data) state[key] = [data]
        },
        appendLive(state, action: PayloadAction<any>){
            const APPEND_LIVE_KEY = action.payload.key;
            const APPEND_LIVE_DATA = action.payload.data;
            const alreadyExist = state[APPEND_LIVE_KEY] ? true : false;

            state[APPEND_LIVE_KEY] = alreadyExist ? [...state[APPEND_LIVE_KEY], APPEND_LIVE_DATA] : [APPEND_LIVE_DATA]
        },
        updateTr(state, action: PayloadAction<any>){
            // state = {...state, ...action.payload}
            // return 해야 문제가 안생기네???!!
            return { ...state, ...action.payload };
        },
        appendTr(state, action: PayloadAction<any>){
            const APPEND_TR_KEY = action.payload.key;
            const APPEND_TR_DATA = action.payload.data;

            state[APPEND_TR_KEY]= APPEND_TR_DATA;
        },
        deleteTr(state, action: PayloadAction<any>){
            delete state[action.payload.key]
        },
        resetTr(state){
          state = {}
        }
    },
});

// 액션 생성자
export const { 
    updateLive,
    updateTr,
    deleteTr,
    resetTr,
    appendLive,
    appendTr
} = stateSlice.actions;

// 리듀서
export const stateReducer = stateSlice.reducer;


