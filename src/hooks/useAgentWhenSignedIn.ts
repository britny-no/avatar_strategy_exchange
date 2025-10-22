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
    refetchData: () => void;
};

export default function useAgentWhenSignedIn({ input, dependency = [], type = 'tr' }: PropsType): ReturnType {
    const [resultKey, setResultKey] = useState<string>('');
    const [refetch, setRefetch] = useState<boolean>(false);
    const state = useTypedSelector((state) => state.stateReducer[resultKey]);
    const isLoggedIn = useTypedSelector((state) => state.userReducer.isLoggedIn);
    const szAccNo = useTypedSelector((state) => state.userReducer.data.szAccNo);

    useEffect(() => {
        // Only run the code below when user is logged in and there is szAccNo
        // Or login is not required
        // 최초에만 실행되는 구역
        if (isLoggedIn || szAccNo) {
            const key = type === 'live' ? socketService.sendToAgent(input) : socketService.sendToAgent(input);
            key && setResultKey(key);
        }
    }, [isLoggedIn, szAccNo, refetch, ...dependency]);

    const refetchData = () => {
        setRefetch(!refetch);
    };

    const result = state ? state : [];
    return { [`${type}Result`]: result, refetchData };
}
