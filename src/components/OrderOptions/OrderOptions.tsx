import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import useMarginAndLeverage from '../../hooks/useMarginAndLeverage';
import { setMarginType } from '../../states/reducers/marginAndLeverageReducer';
import LeveragePopup from '../client/LeveragePopup/';

const OrderOptions = ({ isForMobile = false }) => {
    const {t} = useTranslation()
    const [isLeverageOptionOpened, setIsLeverageOptionOpened] = useState(false);
    const { margin_type, leverage } = useMarginAndLeverage();
    const dispatch = useDispatch();
    const isCROSS = margin_type === '0';
    const isISO = margin_type === '1';

    const handleClick = (type) => (e) => {
        dispatch(setMarginType(type));
    };

    const handleToggleLeveragePopup = () => {
        setIsLeverageOptionOpened((prev) => !prev);
    };

    const handleClose = () => {
        setIsLeverageOptionOpened(false);
    };
    const wrapperRef = useRef(null);

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            // @ts-ignore
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                handleClose();
            }
        }

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <OrderOptionsWrapper ref={wrapperRef}>
            <CROSS $isCROSS={isCROSS} onClick={handleClick('0')}>
                {t("orderOption:cross")}
            </CROSS>
            <ISO $isISO={isISO} onClick={handleClick('1')}>
            {t("orderOption:iso")}
            </ISO>
            <Leverage onClick={handleToggleLeveragePopup}>{t("orderOption:leverage")}</Leverage>
            {isLeverageOptionOpened && <LeveragePopup handleClose={handleClose} isForMobile={isForMobile} />}
        </OrderOptionsWrapper>
    );
};

export default OrderOptions;

const OrderOptionsWrapper = styled.div`
    display: flex;
    position: relative;
`;

const baseStyle = styled.div`
    height: 30px;
    width: 70px;
    line-height: 30px;
    border-radius: 3px;
    text-align: center;
    color: ${({ theme }) => theme.colors.normalTextColor};
    font-size: 13px;
    font-weight: 700;
    margin: 0 5px 0 5px;
`;

const CROSS = styled(baseStyle)<{ $isCROSS: boolean }>`
    cursor: pointer;
    background-color: ${({ theme, $isCROSS }) => ($isCROSS ? theme.colors.orange : theme.colors.secondaryColor)};
`;
const ISO = styled(baseStyle)<{ $isISO: boolean }>`
    cursor: pointer;
    background-color: ${({ theme, $isISO }) => ($isISO ? theme.colors.orange : theme.colors.secondaryColor)};
`;
const Leverage = styled(baseStyle)`
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.orange};
`;
