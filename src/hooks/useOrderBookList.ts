import { useEffect, useMemo, useState } from 'react';
import { formatOrderBook } from '../lib/formatOrderBook';
import useNinetyTwo from './useNinetyTwo';
import useAgentWhenNotSignedIn from './useAgentWhenNotSignedIn';
import formatNumber from '../lib/formatNumber';
import useSymbolList from './useSymbolList';
import { TransactionInputType } from '../types';
import { useTypedSelector } from '../states/useTypedSelector';

/*===================================================
| Return tr data when there is no live data yet     |
| When there is live data, return live data instead |
====================================================*/

const getTrInput = ({ symbol }): TransactionInputType => ({
    Header: {
        function: 'D',
        termtype: 'HTS',
        trcode: 't9733',
    },
    Input1: {
        szCurNo: symbol,
    },
});

const defaultReturnValue = {
    buyArr: [],
    sellArr: [],
};

export type OrderType = {
    acc: number;
    price: string;
    changePerc: string;
    rem: number;
    remInNumber: number;
};

type ReturnType = {
    buyArr: Array<OrderType>;
    sellArr: Array<OrderType>;
    pipLowest: number;
    fClose: number;
    fPreClose: number;
    fairValue: string;
    buyTotal: number;
    sellTotal: number;
};

const useOrderBookList = (symbolArg): ReturnType => {
    const { symbols: symbolList } = useSymbolList();

    const { currentSymbol, currentSymbolData } = useSymbolList();

    const symbol = symbolList.find((symbol) => symbol.CUR_NO === currentSymbol);

    const pipLowest = symbol ? symbol.PIP_LOWEST : 2;
    const preClose = symbol ? symbol.fPreClose : 0;

    const { trResult } = useAgentWhenNotSignedIn({
        input: getTrInput({ symbol: symbolArg }),
        dependency: [currentSymbol],
    });

    const { data: liveData } = useNinetyTwo(symbolArg);
    const returnTrOrLiveData = () => {
        return liveData.length === 0
            ? formatOrderBook(trResult.Output1, 'tr', pipLowest, preClose)
            : formatOrderBook(liveData[liveData.length - 1].Output1, 'live', pipLowest, preClose);
    };


    // When trResult is array is when tr result has not arrived so default [] was returned.
    const returnValue = Array.isArray(trResult) ? defaultReturnValue : returnTrOrLiveData();
    const buyArr = returnValue.buyArr as Array<OrderType>;
    const sellArr = returnValue.sellArr as Array<OrderType>;
    const fClose = symbol ? symbol.fClose : 0;
    const fPreClose = symbol ? symbol.fPreClose : 0;
    const fairValue = formatNumber(fClose * (1 + 0.03 * (50 / 365)), pipLowest);
    const buyTotal = buyArr.length && buyArr[buyArr.length - 1].acc;
    const sellTotal = sellArr.length && sellArr[0].acc;

    return {
        buyArr,
        sellArr,
        pipLowest,
        fClose,
        fPreClose,
        fairValue,
        buyTotal,
        sellTotal,
    };
};

export default useOrderBookList;
