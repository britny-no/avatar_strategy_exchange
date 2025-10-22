import { SymbolInfoType } from '../states/reducers/symbolReducer';
import { useTypedSelector } from '../states/useTypedSelector';

type ReturnType = {
    symbols: Array<SymbolInfoType>;
    currentSymbol: string;
    currentSymbolName: string;
    currentSymbolData: any;
    symbolsInObjectForm: Record<string, Record<string, string | number | boolean>>;
};

const useSymbolList = (): ReturnType => {
    const symbols = useTypedSelector((state) => state.symbolReducer.symbols);
    const currentSymbol = useTypedSelector((state) => state.symbolReducer.currentSymbol);
    const symbolsKey: Array<string> = Object.keys(symbols);
    const isComplete = true;
    const symbolList: Array<SymbolInfoType> = [];
    for (const key of symbolsKey) {
        
        symbols[key] && symbolList.push(symbols[key]);
        // symbols[key]에는 fClose칼럼이 존재하지 않아 주석처리 했습니다
        // if (symbols[key].fClose === undefined) isComplete = false;
    }

    let currentSymbolName = '';
    let currentSymbolData = {};
    if (symbolList) {
        // @ts-ignore
        const obj = symbolList.find(({ CUR_NO }) => CUR_NO.replace(/\s*$/,"") === currentSymbol.replace(/\s*$/,""));
        currentSymbolName = obj ? obj.NAME_ENG : '';
        currentSymbolData = obj ? obj : {};
    }

    return {
        symbols: isComplete ? symbolList : [], // Array<Record<key, string>>
        // symbols: symbolList, // Array<Record<key, string>>
        currentSymbol,
        currentSymbolName,
        currentSymbolData: isComplete ? currentSymbolData : {},
        symbolsInObjectForm: symbols, // Record<key , Record<key, string>>
    };
};

export default useSymbolList;
