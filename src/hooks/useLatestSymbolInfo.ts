import { useEffect, useState } from 'react';
import { formatSymbolData, formatSymbolLiveData } from '@/lib/formatSymbol';
import useNinetyOne from './useNinetyOne';

const useLatestSymbolInfo = ({ symbolInfo }) => {
    const { lastElement } = useNinetyOne(symbolInfo.CUR_NO);

    // Extract data from symbolInfo and lastElement directly
    const formattedSymbolInfo = Object.keys(symbolInfo).length > 0
        ? formatSymbolData(symbolInfo, symbolInfo.PIP_LOWEST)
        : {};

    const formattedLastElement = Object.keys(lastElement).length > 0
        ? formatSymbolLiveData(lastElement, symbolInfo.PIP_LOWEST)
        : {};

    // Merge both objects, prioritizing lastElement data if present
    const info = {
        ...formattedSymbolInfo,
        ...formattedLastElement,
    };

    return info;
};

export default useLatestSymbolInfo;
