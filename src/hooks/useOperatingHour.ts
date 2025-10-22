import socketService from '../states/socketAgent/SocketService';
import { useTypedSelector } from '../states/useTypedSelector';
import { TransactionInputType } from '../types';
import useUsersData from './useUserData';

const getTrInput = ({ email, jwt }): TransactionInputType => ({
    Header: {
        function: 'D',
        termtype: 'HTS',
        trcode: 't0101',
        userid: email,
        token: jwt,
    },
    Input1: {
        szMemberNo: import.meta.env.REACT_APP_SZ_MEMBER_NO,
    },
});

// const outputColumnInEng = ['nCurBusiDate', 'nPrevBusiDate', 'nNextBusiDate '];
const outputColumnInKor = ['현재영업일', '이전영업일', '다음영업일 '];

type ReturnType = {
    data: {
        nCurBusiDate: number;
        nPrevBusiDate: number;
        nNextBusiDate: number;
    };
    dataColumn: Array<string>;
    refetch: () => void;
};

const useOperatingHour = (): ReturnType => {
    const { email, jwt } = useUsersData();

    const trResult = useTypedSelector((state) => state.stateReducer['t0101']);

    const refetch = () => {
        socketService.sendToAgent(getTrInput({ email, jwt }));
    };

    return {
        data: trResult && trResult.Output1 ? trResult.Output1 : {},
        dataColumn: outputColumnInKor,
        refetch,
    };
};

export default useOperatingHour;
