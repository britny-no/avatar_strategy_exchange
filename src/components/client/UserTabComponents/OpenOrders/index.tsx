import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateOrderTab } from '@/states/reducers/orderReducer';
import CustomerTable from '@/components/common/CustomerTable';
import LogInRequired from '@/components/common/LogInRequired';
import useUpdateData from './useUpdateData';
import useScreenSize from '@/hooks/useScreenSize';
import useUserTabStyle from '@/hooks/useUserTabStyle';
import socketService from '@/states/socketAgent/SocketService';
import { useTypedSelector } from '@/states/useTypedSelector';

const Index = () => {
    const { data, originalData, isSuccess, dataColumn } = useUpdateData();

    const isLoggedIn = useTypedSelector((state) => state.userReducer.isLoggedIn);
    const userReducerData = useTypedSelector((state) => state.userReducer.data);
    const dispatch = useDispatch();
    const { isMobile } = useScreenSize();
    const { style, mobileStyle } = useUserTabStyle();
    const { szAccNo } = userReducerData;

    useEffect(() => {
        const input = {
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't3600',
            },
            Input1: {
                szAccNo: szAccNo,
            },
        };
        socketService.sendToAgent(input);
    }, [data, isSuccess]);

    const handleClickForOpenOrders = useCallback(
        (d, dealDiv) => (e) => {
            //Open position  => stop/limit index 1
            const input = {
                // idnex 2 === Modify/Cancel order tab
                index: isMobile ? 3 :2,
                triggeredBy: 'open-orders',
                data: {
                    // 매매구분 : modify/cancel은 지정사 매수/매도 주문 취소와 청산limit 매수/매도 주문으로 나눠져있기때문.
                    szDealDiv: dealDiv,
                    // 회원처리항목
                    szCustItem: d[0],
                    // 종목코드
                    szCurNo: d[1],
                    // 주문가격
                    szRate: d[3],
                    // 주문수량
                    fLot: d[4],
                },
            };
            dispatch(updateOrderTab(input));
        },
        [],
    );

    const openOrdersProps = {
        isSuccess,
        data,
        originalData,
        dataColumn,
        handleClickForOpenOrders,
        tableFor: 'open-orders',
    };

    const switchCase = () => {
        switch (isMobile) {
            case true:
                return isLoggedIn ? (
                    <CustomerTable {...openOrdersProps} {...mobileStyle} />
                ) : (
                    <LogInRequired width="100%" height="385px" />
                );
            default:
                return isLoggedIn ? <CustomerTable {...openOrdersProps} {...style} /> : <LogInRequired width="100%" height="385px"/>;
        }
    };

    return switchCase();
};

export default Index;
