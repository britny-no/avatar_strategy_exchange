import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { login, setCurrentUser } from '../../states/reducers/userReducer';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useTypedSelector } from '../../states/useTypedSelector';
import socketService from '../../states/socketAgent/SocketService';

const MobileLoginHelper = ({ isVisible = false }) => {
    const [loginKey, setLoginKey] = useState<string>('');
    const loginState = useTypedSelector((state) => state.stateReducer[loginKey]);
    const dispatch = useDispatch();

    // Only for demo purpose
    const loginBy = new URLSearchParams(window.location.search).get('login');

    useEffect(() => {
        if (loginBy === '0001') {
            handleLogin({ userid: 'test01 ', passwd: 'test01' })();
        } else if (loginBy === '0003') {
            handleLogin({ userid: 'test03 ', passwd: 'test03' })();
        } else if (loginBy === '0005') {
            handleLogin({ userid: 'leokim88 ', passwd: 'kim1962' })();
        }
    }, [loginBy]);

    useEffect(() => {
        if (loginState) {
            dispatch(login());
        }
    }, [loginState]);

    const userId = loginState && loginState.Output1 ? loginState.Output1.userid : null;
    const { data: currentUserData } = useCurrentUser({ szCustNo: userId });

    useEffect(() => {
        if (!currentUserData[0]) return;
        const lastThreeAccNo = currentUserData[0][0].slice(11, 14);
        const szPasswd = lastThreeAccNo === '001' ? '0000' : lastThreeAccNo === '003' ? '1234' : '';
        dispatch(setCurrentUser({ szAccNo: currentUserData[0][0], szPasswd: szPasswd }));
    }, [currentUserData[0]]);

    const handleLogin = ({ userid, passwd }) => () => {
        // 0003 account
        const info = {
            Header: { function: 'D', termtype: 'HTS', trcode: 'login' },
            Input1: {
                userid,
                passwd,
                // ipaddr: "211.13.238.186",
                ibno: '000',
                usertype: '4',
                demo: '0',
                retry: '1',
                usecert: '',
                version: '00',
                mac_addr: '',
            },
        };

        //tr은 sendToAgent의 세번째 parameter로 key name를 지정해주지 않습니다
        const agent_result = socketService.sendToAgent(info);
        console.log(`login key in login helper : `, agent_result);
        agent_result && setLoginKey(agent_result);
    };

    if (!isVisible) return <div></div>;

    return <></>;
};

export default MobileLoginHelper;
