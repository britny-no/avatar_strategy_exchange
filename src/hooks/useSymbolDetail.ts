import { useTypedSelector } from '../states/useTypedSelector';
import { SymbolInfoType } from '../states/reducers/symbolReducer';

const useSymbolDetail = (symbol: string): SymbolInfoType | [] => {
    const trState = useTypedSelector((state) => state.symbolReducer.symbols[symbol]);
    return trState ? trState : [];
};

export default useSymbolDetail;
