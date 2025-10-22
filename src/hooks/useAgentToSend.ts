import { useState } from 'react';
import socketService from '../states/socketAgent/SocketService';
import { useTypedSelector } from '../states/useTypedSelector';
import { TransactionInputType } from '../types';

type UseAgentToSendReturnType = {
    result: Record<string, any>;
    sendTransaction: (input: TransactionInputType) => void;
};

const useAgentToSend = (): UseAgentToSendReturnType => {
    const [resultKey, setResultKey] = useState<string>('');
    const state = useTypedSelector((state) => state.stateReducer[resultKey]);

    const sendTransaction = (input: TransactionInputType) => {
        console.log('주문을 날렸습니다 input은 : ', input);
        const resultKey = socketService.sendToAgent(input);
        resultKey && setResultKey(resultKey);
    };

    const result = state ? state : [];

    return { result, sendTransaction };
};

export default useAgentToSend;
