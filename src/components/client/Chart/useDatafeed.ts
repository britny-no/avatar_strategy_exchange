import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketService from '../../../states/socketAgent/SocketService';
import moment from 'moment';
import 'moment-timezone';


const EXCHANGE = 'BMX';

const configurationData = {
    supported_resolutions: ['1', '5', '10', '60', '1D', '1W', '1M'],
    exchanges: [
        {
            value: EXCHANGE,
            name: EXCHANGE,
            desc: EXCHANGE,
        },
    ],
    symbols_types: [
        {
            name: 'crypto',
            value: 'crypto',
        },
    ],
};

const exceptCoin = (currentSymbol) => {
    const bias = ['BTCUSDT', 'ETHUSDT', 'XRPUSDT', 'DOGEUSDT'];
    const ob = {};
    let key = 0;

    bias.filter((v) => v !== currentSymbol).forEach((v) => {
        key += 1;
        ob[`Key${key}`] = v;
    });

    return ob;
};

const dotCoin = {
    'BTCUSDT' : 100,
    'ETHUSDT' : 100,
    'XRPUSDT' : 10000,
    'DOGEUSDT' : 100000,

}
export default function useDatafeed(chartData, currentSymbol) {
    return {
        onReady: (callback) => {
            setTimeout(() => callback(configurationData));
        },
        searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
            // DO something here
        },
        resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
            const symbolInfo = {
                ticker: EXCHANGE + ':' + currentSymbol,
                name: currentSymbol,
                description: currentSymbol,
                type: 'crypto',
                exchange: EXCHANGE,
                timezone: import.meta.env.VITE_TIME_ZONE,

                has_empty_bars: true,
                session: '24x7',
                minmov: 1,
                pricescale: dotCoin[currentSymbol],
                has_intraday: true,
                has_seconds: true,
                intraday_multipliers: ['1D', '1W', '1Y', '1'],
                // has_no_volume: false,
                has_weekly_and_monthly: false,
                supported_resolutions: configurationData.supported_resolutions,
                default_resolution: '1',
                volume_precision: 2,
                data_status: 'streaming',
            };
            setTimeout(() => onSymbolResolvedCallback(symbolInfo));
        },

        // 화면에 데이터가 꽉차지 않으면 계속 렌더링됨
        getBars: async (
            symbolInfo,
            resolution,
            from,
            to,
            onHistoryCallback,
            onErrorCallback,
            firstDataRequest = false,
        ) => {
            const chartDataArr = chartData.Output1;
            // console.log(sessionStorage.req_end)
            if (!chartDataArr ) { 
                onHistoryCallback([], { noData: true });
                return;
            } else {
                sessionStorage.bulkEnd = chartDataArr[0]
                    ? moment(Number(chartDataArr[chartDataArr.length - 1][0])).format('HHmmssSSS')
                    : null;
                sessionStorage.chartEnd = moment(to * 1000).format('HHmmssSSS');
                sessionStorage.time = 1;
                sessionStorage.pre_time = 'null';

                const bars = chartDataArr.map((bar) => {
                    return {
                        time: Number(bar[0]),
                        low: bar[3],
                        high: bar[2],
                        open: bar[1],
                        close: bar[4],
                        volume: bar[5],
                    };
                });

                onHistoryCallback(bars, { noData: false });
                return;
            }
        },
        subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
            // console.log('')
            const callbackEvent = (event) => {
                const json = JSON.parse(event.data);

                if (!json.Output1) {
                    return;
                }

                const trcode = json.Header.trcode, symbol = String(json.Output1?.szSymbol).trim();
                const { szClose, szTime, szVolume } = json.Output1;

                // const bulkEnd = sessionStorage.chartEnd;
                const chartEnd = sessionStorage.chartEnd;
                const dif = Number(chartEnd) - Number(szTime);

                if (chartEnd && `91_${currentSymbol}` === `${trcode}_${symbol}`) {
                    // bulk data의 마지막 row의 시간값보다 실시간 내려오는 data의 시간 값이 더 작으면 차이만큼 더해줘야합니다
                    const pre_time_moment = moment(sessionStorage.pre_time, 'HHmmssSSS');
                    const live_time_moment = moment(szTime, 'HHmmssSSS');

                    // console.log(pre_time_moment)
                    //bulk 마지막 값보다 실시간 값이 작으면, buil에 ms 추가
                    const receive_filter_time =
                        dif > 0
                            ? moment(chartEnd, 'HHmmssSSS').add(sessionStorage.time, 'milliseconds')
                            : live_time_moment;

                    //이전 시간 값과 실시간으로 내려온 값의 시간차구함
                    const milliseconds_dif =
                        sessionStorage.pre_time !== 'null' && dif < 0
                            ? pre_time_moment.diff(live_time_moment, 'milliseconds')
                            : 0;
                    //이전 시간보다 실시간 값이 작을경우 그 차이만큼 더하기
                    const excute_time =
                        pre_time_moment < live_time_moment
                            ? receive_filter_time
                            : receive_filter_time.add(1 + milliseconds_dif, 'milliseconds');
                    sessionStorage.time = Number(sessionStorage.time) + 1;
                    sessionStorage.pre_time = excute_time.format('HHmmssSSS');

                    const ob = {
                        close: Number(szClose),
                        high: Number(szClose),
                        isBarClosed: true,
                        isLastBar: false,
                        low: Number(szClose),
                        open: Number(szClose),
                        time: excute_time,
                        volume: Number(szVolume),
                    };
                    onRealtimeCallback(ob);
                }
            };

            socketService.ws.removeEventListener('message', callbackEvent);
            socketService.ws.addEventListener('message', callbackEvent);
        },
        unsubscribeBars: (subscriberUID) => {
            // unsubscribeFromStream(subscriberUID);
            // usdDatafedd 끄는법 없나?
            // const BMX:BNC_BTCUSDT_#_1
            // const info = {
            //     Header : {
            //         function : "U",
            //         termtype : "HTS",
            //         trcode : "91"
            //     },
            //     Input1 : exceptCoin(symbolInfo.name)
            // }
            // socketService.sendToAgent(info);
            // console.log(subscriberUID.split(':')[1].split('_')[1].split('_')[0])
        },
    };
}
