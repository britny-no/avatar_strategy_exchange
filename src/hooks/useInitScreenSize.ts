import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ScreenSizeType } from '../constants/DeviceSize';
import { switchScreenSize } from '../states/reducers/userReducer';

const getSize = (): ScreenSizeType => {
    const width = window.innerWidth;
    let size: ScreenSizeType | undefined = undefined;
    
    switch (true) {
        case width < 600:
            size = 'xs';
            break;
        case width < 960:
            size = 'sm';
            break;
        case width < 1280:
            size = 'md';
            break;
        case width < 1920:
            size = 'lg';
            break;
        case 1920 <= width:
            size = 'xl';
            break;
        default:
            break;
    }
    return size;
};

const useInitScreenSize = () => {
    const dispatch = useDispatch();

    const previousScreenSize = useRef<ScreenSizeType>();
    function handleResize() {
        const size = getSize();

        //When the screen viewport has changed.
        if (size !== previousScreenSize.current) {
            dispatch(switchScreenSize({ screenSize: size }));
            previousScreenSize.current = size;
        }
    }

    useEffect(() => {
        if(window) window.addEventListener('resize', handleResize);
        handleResize();
        return () => {if(window) window.removeEventListener('resize', handleResize);}
    }, []);

    return {};
};
export default useInitScreenSize;
