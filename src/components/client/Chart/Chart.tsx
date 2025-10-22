import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { widget } from './lib/charting_library';
import useDatafeed from './useDatafeed';
import styled from 'styled-components';
import useSymbolList from '../../../hooks/useSymbolList';
import socketService from '../../../states/socketAgent/SocketService';
import { useDispatch, useSelector } from 'react-redux';
import { loadingChart } from '@/states/reducers/chartReducer';
import { useTypedSelector } from '@/states/useTypedSelector';

const UP_COLOR = '#41DA78';
const DOWN_COLOR = '#F8585A';
const PRIMARY_COLOR = '#1E1F23';
const LINE_COLOR = '#33353B';

function Chart({
    symbol = 'BCE2009Q03BU',
    interval = 'D',
    containerId = 'chart_container',
    libraryPath = '/charting_library/',
    chartsStorageUrl = 'https://saveload.tradingview.com',
    chartsStorageApiVersion = '1.1',
    clientId = 'tradingview.com',
    userId = 'public_user_id',
    fullscreen = false,
    autosize = true,
    studiesOverrides = {},
}) {
    const chartDataBody = useTypedSelector((state) => state.chartReducer.chartData_t9731);
    const chartData = chartDataBody.data;
    const dispatch = useDispatch();
    const { currentSymbol } = useSymbolList();
    const [intervalState, setIntervalState] = useState('1');
    const datafeed = useDatafeed(chartData, currentSymbol); // Get the datafeed

    useEffect(() => {
        if (!datafeed) return; // Wait until datafeed is defined

        const widgetOptions = {
            symbol,
            datafeed,
            interval: intervalState,
            container_id: containerId,
            library_path: libraryPath,
            locale: 'en',
            disabled_features: ['use_localstorage_for_settings'],
            enabled_features: ['study_templates'],
            charts_storage_url: chartsStorageUrl,
            charts_storage_api_version: chartsStorageApiVersion,
            client_id: clientId,
            user_id: userId,
            fullscreen,
            autosize,
            studies_overrides: studiesOverrides,
            timezone: import.meta.env.VITE_TIME_ZONE,
            theme: 'dark',
            toolbar_bg: PRIMARY_COLOR,
            loading_screen: {
                backgroundColor: PRIMARY_COLOR,
            },
            overrides: {
                'paneProperties.background': PRIMARY_COLOR,
                'paneProperties.vertGridProperties.color': LINE_COLOR,
                'paneProperties.horzGridProperties.color': LINE_COLOR,
                'scalesProperties.textColor': LINE_COLOR,
                'scalesProperties.lineColor': LINE_COLOR,
                'mainSeriesProperties.candleStyle.upColor': UP_COLOR,
                'mainSeriesProperties.candleStyle.downColor': DOWN_COLOR,
            },
        };

        const tvWidget = new widget(widgetOptions);

        tvWidget.onChartReady(() => {
            tvWidget.addCustomCSSFile('./custom-chart-css.css');

            tvWidget.activeChart().onIntervalChanged().subscribe(null, (interval) => {
                const nMinTerm = {
                    '1': 1,
                    '5': 5,
                    '10': 10,
                    '60': 60,
                    '1D': 1,
                    '1W': 7,
                    '1M': 30,
                };
                const info = {
                    Header: {
                        function: 'D',
                        termtype: 'HTS',
                        trcode: 't9731',
                        trid: '1',
                    },
                    Input1: {
                        szCurNo: currentSymbol,
                        cTermDiv: '2',
                        szCritDate: '99999999',
                        szCritTime: moment().format('HHmmssSSS'),
                        nMinTerm: nMinTerm[interval],
                        nReqCnt: '500',
                    },
                };
                if (['1D', '1W', '1M'].includes(interval)) {
                    setIntervalState(interval);
                    info.Input1.cTermDiv = '3';
                }
                setIntervalState(interval);
                socketService.sendToAgent(info);
                dispatch(loadingChart());
            });
        });

        return () => {
            tvWidget.remove();
            dispatch(loadingChart());
            sessionStorage.bulkEnd = null;
            sessionStorage.chartEnd = null;
        };
    }, [datafeed, chartData, intervalState]); // Use datafeed in dependency array

    useEffect(() => {
        setIntervalState('1');
        dispatch(loadingChart());
        sessionStorage.bulkEnd = null;
        sessionStorage.chartEnd = null;
    }, [currentSymbol]);

    return (
        <>
            <ChartCont id={containerId} className={'chart_container'} style={{ height: '100%' }} />
        </>
    );
}


export default Chart;

const ChartCont = styled.div`
    .chart-page {
        --tv-color-pane-background: #ffffff;
    }

    html.theme-dark .group-wWM3zP_M- {
        background: #ffffff !important;
    }

    iframe {
        --tv-color-pane-background: #ffffff;

        html {
            background-color: white;
        }
    }

    .wrap-3tiHesTk div {
        background-color: ${({ theme }) => theme.colors.primaryColor} !important;
    }
`;