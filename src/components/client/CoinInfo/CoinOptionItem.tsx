import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import { updateCurrentSymbol } from '../../../states/reducers/symbolReducer';
import { updateOrderTab } from '../../../states/reducers/orderReducer';

interface PropsType {
    symbolCode: string;
    symbolName: string;
    toggleSymbolListOpen: () => void;
}

const CoinOptionItem = ({ symbolCode, symbolName, toggleSymbolListOpen }: PropsType) => {
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(updateCurrentSymbol(symbolCode));

        const input = {
            index: 0, // userReducer의 index 0로 바꾸기 : 0===New order tab
            data: {
                szRate: '', // 주문가
                fLot: '', // 수량
            },
        };
        dispatch(updateOrderTab(input));

        toggleSymbolListOpen();
    };

    return (
        <OptionItem onClick={handleClick}>
            <OptionName>{symbolName}</OptionName>
        </OptionItem>
    );
};

export default React.memo(CoinOptionItem);

const OptionItem = styled.li`
    width: 100%;
    font-size: 16px;
    border: 0;
    padding: 5px 15px;
    cursor: pointer;
    &:hover {
        background-color: ${({ theme }) => theme.colors.secondaryColor};
    }
`;

const OptionName = styled.span`
    font-weight: 600;
    font-size: 16px;
    line-height: 37.65px;
`;
