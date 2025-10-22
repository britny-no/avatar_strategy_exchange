import { useCallback, useEffect, useMemo, useState } from 'react';
import useNinetyEight from '../../../../hooks/useNinetyEight';
import useNinetyFive from '../../../../hooks/useNinetyFive';
import useSymbolList from '../../../../hooks/useSymbolList';
import formatNumber from '../../../../lib/formatNumber';
import { useTypedSelector } from '../../../../states/useTypedSelector';
import { isSameOrderId, translateSzPoCode } from '../common/commonUtil';
import {
    GROSS_PL_INDEX_IN_OPEN_POSITIONS,
    LIMIT_PRC_INDEX_IN_OPEN_POSITIONS,
    STOP_PRC_INDEX_IN_OPEN_POSITIONS,
    SZ_CUR_NO_INDEX_IN_OPEN_POSITIONS,
    SZ_CUST_ITEM_INDEX_IN_OPEN_POSITIONS,
    SZ_LIMIT_ITEM_INDEX_IN_OPEN_POSITIONS,
    SZ_QUOTE_INDEX_IN_OPEN_POSITIONS,
    SZ_RATE_INDEX_IN_OPEN_POSITIONS,
    SZ_STOP_ITEM_INDEX_IN_OPEN_POSITIONS,
    TOTAL_PL_INDEX_IN_OPEN_POSITIONS,
} from './openPositionsIndices';
import useData from './useData';

/*==============================
| 95번 실시간체결 데이터 indices |
===============================*/
const TICEKT_NO_INDEX = 34;
const CUR_NO_INDEX = 5;
const SZ_SIDE_INDEX = 20;
const F_AMOUNT_INDEX = 8;
const SZ_RATE_INDEX = 9;
const SZ_QUOTE_INDEX = 10;
const F_INTEREST_INDEX = 35;
const SZ_STATE_INDEX = 21;
const SZ_EXE_TIME_INDEX = 11;

/*=============================
|  95번 실시간체결 체결유형     |
==============================*/
const BUY_ORDER_CONCLUDED = '079';
const SELL_ORDER_CONCLUDED = '081';
const CLOSE_SELL_CONCLUDED = '080'; //환매수
const CLOSE_BUY_ORDER_CONCLUDED = '082'; //전매도

/*=============================
|  98번 stop/limit 등록 실시간 |
==============================*/
const C_STATUS_INDEX = 3;
const STOP_PRC_INDEX = 1;
const LIMIT_PRC_INDEX = 2;

const SL_INIT_BUSINESS_SERVER = 5;
const SL_CANCEL_BUSINESS_SERVER = 4;
const LIMIT_CANCEL_TRADE_SERVER = 1;
const LIMIT_INIT_TRADE_SERVER = 0;

/*================================
|  95번 실시간체결 데이터가 오면   |
|  새로운 포지션 데이터를 빌드한뒤 |
|  open positons에 푸쉬          |
================================*/
const buildNewPosition = (newPosition, operatingHourData) => {
    /*===============================================
     | !!!IMPORTANT : empty space is very important |
     ===============================================*/
    const custItem = `${newPosition[16].trim()}${newPosition[17].trim()}    ${newPosition[18].trim()}                                             `;
    const output = {
        szTicketNo: newPosition[TICEKT_NO_INDEX],
        szCurNo: newPosition[CUR_NO_INDEX],
        szSide: newPosition[SZ_SIDE_INDEX],
        szRate: parseFloat(newPosition[SZ_RATE_INDEX]),
        fLot: parseFloat(newPosition[F_AMOUNT_INDEX]),
        szQuote: newPosition[SZ_QUOTE_INDEX],
        szStop: 0,
        szLimit: 0,
        fTotalPL: '?',
        fGrossPL: '?',
        fInterest: newPosition[F_INTEREST_INDEX],
        szStatus: newPosition[SZ_STATE_INDEX],
        szOrderTime: newPosition[SZ_EXE_TIME_INDEX],
        szCustItem: custItem,
        szStopItem: '',
        szLimitItem: '',
        nPrOpenDate: operatingHourData.nCurBusiDate,
    };
    return Object.values(output);
};

