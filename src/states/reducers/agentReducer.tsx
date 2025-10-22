import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const defaultAgentState = {
    ws: '',
    used_tid: [],
    connected: false,
};

const agentSlice = createSlice({
    name: 'agent',
    initialState: defaultAgentState,
    reducers: {
        connectionOn(state) {
            state.connected = true;
        },
        connectionOff(state) {
            state.connected = false;
        },
        setWebSocket(state, action: PayloadAction<string>) {
            state.ws = action.payload;
        },
    },
});

// 액션 생성자
export const { connectionOn, connectionOff, setWebSocket } = agentSlice.actions;

// 리듀서
export const agentReducer = agentSlice.reducer;


