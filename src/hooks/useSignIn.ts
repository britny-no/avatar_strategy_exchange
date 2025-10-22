import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';


import socketService from '../states/socketAgent/SocketService';
import { TransactionInputType } from '../types';
import useUserData from './useUserData';

const getInput = ({ passwd, userid }): TransactionInputType => ({
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
});

/*===================================================================
| 1.When user has signed in, transaction returns userId in Output1.  |
| 2.Use that userId to get user's detail                             |
====================================================================*/

type ReturnType = {
    handleSignIn: ({ passwd, userid }: { passwd: string; userid: string }) => void;
    result: any;
    message: string;
    isSuccess: boolean;
};

const useSignIn = () => {
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [data, setData] = useState<Record<string, string>>({});
    const { isLoggedIn } = useUserData();

    const dispatch = useDispatch();

    useEffect(() => {
        if (isLoggedIn) {
            setSuccess(true);
            
            const {email, password} = data
            if(email && password){
                socketService.sendToAgent({
                    Header: {
                        function: 'D',
                        termtype: 'HTS',
                        trcode: 't113C',
                    },
                    Input1: {
                        szFlag : "0",
                        szMemberNo : "000",
                        szCustNo : email,
                        szPasswd : password,
                        szUHIN_data : "",
                        szField_No : "",
                        szField_Data1 : "",
                        szField_Data2 : "",
                        szField_Data3 : "",
                        szStaffID : "",
                        szStaffPasswd : "",
                    },
                });
                setData({})
            }
        }
    }, [isLoggedIn]);

    const handleSignIn = async ({
        email,
        password,
        otp_token,
    }: {
        email: string;
        password: string;
        otp_token: string;
    }) => {
        const input = {
            Header: { function: 'D', termtype: 'HTS', trcode: 'login' },
            Input1: {
                userid: email,
                passwd: password,
                ipaddr: '',
                ibno: '000',
                usertype: '4',
                demo: '0',
                retry: '1',
                usecert: '',
                version: '00',
                filler: '  ',
                mac_addr: '',
            },
        };
        socketService.sendToAgent(input);
        setData({email, password})
    };

    const handleDemoLogin = () => {
        const input = {
            Header: { function: 'D', termtype: 'HTS', trcode: 'login' },
            Input1: {
                userid: 'leokim88',
                passwd: 'kim1962',
                ipaddr: '211.13.238.186',
                ibno: '000',
                usertype: '4',
                demo: '0',
                retry: '1',
                usecert: '',
                version: '00',
                filler: '  ',
                mac_addr: '',
            },
        };
        // socketService.sendToAgent(input);

        // dispatch(
        //     SET_CURRENT_USER({
        //         szAccNo: '00010057100005',
        //         szPasswd: '0000',
        //         email: 'leokim@gmail.com',
        //         jwt:
        //             'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJwcm9ncmFtMkBnbWFpbC5jb20iLCJhY2NObyI6IjAwMDEwMDU3MzAwMDY3IiwiaXNzIjoiQk1YIiwicGFzc3dvcmQiOiJwYXNzd29yZCIsImlhdCI6MTYyNjMxNjkzNywiZXhwIjo2MTYyNjMxNjkzN30.u47WvhCJQbP79pGAjEbbnRZthXDJFEw5I6d_0ZCmMQc',
        //         exp: '2627884047',
        //     }),
        // );
    };

    return { handleSignIn, handleDemoLogin, error, success, data };
};

export default useSignIn;