type ReturnType = {
    isSuccess: boolean;
    data: Array<Array<number | string>>;
    dataColumn: Array<string>;
    originalData: Array<Array<number | string>>;
    originalDataColumn: Array<string>;
};

const useUpdateData = (): ReturnType => {
    const { symbolsInObjectForm: symbols } = useSymbolList();
    const operatingHourData = useTypedSelector((state) => state.userReducer.operatingHour);
    const { data: ninetyEightData } = useNinetyEight(); //실시간 stop/limit 데이터
    const { data: newPositionData } = useNinetyFive(); //실시간 체결 데이터
    const { data: openPositionsData, dataColumn: openPositionsDataColumn, isSuccess, refetchData } = useData(); //t3602 포지션디테일 tr 데이터
    // const orderReducerData = useTypedSelector((state) => state.orderReducer.data);
    // const stateReducerData = useTypedSelector((state) => state.stateReducer);

    // console.log('JW op', newPositionData, szRate)

    const [data, setData] = useState<Array<Array<string | number>>>([]);

    /*===========================================
    | t3602 유저 포지션디테일 tr 데이터가 도착     |
    | 했을때 초기 데이터를 initalize               |
    =============================================*/
    useEffect(() => {
        setData([...openPositionsData]);
    }, [JSON.stringify(openPositionsData)]);

    const removeRow = (orderId) => {
        return data.filter((d) => {
            return isSameOrderId(d[0] as string, orderId) ? false : true;
        });
    };

    /*===========================================================================
    | 95번 실시간체결주문데이터 업데이트 => 새로운 주문이 들어왔을때                 |
    | SIDE_NUMBER 로 분기 079 081(매수 매도) 080 082(환매수 전매도)                |
    | case 1: 079 => handleBuySellOrderConcluded => 새로운 position 빌드해서 푸쉬 |
    | case 2: 081 => handleBuySellOrderConcluded => 새로운 position 빌드해서 푸쉬 |
    | case 3: 080 => handleCloseOrderConcluded => 해당항목 position 삭제          |
    | case 4: 082 => handleCloseOrderConcluded => 해당항목 position 삭제          |
    ===========================================================================*/
    useEffect(() => {
        if (newPositionData.length <= 0) return;
        const newPosition = newPositionData[newPositionData.length - 1];
        const SIDE_NUMBER = (newPosition[SZ_SIDE_INDEX] as string).trim();

        //주문시회원처리항목 index 12,13,14
        const orderId = `${(newPosition[12] as string).trim()}${(newPosition[13] as string).trim()}${(newPosition[14] as string).trim()}`;

        switch (SIDE_NUMBER) {
            case BUY_ORDER_CONCLUDED:
                return handleBuySellOrderConcluded({ newPosition, data });
            case SELL_ORDER_CONCLUDED:
                return handleBuySellOrderConcluded({ newPosition, data });
            case CLOSE_BUY_ORDER_CONCLUDED:
                return handleCloseOrderConcluded({ orderId, data });
            case CLOSE_SELL_CONCLUDED:
                return handleCloseOrderConcluded({ orderId, data });
        }
    }, [JSON.stringify(newPositionData)]);

    // useEffect(() => {
    //     // console.log('JW',  stateReducerData[`91_BTCUSDT`])
    //     const newData = data.map(d => {
    //         const newD = [...d];
    //         console.log('JW',  stateReducerData[`91_${newD[1]}`]?.Output1?.szClose)
    //         const newPrice = stateReducerData[`91_${newD[1]}`]?.Output1?.szClose;
    //         newD[5] = newPrice;
    //
    //         return newD;
    //     })
    //     setData(newData);
    // }, [stateReducerData]);

    /*==============================
    | 새로운 position 빌드해서 푸쉬  |
    ===============================*/
    const handleBuySellOrderConcluded = useCallback(({ newPosition, data }) => {
        const newRow = buildNewPosition(newPosition, operatingHourData);
        setData([newRow, ...data]);
    }, []);

    /*=============================================
    | 해당항목 position open positions에서         |
    | 삭제 현재는 시장가청산완료로 표시              |
    ==============================================*/
    const handleCloseOrderConcluded = useCallback(({ orderId, data }) => {
        //!!! 원래용도
        // var newArr = removeRow(orderId)

        // !!! 테스트용도
        const newArr = data.map((d) => {
            if (isSameOrderId(d[SZ_CUST_ITEM_INDEX_IN_OPEN_POSITIONS], orderId)) {
                d[2] = 'Closed';
                return d;
            } else {
                return d;
            }
        });
        setData([...newArr]);
    }, []);

    /*============================================================
    | 98번 실시간 데이터 업데이트:                                 |
    | stop 초기설정 => 5번                                        |
    | stop 취소     => 4번(SL 업무서버취소)                        |
    | stop 정정     => 4번 5번                                    |
    | 리밋 초기설정 => 5번(SL초기설정) 0번(Limit 거래소서버처리)     |
    | 리밋 정정     => 4번 1번 5번 0번                             |
    | 리밋 취소     =>  4번(업무서버) 1번(거래소서버)               |
    =============================================================*/
    useEffect(() => {
        if (ninetyEightData.length <= 0) return;
        const newData = ninetyEightData[ninetyEightData.length - 1];
        const stopPrc = newData[STOP_PRC_INDEX].trim();
        const limitPrc = newData[LIMIT_PRC_INDEX].trim();
        const szOrgCustItem = `${newData[4].trim()}${newData[5].trim()}${newData[6].trim()}`;
        const C_STATUS = parseInt(newData[C_STATUS_INDEX]);
        const isStop = stopPrc !== '' && limitPrc === '';
        const price = isStop ? stopPrc : limitPrc;

        switch (C_STATUS) {
            case SL_INIT_BUSINESS_SERVER:
                return handleSLInit({ szOrgCustItem, isStop, price });
            case SL_CANCEL_BUSINESS_SERVER:
                return handleSLCancel({ szOrgCustItem, data });
            case LIMIT_INIT_TRADE_SERVER:
                const SLCustItem = `${newData[7].trim()}${newData[8].trim()}    ${newData[9].trim()}`;
                return handleLimitInitOnTradeServer({
                    szOrgCustItem,
                    price,
                    SLCustItem,
                    data,
                });
            case LIMIT_CANCEL_TRADE_SERVER:
                return handleLimitCancelOnTradeServer({ szOrgCustItem, data });
        }
    }, [JSON.stringify(ninetyEightData)]);

    /*===================================
    | cStatus가 5번(SL 업무서버접수) 일때 |
    | 현재는 한번 리프레쉬                |
    ====================================*/
    const handleSLInit = ({ szOrgCustItem, isStop, price }) => {
        if (isStop) {
            refetchData();
            return;
        }

        /* Old code: just left it here in case of improvement.*/
        // let newArr = data.map((d) => {
        //   if (isSameOrderId(d[SZ_CUST_ITEM_INDEX_IN_OPEN_POSITIONS], szOrgCustItem)) {
        //     // Testing..
        //     d[
        //       isStop
        //         ? STOP_PRC_INDEX_IN_OPEN_POSITIONS
        //         : LIMIT_PRC_INDEX_IN_OPEN_POSITIONS
        //     ] = "접수완료";

        //     //It should be like below
        //     // d[
        //     //   isStop
        //     //     ? STOP_PRC_INDEX_IN_OPEN_POSITIONS
        //     //     : LIMIT_PRC_INDEX_IN_OPEN_POSITIONS
        //     // ] = price;
        //     return d;
        //   } else {
        //     return d;
        //   }
        // });
        // setData([...newArr]);
    };

    /*=====================================================
    | cStatus가 4번(SL 업무서버취소) 일때                   |
    | limit 취소 거래소서버 접수는 1번으로 한번더 떨어지니    |
    | stop 만 취소해주기                                   |
    =======================================================*/
    const handleSLCancel = useCallback(({ szOrgCustItem, data }) => {
        const newArr = data.map((d) => {
            d = d.map(v => typeof v === 'string' ? v.trim() : v);

            if (isSameOrderId(d[SZ_STOP_ITEM_INDEX_IN_OPEN_POSITIONS], szOrgCustItem)) {
                const curNo = d[SZ_CUR_NO_INDEX_IN_OPEN_POSITIONS].trim();
                const PIP_LOWEST = symbols[curNo] ? symbols[curNo].PIP_LOWEST : 2;
                d[STOP_PRC_INDEX_IN_OPEN_POSITIONS] = formatNumber(0, PIP_LOWEST as number);
                return d;
            } else {
                return d;
            }
        });
        setData([...newArr]);
    }, []);

    /*=====================================================
    | cStatus가 1번(Limit 거래소서버 취소) 일때             |
    | open positions에서 해당항목찾아서 limit price 변경    |
    =======================================================*/
    const handleLimitCancelOnTradeServer = useCallback(({ szOrgCustItem, data }) => {
        const newArr = data.map((d) => {
            d = d.map(v => typeof v === 'string' ? v.trim() : v);

            if (isSameOrderId(d[SZ_LIMIT_ITEM_INDEX_IN_OPEN_POSITIONS], szOrgCustItem)) {
                const curNo = d[SZ_CUR_NO_INDEX_IN_OPEN_POSITIONS].trim();
                const PIP_LOWEST = symbols[curNo] ? symbols[curNo].PIP_LOWEST : 2;
                d[LIMIT_PRC_INDEX_IN_OPEN_POSITIONS] = formatNumber(0, PIP_LOWEST as number);
                d[SZ_LIMIT_ITEM_INDEX_IN_OPEN_POSITIONS] = '';
                return d;
            } else {
                return d;
            }
        });
        setData([...newArr]);
    }, []);

    /*========================================================
    | cStatus가 0번(Limit 설정 거래소서버 접수) 일때            |
    | open positions에서 해당항목찾아서 limit price 변경 및     |
    | limit cust item 설정                                    |
    ==========================================================*/
    const handleLimitInitOnTradeServer = useCallback(({ szOrgCustItem, price, SLCustItem, data }) => {
        const newArr = data.map((d) => {
            if (isSameOrderId(d[SZ_CUST_ITEM_INDEX_IN_OPEN_POSITIONS], szOrgCustItem)) {
                d[LIMIT_PRC_INDEX_IN_OPEN_POSITIONS] = price;
                d[SZ_LIMIT_ITEM_INDEX_IN_OPEN_POSITIONS] = SLCustItem;

                return d;
            } else {
                return d;
            }
        });
        setData([...newArr]);
    }, []);

    /*===============================================================
    | 현재가, stop, limit 가격들은 해당종목의 PIP_LOWEST 정보를 사용해서 |
    | 파싱해줘야한다.                                                 |
    =================================================================*/
    // const parseData = useCallback(
    //     (data) => {
    //         if (!data.length) return data;
    //
    //         return data.map((d) => {
    //             const newD = [...d];
    //             const PIP_LOWEST = symbols[newD[SZ_CUR_NO_INDEX_IN_OPEN_POSITIONS]]
    //                 ? symbols[newD[SZ_CUR_NO_INDEX_IN_OPEN_POSITIONS]].PIP_LOWEST
    //                 : 2;
    //             // console.log('check this : ', symbols, newD[SZ_CUR_NO_INDEX_IN_OPEN_POSITIONS], PIP_LOWEST);
    //             //Slice cust item
    //             newD[SZ_CUST_ITEM_INDEX_IN_OPEN_POSITIONS] = newD[SZ_CUST_ITEM_INDEX_IN_OPEN_POSITIONS].slice(15, 21);
    //             //
    //             // szSide - newD[2] : 079 080 같은 코드들을 의미있는 단어로 번역
    //             newD[2] = translateSzPoCode(newD[2]);
    //
    //             //Slice symbol id
    //             newD[0] = newD[0].slice(10);
    //
    //             [
    //                 SZ_RATE_INDEX_IN_OPEN_POSITIONS,
    //                 SZ_QUOTE_INDEX_IN_OPEN_POSITIONS,
    //                 TOTAL_PL_INDEX_IN_OPEN_POSITIONS,
    //                 GROSS_PL_INDEX_IN_OPEN_POSITIONS,
    //                 STOP_PRC_INDEX_IN_OPEN_POSITIONS,
    //                 LIMIT_PRC_INDEX_IN_OPEN_POSITIONS,
    //             ].map((field) => {
    //                 if (newD[field] === 3875.69) {
    //                     console.log(
    //                         'check this',
    //                         newD[field],
    //                         PIP_LOWEST,
    //                         formatNumber(newD[field], PIP_LOWEST as number),
    //                     );
    //                 }
    //                 newD[field] = formatNumber(newD[field], PIP_LOWEST as number);
    //             });
    //
    //             return newD;
    //         });
    //     },
    //     [symbols],
    // );

    const parseData = (data) => {
        if (!data.length) return data;

        return data.map((d) => {
            const newD = [...d];
            const curNo = newD[SZ_CUR_NO_INDEX_IN_OPEN_POSITIONS].trim();
            const PIP_LOWEST = symbols[curNo] ? symbols[curNo].PIP_LOWEST : 2;
            //Slice cust item
            newD[SZ_CUST_ITEM_INDEX_IN_OPEN_POSITIONS] = newD[SZ_CUST_ITEM_INDEX_IN_OPEN_POSITIONS].slice(15, 21);
            //
            // szSide - newD[2] : 079 080 같은 코드들을 의미있는 단어로 번역
            newD[2] = translateSzPoCode(newD[2]);

            //Slice symbol id
            newD[0] = newD[0].slice(10);

            [
                SZ_RATE_INDEX_IN_OPEN_POSITIONS,
                SZ_QUOTE_INDEX_IN_OPEN_POSITIONS,
                TOTAL_PL_INDEX_IN_OPEN_POSITIONS,
                GROSS_PL_INDEX_IN_OPEN_POSITIONS,
                STOP_PRC_INDEX_IN_OPEN_POSITIONS,
                LIMIT_PRC_INDEX_IN_OPEN_POSITIONS,
            ].map((field) => {
                // console.log(
                //     'check this',
                //     field,
                //     newD[field],
                //     PIP_LOWEST,
                //     formatNumber(newD[field], PIP_LOWEST as number),
                // );

                if (newD[field]) {
                    // console.log('JW check this', newD[field], PIP_LOWEST, formatNumber(newD[field], PIP_LOWEST as number));
                }
                newD[field] = formatNumber(newD[field], PIP_LOWEST as number);
            });

            return newD;
        });
    };

    // const parsedData = useMemo(() => {
    //     return parseData(data);
    // }, [JSON.stringify(data)]);

    return {
        isSuccess,
        data: parseData(data),
        dataColumn: openPositionsDataColumn,
        // data : extractUsefullData(data),
        // dataColumn: extractUsefullColumn(openPositionsDataColumn),
        originalData: data,
        originalDataColumn: openPositionsDataColumn,
    };
};

const extractUsefullData = (data) => {
    const newData = [...data];
    return newData.map((d, i) => {
        // step1: 주문번호에서 앞에 0 4개를 제거
        const newD = [...d];
        newD[0] = newD[0].slice(4);

        // step2: ordType 을 번호에 맞게 한국어로 번역
        let type;
        switch (newD[2]) {
            case '079':
                type = '매수';
                break;
            case '080':
                type = '환매수';
                break;
            case '081':
                type = '매도';
                break;
            case '082':
                type = '전매도';
                break;
        }
        newD[2] = type;

        return newD.filter((subD, index) => {
            return index === 13 || index === 14 || index === 15 ? false : true;
        });
    });
};

const extractUsefullColumn = (data) => {
    return data.filter((d, index) => {
        return index === 13 || index === 14 || index === 15 ? false : true;
    });
};

export default useUpdateData;
