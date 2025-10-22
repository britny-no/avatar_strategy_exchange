import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useOperatingHour from '../../hooks/useOperatingHour';
import useRegisterLiveData from '../../hooks/useRegisterLiveData';
import useUsersData from '../../hooks/useUserData';
import { setOperatingHour } from '@/states/reducers/userReducer';

const InitUsersAccountDetail = () => {
    const { szAccNo } = useUsersData();
    const dispatch = useDispatch();
    const { register } = useRegisterLiveData();

    const { data: operatingHourData, refetch: fetchOperatingHour } = useOperatingHour();

    useEffect(() => {
        if (!szAccNo) return;
        register();
        fetchOperatingHour();
    }, [szAccNo]);

    useEffect(() => {
        if (!operatingHourData.nCurBusiDate) return;
        dispatch(setOperatingHour(operatingHourData));
    }, [operatingHourData.nCurBusiDate]);

    return <></>;
};

export default InitUsersAccountDetail;
