import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AxiosRequest } from '@/lib/axiosRequest';
import { setCurrentUser } from '@/states/reducers/userReducer';

const UserAuthenticate = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const localStorageData = localStorage.getItem('elpist');
        if (!localStorageData) return;
        if (JSON.parse(localStorageData).isLoggedIn === undefined) return;

        AxiosRequest.post(`/authenticate`, {}, { withCredentials: true })
            .then((res) => {
                console.log(`userauthenticate component : `, res.data);
                if (res.data.success) {
                    dispatch(
                        setCurrentUser({
                            szAccNo: res.data.accNo,
                            email: res.data.email,
                            szPasswd: res.data.password,
                            jwt: res.data.jwt,
                            exp: res.data.exp,
                        }),
                    );
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return <></>;
};

export default UserAuthenticate;
