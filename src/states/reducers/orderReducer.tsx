import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/*=============================
| Typescript : state          |
==============================*/

interface OrderState {
    index: number;
    data: any;
    triggeredBy: 'open-orders' | 'open-positions' | undefined;
    stopOrLimit: 'stop' | 'limit' | undefined;
    stopOrLimitOrMarket: string
}

const defaultState: OrderState = {
    index: 0,
    data: {},
    triggeredBy: undefined,
    stopOrLimit: undefined,
    stopOrLimitOrMarket: undefined
};

/*=============================
| Redux Toolkit : Slice       |
==============================*/

const orderSlice = createSlice({
    name: 'order',
    initialState: defaultState,
    reducers: {
        updateOrderTab: (state, action: PayloadAction<any>) => {
            return { ...action.payload };
        },
        tabClicked: (state, action: PayloadAction<{ index: number }>) => {
            // state.data = {};
            // state.index = action.payload.index;
            return { ...state, data: {}, index: action.payload.index };
        },
        reset: (state) => {
            // state = defaultState
            return defaultState;
        },
        updateIndex: (state, action: PayloadAction<number>) => {
            // state.index = action.payload;
            // state.data = {};
            return {
                ...state,
                index: action.payload,
                data: {},
            }
        },
    },
});

/*=============================
| Actions                     |
==============================*/

export const { updateOrderTab, tabClicked, reset, updateIndex } = orderSlice.actions;

/*=============================
| Reducer                    |
==============================*/

export const orderReducer = orderSlice.reducer;
