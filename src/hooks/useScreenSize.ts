import DEVICE_SIZE from '../constants/DeviceSize';
import { useTypedSelector } from '../states/useTypedSelector';

const useScreenSize = (): {
    isMobile: boolean;
    isSmall: boolean;
} => {
    const currentScreenSize = useTypedSelector((state) => state.userReducer.screenSize);
    const isMobile = currentScreenSize === DEVICE_SIZE.MOBILE;
    const isSmall = currentScreenSize === DEVICE_SIZE.SMALL;
    return { isMobile, isSmall };
};

export default useScreenSize;
