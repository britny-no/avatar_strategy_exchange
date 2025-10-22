import { combineReducers } from 'redux';

import { userReducer } from './userReducer';
import { symbolReducer } from './symbolReducer';
import { messageReducer } from './messageReducer';
import { orderReducer } from './orderReducer';
import { marginAndLeverageReducer } from './marginAndLeverageReducer';
import { agentReducer } from './agentReducer';
import { stateReducer } from './stateReducer';
import { chartReducer } from './chartReducer';

const reducers = combineReducers({
    userReducer,
    symbolReducer,
    agentReducer,
    stateReducer,
    chartReducer,
    messageReducer,
    marginAndLeverageReducer,
    orderReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
