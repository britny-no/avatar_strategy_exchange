import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import useSymbolList from '../../../hooks/useSymbolList';
import CoinOptionList from './CoinOptionList';
import useScreenSize from '../../../hooks/useScreenSize';

const CoinSelect = () => {
    const [symbolListOpen, setSymbolListOpen] = useState(false);

    const { currentSymbol, currentSymbolName } = useSymbolList();
    // console.log(currentSymbolName)
    const { isMobile } = useScreenSize();

    const toggleSymbolListOpen = useCallback(() => {
        setSymbolListOpen((prev) => !prev);
    }, []);

    const wrapperRef = useRef(null);

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            // @ts-ignore
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setSymbolListOpen(false);
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
        <CoinSelectWrapper ref={wrapperRef}>
            <CoinSelectedWrapper onClick={toggleSymbolListOpen}>
                {/* <CoinSelectedIcon>{coinSvg['ETH']}</CoinSelectedIcon> */}
                <CoinSelected $isMobile={isMobile}>{currentSymbolName}</CoinSelected>
                <CoinSelectedArrow $symbolListOpen={symbolListOpen} />
            </CoinSelectedWrapper>
            {symbolListOpen && <CoinOptionList toggleSymbolListOpen={toggleSymbolListOpen} />}
        </CoinSelectWrapper>
    );
};

export default React.memo(CoinSelect);

const CoinSelectWrapper = styled.div`
    /* height: 72px; */
    /* padding: 20px; */
    z-index: 10;
`;

const CoinSelectedWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-right: 15px;
    //width: 200px;
    height: 38px;
    border: none;
`;

const CoinSelected = styled.span<{ $isMobile: boolean }>`
    font-weight: 700;
    //font-size: 26px;
    font-size: ${({ theme, $isMobile }) => ($isMobile ? theme.fontSizes.largeContent : theme.fontSizes.largeContent)};
    line-height: 37.65px;
    margin: 0px 10px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.normalTextColor};
    &:hover {
        //color: black;
    }
`;

const CoinSelectedIcon = styled.div`
    width: 33px;
    height: 33px;
`;

const CoinSelectedArrow = styled.div<{ $symbolListOpen: boolean }>`
    height: 0;
    width: 0;
    position: relative;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid #a6a6a8;
    top: 1px;
    ${({ $symbolListOpen }) =>
    $symbolListOpen &&
        css`
            transform: rotate(180deg);
            top: -1px;
        `}
`;
