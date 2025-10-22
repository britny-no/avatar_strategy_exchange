import { useState, useEffect } from 'react';
import { useTypedSelector } from '../states/useTypedSelector';

const useMarginAndLeverage = () => {
    const { margin_type, leverage } = useTypedSelector((state) => state.marginAndLeverageReducer);

    return { margin_type, leverage };
};

export default useMarginAndLeverage;
