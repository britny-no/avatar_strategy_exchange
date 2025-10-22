import useInit from '@/hooks/useInit';
import useInitUponSymbolSelection from '@/hooks/useInitUponSymbolSelection';

const InitComponent = () => {
    const {} = useInit();
    const {} = useInitUponSymbolSelection();

    //현물종목 정보는 Futbit에서 사용 안 함
    // const {} = useRegisterSpots();

    return <></>;
};

export default InitComponent;
