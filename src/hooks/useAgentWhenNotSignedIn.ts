import { useEffect, useState } from 'react';
import socketService from '../states/socketAgent/SocketService';
import { useTypedSelector } from '../states/useTypedSelector';
import { TransactionInputType } from '../types';

type PropsType = {
    input: TransactionInputType;
    dependency?: Array<any>;
    type?: 'tr' | 'live';
};

type ReturnType = {
    trResult?: any;
    liveResult?: any;
};

const useAgentWhenNotSignedIn = ({ input, dependency = [], type = 'tr' }: PropsType): ReturnType => {
    const [resultKey, setResultKey] = useState<string>('');
    const state = useTypedSelector((state) => state.stateReducer[resultKey]);

    useEffect(() => {
        const key = type === 'live' ? socketService.sendToAgent(input, 'Key1') : socketService.sendToAgent(input);
        key && setResultKey(key);
    }, [...dependency]);

    const result = state ? state : [];
    return { [`${type}Result`]: result };
};

export default useAgentWhenNotSignedIn;
