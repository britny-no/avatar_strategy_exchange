import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AxiosRequest } from '../lib/axiosRequest';
import { setCurrentUser } from '../states/reducers/userReducer';

type ReturnType = {
    handleExtendLogin: () => void;
    data: any;
    error: string;
    success: boolean;
};

const useExtendLogin = (): ReturnType => {
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [data, setData] = useState<Record<string, string>>({});

    const dispatch = useDispatch();

    const handleExtendLogin = async () => {
        await AxiosRequest.post(`/extend_login`, {}, { withCredentials: true })
            .then((res) => {
                if (res.data.error) {
                    setError(res.data.error);
                } else if (res.data.success) {
                    setSuccess(true);

                    dispatch(
                        setCurrentUser({
                            szAccNo: res.data.accNo,
                            szPasswd: res.data.password,
                            email: res.data.email,
                            jwt: res.data.jwt,
                            exp: res.data.exp,
                        }),
                    );
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return {
        handleExtendLogin,
        error,
        success,
        data,
    };
};

export default useExtendLogin;
