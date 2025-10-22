import TradingPage from './TradingPage';
import TradingPageForMobile from '../TradingPage_m';
import InitUsersAccountDetail from '@/components/common/InitUsersAccountDetail';
import useScreenSize from '@/hooks/useScreenSize';

const Index = () => {
    const { isMobile } = useScreenSize();
    
    return (
        <>
            <InitUsersAccountDetail />
            {!isMobile ? <TradingPage /> : <TradingPageForMobile />}
        </>
    );
};

export default Index;
