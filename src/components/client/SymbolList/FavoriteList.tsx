import React from 'react';
import SymbolList from './SymbolList';
import useFormatSymbolList from './useFormatSymbolList';
import useScreenSize from '../../../hooks/useScreenSize';

const FavoriteList = () => {
    const { favoriteList, handleToggleFavorite } = useFormatSymbolList();
    const { isMobile } = useScreenSize();

    const style = {
        minHeight: '440px',
        maxHeight: '440px',
        overflow: 'auto',
        width: '420px',
    };

    const MobileStyle = {
        height: '100%',
        maxHeight: '100%',
        minHeight: '100%',
        overflow: 'auto',
        width: '100%',
    };

    return (
        <SymbolList
            style={!isMobile ? style : MobileStyle}
            symbolList={favoriteList.map((symbol) => ({
                ...symbol,
                isFavorite: true,
            }))}
            handleToggleFavorite={handleToggleFavorite}
        />
    );
};

export default FavoriteList;
