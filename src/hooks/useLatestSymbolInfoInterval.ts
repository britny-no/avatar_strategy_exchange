import { useState, useEffect } from 'react';
import { formatSymbolData, formatSymbolLiveData } from '../lib/formatSymbol';
import useNinetyOneInterval from './useNinetyOneInterval';

const useLatestSymbolInfo = ({ symbolInfo }) => {
    const { lastElement } = useNinetyOneInterval(symbolInfo.CUR_NO);
    const [info, setInfo] = useState(symbolInfo);

    useEffect(() => {
        if (Object.keys(symbolInfo).length > 0) {
            const {
                close,
                volume,
                szHigh,
                szLow,
                maxOrderCount,
                curNo,
                preClose,
                status,
                changePerc,
                isFavorite,
            } = formatSymbolData(symbolInfo, symbolInfo.PIP_LOWEST);

            setInfo({
                close,
                volume,
                szHigh,
                szLow,
                maxOrderCount,
                curNo,
                preClose,
                status,
                changePerc,
                isFavorite,
            });
        }
    }, [symbolInfo]);

    useEffect(() => {
        if (Object.keys(lastElement).length > 0) {
            const { close, szHigh, szLow, volume, curNo, preClose, status, changePerc } = formatSymbolLiveData(
                lastElement,
                symbolInfo.PIP_LOWEST,
            );
            // console.log(`lookup3 : `, close, szHigh, szLow, volume, curNo, preClose, status, changePerc);

            setInfo({
                ...info,
                close,
                szHigh,
                szLow,
                volume,
                curNo,
                preClose,
                status,
                changePerc,
            });
        }
    }, [lastElement]);

    // console.log(`lookup2 : `, info);

    return info;
};

export default useLatestSymbolInfo;
