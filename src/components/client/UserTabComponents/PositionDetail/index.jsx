import React from 'react';
import { useSelector } from 'react-redux';
import CustomerTable from '../../../common/CustomerTable';
// import useUpdateData from '../OpenOrders/useUpdateData';
// import BaseTable from '../../../common/BaseTable';
import BaseTable from './table';
import LogInRequired from '../../../common/LogInRequired';
// import useData from './useData';
import useUpdateData from './useUpdateData';
// import { style, mobileStyle } from '../common/tableStyle';
import useScreenSize from '../../../../hooks/useScreenSize';
import useUserTabStyle from '../../../../hooks/useUserTabStyle';

const Index = () => {
    const { data, originalData, isSuccess, dataColumn } = useUpdateData();
    const { isMobile } = useScreenSize();
    const { style, mobileStyle } = useUserTabStyle();

    const isLoggedIn = useSelector((state) => state.userReducer.isLoggedIn);

    const positionDetailProps = { data, dataColumn };
    const styleProps = isMobile ? mobileStyle : style;
    const logInStyleProps = isMobile
        ? {
              width: '100%',
              height: '200px',
          }
        : {};

    return isLoggedIn ? <BaseTable {...positionDetailProps} {...styleProps} /> : <LogInRequired {...logInStyleProps} />;
};

export default Index;
