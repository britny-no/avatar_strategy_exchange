import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/*=============================
| Typescript : state          |
==============================*/

interface MarginAndLeverageState {
    margin_type: string;
    leverage: string;
}

const defaultState: MarginAndLeverageState = {
    margin_type: '1',
    leverage: '10',
};

/*=============================
| Redux Toolkit : Slice       |
==============================*/

const marginAndLeverageSlice = createSlice({
    name: 'marginAndLeverage',
    initialState: defaultState,
    reducers: {
        setMarginType: (state, action: PayloadAction<string>) => {
            state.margin_type = action.payload;
        },
        setLeverage: (state, action: PayloadAction<string>) => {
            state.leverage = action.payload;
        },
    },
});

/*=============================
| Actions                     |
==============================*/

export const { setMarginType, setLeverage } = marginAndLeverageSlice.actions;

/*=============================
| Reducer                    |
==============================*/

export const marginAndLeverageReducer = marginAndLeverageSlice.reducer;
