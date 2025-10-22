import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducers from './reducers'; // 여러 리듀서 조합

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['userReducer'], // 특정 리듀서만 지속화
};

// persistReducer를 사용하여 리듀서를 감싸기
const persistedReducer = persistReducer(persistConfig, reducers);

// configureStore를 사용하여 스토어 생성
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false, // Serialize Check 문제를 피하기 위해 설정할 수 있음
        })
});

export const persistor = persistStore(store);
