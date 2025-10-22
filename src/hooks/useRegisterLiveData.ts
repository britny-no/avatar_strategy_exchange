import socketService from '../states/socketAgent/SocketService';
import { useTypedSelector } from '../states/useTypedSelector';
import { TransactionInputType } from '../types';
/*=======================================
  유저 로그인시 등록해줘야할 실시간 및 tr
  95 실시간체결
  96 실시간신규주문
  98 stop/limit실시간
  99는 딱히안쓰는듯 ..
  t3181 - 유저관심종목조회
========================================*/
const liveTrCodes = ['96', '95', '98'];
// const liveTrCodes = ['96', '95', '98', '99'];

const getInputForFavorites = ({ szAccNo, email, jwt }): TransactionInputType => ({
    Header: {
        function: 'D',
        termtype: 'HTS',
        trcode: 't3181',
        userid: email,
        token: jwt,
    },
    Input1: {
        szMemberNo: import.meta.env.REACT_APP_SZ_MEMBER_NO,
        szCustNo: szAccNo,
        szTradeType: '57',
        szGrpCode: '01',
    },
});

const inputBuilder = ({ trcode, szAccNo }): TransactionInputType => {
    return {
        Header: {
            function: 'A', // 응답시 'F'
            termtype: 'HTS',
            trcode,
        },
        Input1: {
            // 응답시 "Input" 없슴
            Key1: szAccNo, // 계좌번호(key)
        },
    };
};

type ReturnType = {
    register: () => void;
};

const useRegisterLiveData = (): ReturnType => {
    // const agent = useTypedSelector((state) => state.agentState);
    const userReducerData = useTypedSelector((state) => state.userReducer.data);
    const { szAccNo, email, jwt } = userReducerData;

    const register = () => {
        // Register live transaction
        liveTrCodes.map((liveTrCode) => {
            const input = inputBuilder({ trcode: liveTrCode, szAccNo });
            socketService.sendToAgent(input);
        });
        // Send tr
        socketService.sendToAgent(getInputForFavorites({ szAccNo, email, jwt }));
    };

    return { register };
};

export default useRegisterLiveData;
