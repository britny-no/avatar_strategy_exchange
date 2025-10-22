import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import BaseTable from '@/components/common/BaseTable';
import LogInRequired from '../../../common/LogInRequired';
import useData from './useData';
import { getPastday, getToday } from './calendarDateFormat';
import useScreenSize from '../../../../hooks/useScreenSize';
import useUserTabStyle from '../../../../hooks/useUserTabStyle';
import { useTypedSelector } from '@/states/useTypedSelector';

export default function Index() {
    const operatingHourData = useTypedSelector((state) => state.userReducer.operatingHour);
    const isLoggedIn = useTypedSelector((state) => state.userReducer.isLoggedIn);
    const { style, mobileStyle } = useUserTabStyle();
    const { isMobile } = useScreenSize();

    const [date, setDate] = useState({
        // fromDate: undefined,
        // toDate: undefined,
        fromDate: getPastday(1),
        toDate: getToday(),
    });

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [availablePages, setAvailablePages] = useState();
    const [limit, setLimit] = useState(15);


    useEffect(() => {
        if (!operatingHourData.nCurBusiDate) return;
        setDate({
            fromDate: operatingHourData.nPrevBusiDate.toString(),
            toDate: operatingHourData.nCurBusiDate.toString(),
        });
    }, [operatingHourData.nPrevBusiDate, operatingHourData.nCurBusiDate]);

    const { data: tradingHistoryData, dataColumn } = useData({
        date,
    });


    const handleDateChange = (date) => {
        // setDate(date);
    };

    const handlePage = (value) => () => {
        if (value === -1) {
            currentPage !== 1 && setCurrentPage(currentPage + value);
        } else if (value === 1) {
            currentPage !== availablePages && setCurrentPage(currentPage + value);
        }
    };

    const tradingHistroyProps = {
        data: tradingHistoryData,
        dataColumn,
        tableFor: 'trading-history',
    };

    const optionsProps = {
        date,
        availablePages,
        currentPage,
        handlePage,
        handleDateChange,
    };

    const PcStyle = {
        ...style,
        maxHeight: style.maxHeight,
    };
    const styleProps = isMobile ? mobileStyle : PcStyle;

    const logInStyleProps = isMobile
        ? {
              width: '100%',
              height: '200px',
          }
        : {
            width: '100%',
              height: '385px',
        };

    return isLoggedIn ? (
        <>
            <BaseTable {...tradingHistroyProps} {...styleProps} />
        </>
    ) : (
        <LogInRequired {...logInStyleProps} />
    );
}
