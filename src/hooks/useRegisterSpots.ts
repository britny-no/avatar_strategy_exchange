import React, { useEffect } from 'react';
import socketService from '../states/socketAgent/SocketService';
import { useTypedSelector } from '../states/useTypedSelector';
import { TransactionInputType } from '../types';

const getInputForSpots = (): TransactionInputType => ({
    Header: { function: 'D', termtype: 'HTS', trcode: 't5253' },
    Input1: { szMemberNo: process.env.REACT_APP_SZ_MEMBER_NO, szTradeType: '55' },
});

const getInputForNinetyOne = ({ symbol }): TransactionInputType => ({
    Header: { function: 'A', termtype: 'HTS', trcode: '91' },
    Input1: { Key1: symbol },
});

const symbolOb = {
    'BTCUSDT' : 1,
    'ETHUSDT' : 2,
    // 'USDUSDT' : 3,
    'XRPUSDT' : 4,
}


const getInputForCurrentPrice = ({ symbol }) => ({
    Header: {
        function: 'D',
        termtype: 'HTS',
        trcode: 't9732',
        trid: symbolOb[symbol],
    },
    Input1: {
        szCurNo: symbol,
    },
});

const SYMBOL_INDEX = 0;

const useRegisterSpots = () => {
    const result = useTypedSelector((state) => state.stateReducer['t5253']);
    const spotList = result?.Output2 ? result.Output2 : [];

    useEffect(() => {
        socketService.sendToAgent(getInputForSpots());
    }, []);

    useEffect(() => {
        if (!result) return;
        spotList.map((spotInfoArr) => {
            socketService.sendToAgent(getInputForNinetyOne({ symbol: spotInfoArr[SYMBOL_INDEX].trim() }));
            socketService.sendToAgent(getInputForCurrentPrice({ symbol: spotInfoArr[SYMBOL_INDEX].trim() }));
        });
    }, [result]);

    return {};
};

export default useRegisterSpots;
