import { useTypedSelector } from '../states/useTypedSelector';

type ReturnType = {
    szAccNo: string | undefined;
    szPasswd: string | undefined;
    email: string | undefined;
    jwt: string | undefined;
    exp: number | undefined;
    isLoggedIn: boolean;
};

const useUsersData = (): ReturnType => {
    const { szAccNo, szPasswd, email, jwt, exp } = useTypedSelector((state) => state.userReducer.data);
    const isLoggedIn = useTypedSelector((state) => state.userReducer.isLoggedIn);

    return {
        szAccNo: szAccNo,
        szPasswd: szPasswd,
        email,
        jwt,
        exp,
        isLoggedIn,
    };
};

export default useUsersData;
