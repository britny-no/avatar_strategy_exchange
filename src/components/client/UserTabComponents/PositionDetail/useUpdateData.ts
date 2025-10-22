import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTypedSelector } from '../../../../states/useTypedSelector';
import useData from './useData';
// import useNinetySix from '../../../../hooks/useNinetySix';
import formatNumber from '../../../../lib/formatNumber';
import { isSameOrderId, translateSzPoCode } from '../common/commonUtil';
import { IOpenOrdersRow } from '../../../../types/';
import socketService from '../../../../states/socketAgent/SocketService';

import useUsersData from '../../../../hooks/useUserData';
import useNinetyFive from '../../../../hooks/useNinetyFive';
import useSymbolList from '../../../../hooks/useSymbolList';
import useLatestSymbolInfo from '../../../../hooks/useLatestSymbolInfo';


const dotTwo = (num: number) => Math.floor(num * 100) / 100
const dotFour = (num: number) => Math.floor(num * 10000) / 10000
const dotFive = (num: number) => Math.floor(num * 100000) / 100000

export default function useUpdateData() {
    const { data: openOrdersData, dataColumn: openOrdersDataColumn, isSuccess } = useData();
    
    const { email, jwt, szAccNo } = useUsersData();
    const { data: newPositionData } = useNinetyFive(); //95번 실시간체결 데이터
    const { symbolsInObjectForm: symbols } = useSymbolList(); // pipLowest를 읽어오기 위함
    const [live_data, setLiveData] = useState<Array<string | null>>([])
    const [data, setData] = useState<Array<any>>([]); //미체결주문내역 데이터와 95, 96번 실시간 데이터를 통합하여 리턴해주기 위함
    
    const BTCUSDT = useTypedSelector((state) => live_data.includes('BTCUSDT') && state.stateReducer[`91_interval_BTCUSDT`])
    const ETHUSDT = useTypedSelector((state) => live_data.includes('ETHUSDT') && state.stateReducer[`91_interval_ETHUSDT`])
    const DOGEUSDT = useTypedSelector((state) => live_data.includes('DOGEUSDT') && state.stateReducer[`91_interval_DOGEUSDT`])
    const XRPUSDT = useTypedSelector((state) => live_data.includes('XRPUSDT') && state.stateReducer[`91_interval_XRPUSDT`])


    //  stringfy 해줘야 불필요한 rendering 줄임
    // 초기 data init
    useEffect(() => {
        setData([...openOrdersData]);
        setLiveData(openOrdersData.map(v => {
            return (v[0] as string).trim()
        }))
    }, [JSON.stringify(openOrdersData)])

    // 보유 코인 대상으로 실시간 가격(close 값) update
    useEffect(() => {
        const list = { BTCUSDT, ETHUSDT, DOGEUSDT, XRPUSDT }
        const dotRangeFunc = {
            BTCUSDT : dotTwo, 
            ETHUSDT: dotTwo, 
            DOGEUSDT : dotFive, 
            XRPUSDT : dotFour
        }
        live_data.forEach(v => {
            if(v && list[v]) {
                const live_output = list[v][0].Output1
                for(let i = 0, len = openOrdersData.length; i < len; i++){
                    const row = openOrdersData[i]
                    const symbol = (row[0] as string).trim()
                    if(live_output.szSymbol.trim() === symbol){
                        const dotFunc = dotRangeFunc[symbol]
                        const price = Number(row[3])
                        // const pre_price = Number(row[4])
                        const now_price = Number(live_output.szClose)
                        const lot = Number(row[1])
                        const commission = Number(row[7])

                        let dif = 0;
                        row[2] === 'Sell' ? dif = price - now_price : dif = now_price - price
                        // update Current Price
                        row[4] = dotFunc(now_price)
                        // update Price Diffrence
                        row[5] = dotFunc(dif)
                        // update Gross P&L
                        row[6] = dotFunc((dif)*lot) 
                        // update NetPL
                        row[8] = dotFunc((dif)*lot - commission)
                        break;
                    }
                    continue;
                }
            }
        })
        setData([...openOrdersData]);
    }, [JSON.stringify(openOrdersData), live_data, BTCUSDT, ETHUSDT, DOGEUSDT, XRPUSDT])
    

    /*==============================================================
    95번 실시간체결 데이터 길이가 바꿨얼때 => 새로운 체결이 들어왔을때
  ===============================================================*/
    useEffect(() => {
        if(newPositionData.length > 0){
            socketService.sendToAgent({
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't3720',
                    userid: email,
                    token: jwt,
                },
                Input1: {
                    szAccNo: szAccNo,
                },
            })
        }
        // if (newPositionData.length <= 0) return;
        // const newPosition = newPositionData[newPositionData.length - 1];
        // // 16, 17, 18 은 회원처리항목 1,2,3
        // const orderId = `${(newPosition[16] as string).trim()}${(newPosition[17] as string).trim()}${(newPosition[18] as string).trim()}`;
        // handleBuySellOrderConcluded({ orderId: newPosition[17], amount: newPosition[8], data });
    }, [newPositionData.length]);

    /*==============================================================
    신규체결된 데이터의 회원처리항목을 이용하여 open orders 에 해당항목을
    삭제시켜준다(!! 현재는 테스트용도로 주문체결완료라고 표시)
  ===============================================================*/
    const handleBuySellOrderConcluded = useCallback(({ orderId, data, amount }) => {
        //!!! 현재는 테스트용도로 주문체결완료라고 표시
        // const newArr = data.map((d) => {
        //     if (isSameOrderId(d[0].slice(11, 21), orderId.slice(0, 10))) {
        //         if (Number(d[SUM_INDEX]) === Number(amount)) {
        //             d[2] = '주문체결완료';
        //         } else {
        //             d[SUM_INDEX] = d[SUM_INDEX] - amount;
        //         }
        //     }
        //     return d;
        // });

        //!!!체결창에서 체결된 내용 지워주기
        const newArr = data.filter((d) => {
            if (d[2] === isSameOrderId(d[0], orderId)) return isSameOrderId(d[0], orderId) ? false : true;
        });
        setData(newArr);
    }, []);

    const parseData = (data) => {
        if (!data.length) return data;
        const excludeIndex = [0, 7, 8, 10, 11, 13, 15, 16, 17];

        return data.map((d) => {
            const newD = [...d];

            //배열의 첫 번째 값은 유저에게 보여주면 안되므로 삭제.
            // newD.shift();

            // szSide - newD[3] : 079 080 같은 코드들을 의미있는 단어로 번역
            newD[3] = translateSzPoCode(newD[3]);

            return newD.filter((_, idx) => !excludeIndex.includes(idx));
        })
    };
    const parsedData = useMemo(() => {
        // return parseData(data);
        return data
    }, [JSON.stringify(data)]);

    return {
        data: parsedData,
        originalData: data,
        isSuccess,
        dataColumn: openOrdersDataColumn,
    };
}
