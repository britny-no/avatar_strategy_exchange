import Trades from './Trades';
import useTradeList from '../../../hooks/useTradeList';
import useScreenSize from '../../../hooks/useScreenSize';
import { useTypedSelector } from '../../../states/useTypedSelector';

const Index = () => {
    const currentSymbol = useTypedSelector((state) => state.symbolReducer.currentSymbol);
    const result = useTradeList(currentSymbol);
    const tradesArr = [...result].reverse();
    const { isMobile } = useScreenSize();

    // console.log(`trade result : `, result);
    const MobileStyle = {
        height: '100%',
        maxHeight: '100%',
        minHeight: '100%',
        overflow: 'auto',
        width: '100%',
    };

    const style = {
        height: '533px',
        maxHeight: '450px',
        minHeight: '450px',
        overflow: 'auto',
        width: '290px',
    };

    return <Trades style={!isMobile ? style : MobileStyle} data={tradesArr} />;
};

export default Index;
