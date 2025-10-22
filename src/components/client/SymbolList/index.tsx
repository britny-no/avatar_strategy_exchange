import React from 'react';
import SymbolList from './SymbolList';
import useFormatSymbolList from './useFormatSymbolList';
import useScreenSize from '../../../hooks/useScreenSize';

export default function Index() {
    const { symbolList, handleToggleFavorite } = useFormatSymbolList();
    const { isMobile } = useScreenSize();

    const MobileStyle = {
        height: '100%',
        maxHeight: '100%',
        minHeight: '100%',
        overflow: 'auto',
        width: '100%',
    };

    const style = {
        minHeight: '440px',
        maxHeight: '440px',
        overflow: 'auto',
        width: '420px',
    };

    console.log(`symbolList !!!: `, symbolList);

    return (
        <SymbolList
            style={!isMobile ? style : MobileStyle}
            symbolList={symbolList}
            handleToggleFavorite={handleToggleFavorite}
        />
    );
}
