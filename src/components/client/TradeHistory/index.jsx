import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import BaseTable from './../../common/BaseTable';
import LogInRequired from './../../common/LogInRequired';
import useData from './useData';
// import { style, mobileStyle } from '../common/tableStyle';
import useScreenSize from '../../../hooks/useScreenSize';
import useUserTabStyle from '../../../hooks/useUserTabStyle';

export default function Index({tradingHistoryData, dataColumn}) {
    const { style, mobileStyle } = useUserTabStyle();
    
    const isLoggedIn = useSelector((state) => state.userReducer.isLoggedIn);
    const { isMobile } = useScreenSize();

    const tradingHistroyProps = {
        data: tradingHistoryData,
        dataColumn,
        tableFor: 'trading-history',
    }

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
        : {};

    return isLoggedIn ? (
        <>
            <BaseTable {...tradingHistroyProps} {...styleProps} />
        </>
    ) : (
        <LogInRequired {...logInStyleProps} />
    );
}
