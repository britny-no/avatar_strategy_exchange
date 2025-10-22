import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/*=============================
| Typescript: State          |
==============================*/
interface MessageState {
    data: string[];
}

const initialState: MessageState = {
    data: [],
};

/*=============================
| Redux Slice                |
==============================*/
const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        MESSAGE_PUSH: (state, action: PayloadAction<string>) => {
            state.data.push(action.payload); // Directly mutating state is allowed by immer
        },
    },
});

/*=============================
| Export Actions and Reducer  |
==============================*/
export const { MESSAGE_PUSH } = messageSlice.actions;
export const messageReducer = messageSlice.reducer;
