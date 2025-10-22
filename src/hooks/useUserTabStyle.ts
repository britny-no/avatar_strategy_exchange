import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';


const useUserTabStyle = () => {
    const location = useLocation();
    const [dummy, setDummy] = useState(0);

    function handleResize() {
        setDummy((prev) => prev + 1);
    }

    useEffect(() => {
        if(window )window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            if(window){
                window.removeEventListener('resize', handleResize);
            }
        }
    }, []);

    const getStyle = () => {
        if(location.pathname === '/trade/history') {
            return {
                background: '#030B14',
                maxWidth: window.innerWidth,
                // maxWidth: 800,
                minWidth: 1055,
                // maxWidth: '100%',
                // minWidth: '100%',
                // minWidth: 1006,
                // maxWidth: 1006,
                // maxHeight: 385,
                rowHeight: 47,
            };
        } else {
            return {
                maxWidth: window.innerWidth - 445,
                // maxWidth: 800,
                minWidth: 1055,
                // maxWidth: '100%',
                // minWidth: '100%',
                // minWidth: 1006,
                // maxWidth: 1006,
                maxHeight: 385,
                rowHeight: 47,
            };
        }

    };

    const getMobileStyle = () => {
        return {
            maxWidth: window.innerWidth,
            maxHeight: window.innerHeight,
            rowHeight: 40,
        };
    };

    return { style: getStyle(), mobileStyle: getMobileStyle() };
};

export default useUserTabStyle;
