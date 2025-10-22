import { TransactionInputType } from '../types';
import useAgentWhenSignedIn from './useAgentWhenSignedIn';

const input = ({ szCustNo }): TransactionInputType => ({
    Header: {
        function: 'D',
        termtype: 'HTS',
        trcode: 't0307',
    },
    Input1: {
        szMemberNo: process.env.REACT_APP_SZ_MEMBER_NO,
        szCustNo,
    },
});

const outputColumnInEng = ['nCurBusiDate', 'nPrevBusiDate', 'nNextBusiDate '];
const outputColumnInKor = ['현재영업일', '이전영업일', '다음영업일 '];

type PropsType = {
    szMemberNo?: string;
    szCustNo: string;
};

type ReturnType = {
    data: Record<string, any>;
    dataColumn: Array<string>;
};

const useCurrentUser = ({ szCustNo }: PropsType): ReturnType => {
    // const { trResult } = useAgentWhenSignedIn({
    //     input: input({  szCustNo }),
    // });
    return {
        data: {},
        dataColumn: outputColumnInKor,
    };
};

export default useCurrentUser;
