import React from 'react';
import styled, { css } from 'styled-components';
import useSymbolList from '../../../hooks/useSymbolList';
import { useTypedSelector } from '../../../states/useTypedSelector';
import CoinOptionItem from './CoinOptionItem';
import ScrollBar from '../../../styled/ScrollBar';

interface PropsType {
    toggleSymbolListOpen: () => void;
}

const CoinOptionList = ({ toggleSymbolListOpen }: PropsType) => {
    const { symbols: symbolList } = useSymbolList();
    const symbolListKey = Object.keys(symbolList);

    return (
        <>
            {symbolList && (
                <OptionList>
                    {symbolList.map(({ CUR_NO, NAME_ENG }, index) => (
                        <CoinOptionItem
                            key={index}
                            symbolName={NAME_ENG}
                            symbolCode={CUR_NO}
                            toggleSymbolListOpen={toggleSymbolListOpen}
                        />
                    ))}
                </OptionList>
            )}
        </>
    );
};

export default React.memo(CoinOptionList);

// const test=

const OptionList = styled(ScrollBar)`
    background-color: ${({ theme }) => theme.colors.primaryColor};
    color: ${({ theme }) => theme.colors.normalTextColor};
    border: 1px solid ${({ theme }) => theme.colors.secondaryColor};
    max-height: 500px;
    overflow: auto;
    //margin-top: 8px;
    position: absolute;
    z-index: 1;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 200px;
    padding: 10px 0;
    transition: all 0.35s ease;
    cursor: pointer;

    li {
        list-style-type: none;
    }
`;
