import { useCallback, useEffect, useMemo, useState } from 'react';
import useData from './useData';
import useNinetySix from '../../../../hooks/useNinetySix';
import useNinetyFive from '../../../../hooks/useNinetyFive';
import formatNumber from '../../../../lib/formatNumber';
import { isSameOrderId, translateSzPoCode } from '../common/commonUtil';
import { IOpenOrdersRow } from '../../../../types/';
import useSymbolList from '../../../../hooks/useSymbolList';
import useLatestSymbolInfo from '../../../../hooks/useLatestSymbolInfo';

/*====================
Indices in open orders
=====================*/
const SZ_RATE_INDEX_IN_OPEN_ORDERS = 3;
const SZ_QUOTE_INDEX_IN_OPEN_ORDERS = 5;

/*====================
     96번 실시간주문
=====================*/
const USER_ORDER_ENTRY = 'UOE';
const ORDER_ENTRY = 'OE';
const USER_ORDER_DELETE_ENTRY = 'UODE';
const ORDER_DELETE_ENTRY = 'ODE';

const SZ_CODE_INDEX = 1; //종목코드
const SZ_SIDE_INDEX = 2; // 매매구분
const ORDER_TYPE_INDEX = 3;
const SZ_STATUS_INDEX = 4;
const F_AMOUNT_INDEX = 5;
const SZ_RATE_INDEX = 6;
// const SZ_QUOTE_INDEX = "없음" //현재가
const SZ_OPEN_TIME_INDEX = 7;

const CANCEL_MODIFY_CUST_ID_INDEX_1 = 11;
const CANCEL_MODIFY_CUST_ID_INDEX_2 = 12;
const CANCEL_MODIFY_CUST_ID_INDEX_3 = 13;

/*====================
     95번 실시간 체결
=====================*/
const SUM_INDEX = 4;

/*===========================================
  96번을 통해 신규주문데이터가 들어오면
  새로운 주문 row를 만들어서 open orders에
  넣어주기 위함
=============================================*/

const buildNewOrder = (newOrder) => {
    let orderType = newOrder[ORDER_TYPE_INDEX].trim();
    orderType = orderType === 'OE' ? `U${orderType}` : orderType.replace('U', '');

    const output: IOpenOrdersRow = {
        //!!! 회원처리항목 빈공백 정말 중요하다.
        szCustItem: `${
          newOrder[8]
        }${newOrder[9].trim()}    ${newOrder[10].trim()}                                              `,
        szCurNo: newOrder[SZ_CODE_INDEX],
        szSide: newOrder[SZ_SIDE_INDEX],
        szRate: newOrder[SZ_RATE_INDEX],
        fLot: newOrder[F_AMOUNT_INDEX],
        szQuote: '현재가없음',
        szStop: 0,
        szLimit: 0,
        szStatus: newOrder[SZ_STATUS_INDEX],
        szOrderDateTime: newOrder[SZ_OPEN_TIME_INDEX],
        szOrderType: orderType,
    };

    return Object.values(output);
};

