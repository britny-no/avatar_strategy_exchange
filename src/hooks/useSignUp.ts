import { useState } from 'react';
import socketService from '../states/socketAgent/SocketService';

type HandleSignUpInputType = {
    email: string;
    password: string;
    check_password: string;
    szFamilyName: string;
    szUserName: string;
    szNation_Name: string;
    szTelNo2: string;
};

type ReturnType = {
    handleSignUp: ({
        email,
        password,
        check_password,
        szFamilyName,
        szUserName,
        szNation_Name,
        szTelNo2,
    }: HandleSignUpInputType) => void;
    error: string | undefined;
    success: boolean;
    data: Record<string, string>;
};

const useSignUp = (): ReturnType => {
    const [error, setError] = useState<string>();
    const [success, setSuccess] = useState<boolean>(false);
    const [data, setData] = useState<Record<string, string>>({});

    // console.log('click')
    const handleSignUp = async ({
        email,
        password,
        check_password,
        szFamilyName,
        szUserName,
        szNation_Name,
        szTelNo2,
    }) => {
        const params = {
            Header: { function: 'D', termtype: 'HTS', trcode: 't113B' },
            Input1: {
                szMemberNo: '000',
                szCustNo: email,
                szPasswd: password,
                szPasswd1: check_password,
                szFamilyName: szFamilyName,
                szUserName: szUserName,
                szNation_Name: szNation_Name,
                szTelNo2: szTelNo2,
            },
        };
        socketService.sendToAgent(params);
    };

    return { handleSignUp, error, success, data };
};

export default useSignUp;
