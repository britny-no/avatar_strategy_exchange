import { useEffect, useState } from 'react';

import formatNumber from '../lib/formatNumber';
import { formatLiveDate, formatTrDate } from '../lib/formatDate';
import useNinetyOne from './useNinetyOne';
import { useTypedSelector } from '../states/useTypedSelector';
import { TransactionInputType } from '../types';

const resultArr = [];

type TradeDataType = {
    close: string;
    volume: number;
    time: string;
    buyOrSell: string;
};

// 차트조회 tr
const getInputForChart = ({ symbol }): TransactionInputType => ({
    Header: {
        function: 'D',
        termtype: 'HTS',
        trcode: 't9731',
    },
    Input1: {
        szCurNo: symbol,
        cTermDiv: '1',
        szCritDate: '99999999',
        szCritTime: '999999999',
        nMinTerm: '1',
        nReqCnt: '10',
    },
});

const useTradeList = (symbol: string): Array<TradeDataType> => {
    const [data, setData] = useState<Array<TradeDataType>>([]);

    const chartData = useTypedSelector((state) => state.stateReducer['t9731']);
    const trResult = chartData && chartData.Output1 ? chartData.Output1 : [];
    const currentSymbol = useTypedSelector((state) => state.symbolReducer.symbols[symbol]);
    const pipLowest = currentSymbol?.PIP_LOWEST;
    const { data: liveResult } = useNinetyOne(symbol);
    const lastLiveResult = liveResult[0] ? liveResult[0] : [];

    // useEffect(() => {
    //     symbol && socketService.sendToAgent(getInputForChart({ symbol }));
    // }, [symbol]);

    /*==========================
    | When trresult arrive,    |
    | init data                |
    ===========================*/
    useEffect(() => {
        if (trResult.length > 0) {
            setData(parseTrData(trResult));
        }
    }, [trResult.length]);

    /*============================
    | When 91 live data arrives, |
    | push it to data            |
     ============================*/
    const TIME_INDEX_IN_NINE_ONE = 2;
    useEffect(() => {
        const lastElement = liveResult[liveResult.length - 1];
        if (!lastElement) return;

        const SZ_DATE_INDEX_IN_NINETY_ONE = 1;
        const SZ_TIME_INDEX_IN_NINETY_ONE = 2;
        const SZ_CLOSE_INDEX_IN_NINETY_ONE = 6;
        const SZ_VOLUMN_INDEX_IN_NINETY_ONE = 7;
        const SZ_BUY_PRICE_INDEX_IN_NINETY_ONE = 8;
        const SZ_BUY_OR_SELL_INDEX_IN_NINETY_ONE = 11;
        const newData = {
            close: formatNumber(lastElement[SZ_CLOSE_INDEX_IN_NINETY_ONE], pipLowest),
            volume: Number(lastElement[SZ_VOLUMN_INDEX_IN_NINETY_ONE]),
            // tradeType: ,
            time: formatLiveDate(lastElement[SZ_DATE_INDEX_IN_NINETY_ONE], lastElement[SZ_TIME_INDEX_IN_NINETY_ONE]),
            buyOrSell: lastElement[SZ_BUY_OR_SELL_INDEX_IN_NINETY_ONE],
        };
        // console.log(`heppn one`);
        setData([...data, newData]);
    }, [lastLiveResult[TIME_INDEX_IN_NINE_ONE]]);

    const parseTrData = (data) => {
        const returnArr = data.map((d) => formatTradeData(d, pipLowest));
        return returnArr;
    };

    // console.log(`data returned in useTradeList : `, data);
    return data;
};

const formatTradeData = (data, pipLowest) => {
    // {
    //   szCurNo: symbol,
    //   szTime: data[0],
    //   fOpen: data[1],
    //   fHigh: data[2],
    //   fLow: data[3],
    //   fClose: data[4],
    //   fVolume: data[5],
    // }
    const date = new Date(Number(data[0]));
    return {
        close: formatNumber(data[4], pipLowest),
        volume: data[5],
        // tradeType: ,
        time: formatTrDate(date),
        buyOrSell: data[6],
    };
};

export default useTradeList;
