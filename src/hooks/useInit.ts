/*=======================================================================
선택된종목에상관없이 등록해야할 실시간 및 tr.
1.t5511 상장종목조회 => 조회데이터도착시에 symbolReducer에 dispatch.
2.조회 후에 t9732로 각 심볼에대한 현재가 조회후 1번에서 생성한 object에 append.
3.각 심볼별로 live data 등록 91_SYMBOL_NAME
=========================================================================*/
import { useEffect } from 'react';
import useAgentWhenNotSignedIn from './useAgentWhenNotSignedIn';
import { useTypedSelector } from '../states/useTypedSelector';
import { TransactionInputType } from '../types';
import socketService from '../states/socketAgent/SocketService';

const getLiveInputForSymbol = ({ symbol }): TransactionInputType => {
    return {
        Header: {
            function: 'A', // 응답시 'F'
            termtype: 'HTS',
            trcode: '91',
        },
        Input1: {
            Key1: symbol, // symbol
        },
    };
};

const symbolOb = {
    'BTCUSDT' : 1,
    'ETHUSDT' : 2,
    // 'USDUSDT' : 3,
    'XRPUSDT' : 4,
}

const getTrInfoForSymbolsCurrentPrice = ({ symbol }): TransactionInputType => ({
    Header: {
        function: 'D',
        termtype: 'HTS',
        trcode: 't9732',
        trid: symbolOb[symbol]
    },
    Input1: {
        szCurNo: symbol,
    },
});

const symbolsInfo: TransactionInputType = {
    Header: { function: 'D', termtype: 'HTS', trcode: 't5511' },
    Input1: { szMemberNo: import.meta.env.REACT_APP_SZ_MEMBER_NO },
};

const useInit = () => {
    // 상장된종목리스트조회후 symbolReducer에 푸쉬
    const trResult = useAgentWhenNotSignedIn({
        input: symbolsInfo,
    });

    const symbols = useTypedSelector((state) => state.symbolReducer.symbols);
    useEffect(() => {
        // When the result of symbol trnasaction arrive.
        if (Object.entries(symbols).length !== 0) {
            Object.entries(symbols).forEach((symbolObj) => {
                //Send transaction to get current price per symbol
                // sendToAgent(ws, getTrInfoForSymbolsCurrentPrice({ symbol: symbolObj[0] }));
                socketService.sendToAgent(getTrInfoForSymbolsCurrentPrice({ symbol: symbolObj[0] }));
                //Send transaction to register symbol's live data
                // sendToAgent(ws, getLiveInputForSymbol({ symbol: symbolObj[0] }), 'Key1');
                socketService.sendToAgent(getLiveInputForSymbol({ symbol: symbolObj[0] }), 'Key1');
            });
        }
    }, [symbols]);

    return {};
};

export default useInit;