export default function useUpdateData() {
    const { data: openOrdersData, dataColumn: openOrdersDataColumn, isSuccess } = useData(); //t3600 유저 미체결주문내역 tr 데이터
    const { data: newOrderData } = useNinetySix(); //96번 실시간주문 데이터
    const { data: newPositionData } = useNinetyFive(); //95번 실시간체결 데이터
    const { symbolsInObjectForm: symbols } = useSymbolList(); // pipLowest를 읽어오기 위함
    const [data, setData] = useState<Array<any>>([]); //미체결주문내역 데이터와 95, 96번 실시간 데이터를 통합하여 리턴해주기 위함

    /*===========================================
  t3600 유저 미체결주문내역 tr 데이터가 도착
  했을때 초기 데이터를 initalize
  =============================================*/
    useEffect(() => {
        setData([...openOrdersData]);
    }, [JSON.stringify(openOrdersData)]);

    /*==============================================================
  96번 실시간주문 데이터 길이가 바꿨얼때 => 새로운 주문이 들어왔을때
  case 1: handleUOE => User Order Entry 신규주문이 업무서버에 접수
  case 2: handleOE => Order Entry 신규주문이 거래소 서버에 접수
  case 3: handleUODE =>주문취소가 업무 서버에 접수
  case 4: handleODE => 주문취소가 거래소 서버에 접수
  ===============================================================*/
    useEffect(() => {
        if (newOrderData.length <= 0) return;
        const newOrder = newOrderData[newOrderData.length - 1];
        const ORDER_TYPE = newOrder[ORDER_TYPE_INDEX].trim();
        switch (ORDER_TYPE) {
            case USER_ORDER_ENTRY:
                return handleUOE({ newOrder, data });

            case ORDER_ENTRY:
                return handleOE({ newOrder, data });

            case USER_ORDER_DELETE_ENTRY:
                return handleUODE({ newOrder, data });

            case ORDER_DELETE_ENTRY:
                return handleODE({ newOrder, data });
        }
    }, [JSON.stringify(newOrderData)]);

    /*============================================
   신규주문이 업무서버에 접수됬을때 open orders에
   OE(업무서버에만 접수됨)로 넣어준다
  ==============================================*/
    const handleUOE = useCallback(({ newOrder, data }) => {
        if(newOrder[ORDER_TYPE_INDEX].trim() === 'OE' || !newOrder[ORDER_TYPE_INDEX].trim()) {
            return;
        }
        const newRow = buildNewOrder(newOrder);
        setData([newRow, ...data]);
    }, []);

    /*============================================
   신규주문이 거래소서버에 접수됬을때 open orders에
   UOE(거래소서버까지 접수됨)로 넣어준다
  ==============================================*/
    const handleOE = useCallback(({ newOrder, data }) => {
        if(newOrder[ORDER_TYPE_INDEX].trim() === 'OE' || !newOrder[ORDER_TYPE_INDEX].trim()) {
            return;
        }
        const newRow = buildNewOrder(newOrder);
        const newArr = removeRow(newRow[0], data);
        setData([newRow, ...newArr]);
    }, []);

    /*============================================
   주문취소가 업무서버에 접수됬을때 open orders에
   해당항목을찾아 취소접수완료라고 표시
  ==============================================*/
    const handleUODE = useCallback(({ newOrder, data }) => {
        if(newOrder[ORDER_TYPE_INDEX].trim() === 'OE' || !newOrder[ORDER_TYPE_INDEX].trim()) {
            return;
        }
        const orderId = `${newOrder[CANCEL_MODIFY_CUST_ID_INDEX_1]}${newOrder[CANCEL_MODIFY_CUST_ID_INDEX_2]}${newOrder[CANCEL_MODIFY_CUST_ID_INDEX_3]}`;

        const newArr = data.map((d) => {
            if (isSameOrderId(d[0], orderId)) {
                d[10] = '취소접수';
                return d;
            } else {
                return d;
            }
        });


        setData([...newArr]);
    }, []);

    /*============================================
   주문취소가 업무서버에 접수됬을때 open orders에
   해당항목을찾아 제거
  ==============================================*/
    const handleODE = useCallback(({ newOrder, data }) => {
        if(newOrder[ORDER_TYPE_INDEX].trim() === 'OE' || !newOrder[ORDER_TYPE_INDEX].trim()) {
            return;
        }
        const orderId = `${newOrder[CANCEL_MODIFY_CUST_ID_INDEX_1]}${newOrder[CANCEL_MODIFY_CUST_ID_INDEX_2]}${newOrder[CANCEL_MODIFY_CUST_ID_INDEX_3]}`;
        const newArr = removeRow(orderId, data);
        setData([...newArr]);
    }, []);

    const removeRow = useCallback((orderId, data) => {
        return data.filter((d) => {
            return isSameOrderId(d[0], orderId) ? false : true;
        });
    }, []);

    /*==============================================================
    95번 실시간체결 데이터 길이가 바꿨얼때 => 새로운 체결이 들어왔을때
  ===============================================================*/
    useEffect(() => {
        if (newPositionData.length <= 0) return;
        const newPosition = newPositionData[newPositionData.length - 1];
        // 16, 17, 18 은 회원처리항목 1,2,3
        const orderId = `${(newPosition[16] as string).trim()}${(newPosition[17] as string).trim()}${(newPosition[18] as string).trim()}`;
        handleBuySellOrderConcluded({ orderId: newPosition[17], amount: newPosition[8], data });
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

    /*==============================================================
    현재가, stop, limit 가격들은 해당종목의 pipLowest 정보를 사용해서
    파싱해줘야한다.
  ===============================================================*/
    const parseData = useCallback(
      (data) => {
          return data.map((d, i) => {
              const newD = [...d];

              // 회원처리항목 슬라이싱
              newD[0] = newD[0].slice(15, 21);

              // szSide - newD[2] : 079 080 같은 코드들을 의미있는 단어로 번역
              newD[2] = translateSzPoCode(newD[2]);

              const symbolID = newD[1].trim();
              const pipLowest = symbols[symbolID] ? symbols[symbolID].PIP_LOWEST : 2;


              // 파싱해야되는 필드들을 forEach로 돌며 파싱
              const fieldsToParse = [SZ_RATE_INDEX_IN_OPEN_ORDERS, SZ_QUOTE_INDEX_IN_OPEN_ORDERS];

              fieldsToParse.forEach((field) => {
                  newD[field] = formatNumber(newD[field], pipLowest as number);
              });

              return newD;
          });
      },
      [symbols],
    );

    const parsedData = useMemo(() => {
        return parseData(data);
    }, [JSON.stringify(data)]);

    return {
        data: parsedData,
        originalData: data,
        isSuccess,
        dataColumn: openOrdersDataColumn,
    };
}
