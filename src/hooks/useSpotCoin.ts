import { useEffect, useMemo, useState } from 'react';
import { formatLiveData, formatTrData, initData } from '../lib/formatSymbol';
import getLastItemIndex from '../lib/getLastItem';
import socketService from '../states/socketAgent/SocketService';
import { useTypedSelector } from '../states/useTypedSelector';

const initialData = initData();
const symbolOb = {
    'BTCUSDT' : 1,
    'ETHUSDT' : 2,
    // 'USDUSDT' : 3,
    'XRPUSDT' : 4,
}


const getInputForSpots = () => ({
    Header: { function: 'D', termtype: 'HTS', trcode: 't5253' },
    Input1: { szMemberNo: import.meta.env.REACT_APP_SZ_MEMBER_NO, szTradeType: '55' },
});

const getInputForCurrentPrice = ({ symbol }) => ({
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

const getInputForNinetyOne = ({ symbol }) => ({
    Header: { function: 'A', termtype: 'HTS', trcode: '91' },
    Input1: { Key1: symbol },
});

const useSpotCoin = (symbol) => {
    const [trListResultKey, setTrListResultKey] = useState<string>('');
    const [trResultKey, setTrResultKey] = useState<string>('');

    const trListState = useTypedSelector((state) => state.stateReducer[trListResultKey]);
    const trState = useTypedSelector((state) => state.stateReducer[trResultKey]);
    const liveState = useTypedSelector((state) => state.stateReducer[`91_${symbol}`]);

    useEffect(() => {
        if (symbol) {
            const tr_list_result: string | undefined = socketService.sendToAgent(getInputForSpots());
            tr_list_result && setTrListResultKey(tr_list_result);
            const tr_result: string | undefined = socketService.sendToAgent(getInputForCurrentPrice({ symbol }));
            tr_result && setTrResultKey(tr_result);

            socketService.sendToAgent(getInputForNinetyOne({ symbol }), 'Key1');
        }
    }, [symbol]);

    const returnTrResult = () => {
        const obj = trState && trState.Output1;
        const pipLowest =
            trListState && trListState.Output2 && trListState.Output2.filter((spotArr) => spotArr[0] === symbol)[7];
        const result = obj && pipLowest ? formatTrData(obj, pipLowest) : initialData;
        return result;
    };

    const returnLiveResult = () => {
        const obj = liveState && liveState[getLastItemIndex(liveState)].Output1;

        const pipLowest =
            trListState && trListState.Output2 && trListState.Output2.filter((spotArr) => spotArr[0] === symbol)[7];
        const result = liveState && obj && liveState.length > 0 ? formatLiveData(obj, pipLowest) : initialData;
        return result;
    };
    const result =
        trState && trState.Output1 && liveState && liveState.length > 0 ? returnLiveResult() : returnTrResult();

    console.log(`lookup : `, result);
    return result;
};

export default useSpotCoin;
