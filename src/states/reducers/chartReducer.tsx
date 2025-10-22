import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state
const initialChartState = {
    chart_key: '',
    chartData_t9731: {
        data: {
            Header: '',
            Output1: [],
        },
        loading: true,
        error: null,
    },
};

// Create a slice for chart state
const chartSlice = createSlice({
    name: 'chart',
    initialState: initialChartState,
    reducers: {
        setChartKey(state, action: PayloadAction<string>) {
            state.chart_key = action.payload;
        },
        initChart(state, action: PayloadAction<any>) {
            state.chartData_t9731 = {
                data: action.payload,
                loading: false,
                error: null,
            };
        },
        deleteChart(state, action: PayloadAction<{ key: string }>) {
            delete state[action.payload.key];
        },
        loadingChart(state) {
            state.chartData_t9731.loading = true
        }
    },
});

// Export the actions generated from the slice
export const { setChartKey, initChart, deleteChart, loadingChart } = chartSlice.actions;

// Export the reducer to be used in the store
export const chartReducer = chartSlice.reducer;
