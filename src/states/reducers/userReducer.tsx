// src/reducers/userReducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState, LanguageType, ScreenSizeType } from './types';

const initialState: UserState = {
    isLoggedIn: false,
    language: 'ENG',
    screenSize: undefined,
    data: {
        szAccNo: undefined,
        email: undefined,
        szPasswd: undefined,
        jwt: undefined,
        exp: undefined,
    },
    operatingHour: {
        ['nCurBusiDate']: undefined,
        ['nPrevBusiDate']: undefined,
        ['nNextBusiDate']: undefined,
    },
    favorites: { data: [], trReceived: false },
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state) => {
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.data = {
                szAccNo: undefined,
                szPasswd: undefined,
                jwt: undefined,
                email: undefined,
                exp: undefined,
            };
        },
        setCurrentUser: (state, action: PayloadAction<{
            szAccNo: string; 
            email?: string; 
            szPasswd: string; 
            jwt?: string; 
            exp?: number; 
        }>) => {
            state.isLoggedIn = true;
            state.data = action.payload;
        },
        switchLanguage: (state, action: PayloadAction<{ language: LanguageType }>) => {
            state.language = action.payload.language;
        },
        setOperatingHour: (state, action: PayloadAction<{
            ['nCurBusiDate']: number;
            ['nPrevBusiDate']: number;
            ['nNextBusiDate']: number;
        }>) => {
            state.operatingHour = action.payload;
        },
        switchScreenSize: (state, action: PayloadAction<any>) => {
            state.screenSize = action.payload.screenSize;
        },
        initFavorites: (state, action: PayloadAction<any[]>) => {
            state.favorites.data = action.payload;
        },
    },
});

// 액션 생성자
export const { 
    login, 
    logout, 
    setCurrentUser, 
    switchLanguage, 
    setOperatingHour, 
    switchScreenSize, 
    initFavorites 
} = userSlice.actions;

// 리듀서
export const userReducer = userSlice.reducer;
