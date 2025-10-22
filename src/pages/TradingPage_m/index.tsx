import React from 'react';
import useCurrentLanguage from '@/hooks/useCurrentLanguage';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import TradingPageForMobile from './TradingPage_m';

export default function Index() {
    return <MobileLandingPage />;
}

const MobileLandingPage = () => {
    const { currentLanguage } = useCurrentLanguage();
    const navigate = useNavigate(); // Get the navigate function

    // If you need to navigate somewhere, you can use `navigate()`
    // Example: navigate('/some-route');

    return <TradingPageForMobile />;
};
