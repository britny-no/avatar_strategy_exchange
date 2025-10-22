export type ScreenSizeType = 'xs' | 'sm' | 'md' | 'xl' | undefined;
export type LanguageType = 'KOR' | 'ENG';


export interface UserState {
    isLoggedIn: boolean;
    language: LanguageType;
    screenSize: ScreenSizeType;
    data: {
        szAccNo: string | undefined;
        szPasswd: string | undefined;
        jwt?: string | undefined;
        email?: string | undefined;
        exp?: number | undefined;
    };
    operatingHour: {
        ['nCurBusiDate']: number | undefined;
        ['nPrevBusiDate']: number | undefined;
        ['nNextBusiDate']: number | undefined;
    };
    favorites: { data: Array<any>; trReceived: boolean };
}


export enum UserReducerActionType {
    LOGIN = 'LOGIN',
    SWITCH_LANGUAGE = 'SWITCH_LANGUAGE',
    SET_OPERATING_HOUR = 'SET_OPERATING_HOUR',
    SET_CURRENT_USER = 'SET_CURRENT_USER',
    INIT_FAVORITES = 'INIT_FAVORITES',
    // SET_TR_RECEIVED = 'SET_TR_RECEIVED',
    SWITCH_SCREEN_SIZE = 'SWITCH_SCREEN_SIZE',
    LOGOUT = 'LOGOUT',
}


// 액션 타입의 타입을 정의합니다.
export type UserReducerActionTypeKeys = keyof typeof UserReducerActionType;
