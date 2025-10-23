import { useTranslation } from "react-i18next";

import useAgentWhenSignedIn from '../../../../hooks/useAgentWhenSignedIn';
import { useTypedSelector } from '../../../../states/useTypedSelector';
import { TransactionInputType } from '../../../../types';
import useCurrentLanguage from '../../../../hooks/useCurrentLanguage';
import { useCallback } from 'react';
import {
    GROSS_PL_INDEX_IN_OPEN_POSITIONS,
    LIMIT_PRC_INDEX_IN_OPEN_POSITIONS,
    STOP_PRC_INDEX_IN_OPEN_POSITIONS,
    SZ_CUR_NO_INDEX_IN_OPEN_POSITIONS,
    SZ_CUST_ITEM_INDEX_IN_OPEN_POSITIONS,
    SZ_QUOTE_INDEX_IN_OPEN_POSITIONS,
    SZ_RATE_INDEX_IN_OPEN_POSITIONS,
    TOTAL_PL_INDEX_IN_OPEN_POSITIONS,
} from '../OpenPositions/openPositionsIndices';
import { translateSzPoCode } from '../common/commonUtil';
import formatNumber from '../../../../lib/formatNumber';

type InputPropsType = {
    szAccNo: string | undefined;
    email: string | undefined;
    jwt: string | undefined;
};

const input = ({ szAccNo, email, jwt }: InputPropsType): TransactionInputType => ({
    Header: {
        function: 'D',
        termtype: 'HTS',
        trcode: 't3720',
        userid: email,
        token: jwt,
    },
    Input1: {
        szAccNo: szAccNo,
    },
});


type ReturnType = {
    data: Array<Array<string | number>>;
    dataColumn: Array<string>;
    isSuccess: boolean;
};

const useData = (): ReturnType => {
    const { t } = useTranslation()
    const userReducerData = useTypedSelector((state) => state.userReducer.data);
    const { szAccNo, email, jwt } = userReducerData;
    const { trResult } = useAgentWhenSignedIn({
        input: input({ szAccNo, email, jwt }),
    });

    const parseData = (data) => {
        if (!data.length) return data;
        const excludeIndex = [0, 7, 8, 10, 11, 13, 15, 16, 17];
        return data.map((d) => {
            const newD = [...d];

            //배열의 첫 번째 값은 유저에게 보여주면 안되므로 삭제.
            // newD.shift();

            // szSide - newD[3] : 079 080 같은 코드들을 의미있는 단어로 번역
            newD[3] = translateSzPoCode(newD[3]);

            return newD.filter((_, idx) => !excludeIndex.includes(idx));
        })
    };

    return {
        data: trResult && trResult.Output2 ? parseData(trResult.Output2) : [],
        dataColumn: [
            t("positionsDetailUseData:symbol"),
            t("positionsDetailUseData:lot"),
            t("positionsDetailUseData:side"),
            t("positionsDetailUseData:price"),
            t("positionsDetailUseData:current_price"),
            t("positionsDetailUseData:price_difference"),
            t("positionsDetailUseData:gross_p_n_l"),
            t("positionsDetailUseData:commission"),
            t("positionsDetailUseData:netpl"),
            t("positionsDetailUseData:point_position"),
            // t("positionsDetailUseData:close_position"),
        ],
        isSuccess: trResult && trResult.Output1 ? true : false,
    };
};

export default useData;
