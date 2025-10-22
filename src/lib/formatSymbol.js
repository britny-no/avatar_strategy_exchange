import { formatLiveDate, formatTrDate } from './formatDate';
import formatNumber from './formatNumber';
import formatNumberAbs from './formatNumberAbs';

//9132 symbols current
//91 live data

export const initData = () => ({
    loading: true,
    symbol: '',
    date: '',
    time: '',
    open: '0',
    high: '0',
    low: '0',
    close: '0',
    volume: 0,
    preClose: '0',
    buyPrice: '0',
    sellPrice: '0',
    diff: 0,
    changePerc: 0,
    status: 'stable',
    tradeType: '',
    fairValue: '0',
});

export const formatTrData = (obj, pipLowest) => {
    return {
        loading: false,
        type: 'tr',
        symbol: obj.szCurNo,
        date: obj.szDate,
        time: formatTrDate(new Date(Number(obj.szTime))),
        open: formatNumber(obj.fOpen, pipLowest),
        high: formatNumber(obj.fHigh, pipLowest),
        low: formatNumber(obj.fLow, pipLowest),
        close: formatNumber(obj.fClose, pipLowest),
        volume: Number(obj.fVolume),
        preClose: formatNumber(obj.fPreClose, pipLowest),
        buyPrice: formatNumber(obj.fBuyPrice, pipLowest),
        sellPrice: formatNumber(obj.fSellPrice, pipLowest),
        diff: formatNumberAbs(obj.fClose - obj.fPreClose, pipLowest),
        changePerc: formatNumberAbs(((obj.fClose - obj.fPreClose) / obj.fPreClose) * 100, 2),
        status:
            !!Number(obj.fPreClose) && obj.fClose - obj.fPreClose > 0
                ? 'up'
                : obj.fClose - obj.fPreClose < 0
                ? 'down'
                : 'stable',
        tradeType: obj.fClose === obj.fSellPrice ? 'buy' : 'sell',
        fairValue: formatNumber(obj.fClose * (1 + 0.03 * (50 / 365)), pipLowest),
    };
};

export const formatLiveData = (obj, pipLowest = 2) => {
    return {
        loading: false,
        type: 'live',
        symbol: obj.szSymbol,
        date: obj.szDate,
        time: formatLiveDate(obj.szDate, obj.szTime),
        open: obj.szOpen,
        high: formatNumber(obj.szHigh, pipLowest),
        low: formatNumber(obj.szLow, pipLowest),
        close: formatNumber(obj.szClose, pipLowest),
        volume: Number(obj.szVolume),
        preClose: formatNumber(obj.szPreClose, pipLowest),
        buyPrice: formatNumber(obj.szBuyPrice, pipLowest),
        sellPrice: formatNumber(obj.szSellPrice, pipLowest),
        diff: formatNumberAbs(obj.szClose - obj.szPreClose, pipLowest),
        changePerc: formatNumberAbs(((obj.szClose - obj.szPreClose) / obj.szPreClose) * 100, 2),
        status:
            !!Number(obj.szPreClose) && obj.szClose - obj.szPreClose > 0
                ? 'up'
                : obj.szClose - obj.szPreClose < 0
                ? 'down'
                : 'stable',
        tradeType: obj.szClose === obj.szSellPrice ? 'buy' : 'sell',
        fairValue: formatNumber(obj.szClose * (1 + 0.03 * (50 / 365)), pipLowest),
    };
};

export const formatSymbolData = (obj, pipLowest = 2) => {
    if (!obj) return {};

    const getChangePerc = () => {
        if (obj.fPreClose === 0) {
            return '0.00';
        } else {
            return (((Number(obj.fClose) - Number(obj.fPreClose)) / Number(obj.fPreClose)) * 100).toFixed(2);
        }
    };

    const close = formatNumber(obj.fClose, pipLowest);
    const volume = obj.fVolume;
    const curNo = obj.CUR_NO;
    const szHigh = formatNumber(obj.fHigh, pipLowest);
    const szLow = formatNumber(obj.fLow, pipLowest);
    const maxOrderCount = obj.MAX_ORDCNT;
    const preClose = formatNumber(obj.fPreClose, pipLowest);
    const status = obj.fPreClose > obj.fClose ? 'down' : 'up';
    const changePerc = getChangePerc();
    const isFavorite = obj.isFavorite;
    const isUp = Number(changePerc) > 0;

    return {
        close,
        szHigh,
        szLow,
        maxOrderCount,
        volume,
        curNo,
        preClose,
        status,
        changePerc,
        isFavorite,
        isUp,
    };
};

export const formatSymbolLiveData = (obj, pipLowest = 2) => {
    if (!obj) return {};

    // Object.keys(obj).forEach((key) => {
    //   obj[key] = Number(obj[key]);
    // });

    const getChangePerc = () => {
        if (isNaN(Number(obj.szPreClose))) {
            return '0.00';
        } else {
            return (((Number(obj.szClose) - Number(obj.szPreClose)) / Number(obj.szPreClose)) * 100).toFixed(2);
        }
    };

    const close = formatNumber(Number(obj.szClose), pipLowest);
    const volume = obj.fVolume;
    const curNo = obj.szSymbol;
    const szHigh = formatNumber(obj.szHigh, pipLowest);
    const szLow = formatNumber(obj.szLow, pipLowest);
    const preClose = formatNumber(Number(obj.szPreClose), pipLowest);
    const status = Number(obj.szPreClose) > Number(obj.szClose) ? 'down' : 'up';
    const changePerc = getChangePerc();
    const isUp = Number(changePerc) > 0;

    return {
        close,
        szHigh,
        szLow,
        volume,
        curNo,
        preClose,
        status,
        changePerc,
        isUp,
    };
};

// szBuyPrice: "       47000.00000000"
// szClose: "       47000.00000000"
// szDate: "20210506"
// szHigh: "       47000.00000000"
// szLow: "       47000.00000000"
// szOpen: "       47000.00000000"
// szPreClose: "       60000.00000000"
// szSellPrice: "       60000.00000000"
// szSymbol: "BCE2009Q03BU"
// szTime: "214606778"
// szVolume: "           1.00000000"
