import useSymbolList from '../../../hooks/useSymbolList';
import socketService from '../../../states/socketAgent/SocketService';
import { useTypedSelector } from '../../../states/useTypedSelector';
import { TransactionInputType } from '../../../types';
import { SymbolInfoType } from '../../../states/reducers/symbolReducer';

const getInputForGettingFavorites = ({ szAccNo, email, jwt }): TransactionInputType => ({
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

const getInputForTogglingSymbol = ({ favorites, symbol, szAccNo, email, jwt }): TransactionInputType => {
    if (favorites.includes(symbol)) {
        return {
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't3180',
                userid: email,
                token: jwt,
            },
            Input1: {
                szMemberNo: import.meta.env.REACT_APP_SZ_MEMBER_NO,
                szCustNo: szAccNo,
                szTradeType: '57',
                szGrpCode: '01',
                szCurNoCnt: `${favorites.length - 1}`,
                szCurNo: `${favorites.filter((favorite) => favorite !== symbol).join('')}`,
            },
        };
    } else {
        return {
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't3180',
                userid: email,
                token: jwt,
            },
            Input1: {
                szMemberNo: import.meta.env.REACT_APP_SZ_MEMBER_NO,
                szCustNo: szAccNo,
                szTradeType: '57',
                szGrpCode: '01',
                szCurNoCnt: `${favorites.length + 1}`,
                szCurNo: `${[...favorites, symbol].join('')}`,
            },
        };
    }
};

type ReturnType = {
    symbolList: Array<SymbolInfoType>;
    favoriteList: Array<SymbolInfoType>;
    favorites: Array<string>;
    handleToggleFavorite: (symbol: string) => () => void;
};

const useFormatSymbolList = (): ReturnType => {
    const { symbols: symbolList } = useSymbolList();
    const favorites = useTypedSelector((state) => state.userReducer.favorites.data);
    const userReducerData = useTypedSelector((state) => state.userReducer.data);
    const { szAccNo, email, jwt } = userReducerData;

    const handleToggleFavorite = (symbol) => () => {
        if (!szAccNo || !email || !jwt) return;
        socketService.sendToAgent(getInputForTogglingSymbol({ favorites, symbol, szAccNo, email, jwt }));

        setTimeout(() => {
            socketService.sendToAgent(getInputForGettingFavorites({ szAccNo, email, jwt }));
        }, 10);
    };

    return {
        symbolList: symbolList.map((symbol, index) => {
            return {
                ...symbol,
                isFavorite: favorites.includes(symbol.CUR_NO),
            };
        }),
        favoriteList: symbolList.filter((symbol) => favorites.includes(symbol.CUR_NO)),
        favorites,
        handleToggleFavorite,
    };
};

export default useFormatSymbolList;
