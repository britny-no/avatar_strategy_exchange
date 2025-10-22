import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';

import { tabClicked } from '@/states/reducers/orderReducer';

const OrderTabMenu = ({
    menu = [],
    components = [],
    tabWidth = 150, // Reset this value if needed
    tabHeight = 300, // Reset this value if needed
    currentTabProp = 0,
}) => {
    const [currentTab, setCurrentTab] = useState(currentTabProp);
    const dispatch = useDispatch();

    useEffect(() => {
        setCurrentTab(currentTabProp);
    }, [currentTabProp]);

    const handleClick = (i) => () => {
        if (currentTab !== i) {
            dispatch(tabClicked({ index: i }));
        }
    };

    const tabStyle = useMemo(
        () => ({
            width: tabWidth,
            height: tabHeight,
            lineHeight: `${tabHeight}px`,
        }),
        [tabWidth, tabHeight],
    );

    return (
        <TapWrapper>
            <TapHeader>
                {menu.map((m, i) => (
                    <TapMenu
                        key={i}
                        onClick={handleClick(i)}
                        style={tabStyle}
                        $isCurrent={currentTab === i}
                    >
                        {m}
                    </TapMenu>
                ))}
            </TapHeader>
            {components.map((component, index) => (
                <TabContent key={index} $isCurrent={currentTab === index}>
                    {component}
                </TabContent>
            ))}
        </TapWrapper>
    );
};

export default React.memo(OrderTabMenu);
const TapHeader = styled.div`
    background-color: ${({ theme }) => theme.colors.inputFieldColor};
`;
const TabContent = styled.div<{ $isCurrent: boolean }>`
    ${({ $isCurrent }) =>
    $isCurrent
            ? css`
                  display: block;
              `
            : css`
                  display: none;
              `}
`;
const TapMenu = styled.div<{ $isCurrent: boolean }>`
    font-size: 14px;
    cursor: pointer;
    text-align: center;
    border-bottom: 1px solid #223141;
    margin-bottom: 3px;
    height: ${({ theme }) => theme.tabMenu.tabMenuHeight};
    line-height: ${({ theme }) => theme.tabMenu.tabMenuHeight};

    ${({ $isCurrent }) =>
    $isCurrent
            ? css`
                  color: ${({ theme }) => theme.colors.tabHeaderTextOnFocusColor};
                  font-weight: 700;
                  border-bottom: 2px solid ${({ theme }) => theme.colors.tabHeaderTextOnFocusColor};
              `
            : css`
                  color: ${({ theme }) => theme.colors.tabHeaderTextColor};
                  font-weight: 700;

                  &:hover {
                  }
              `}
`;

const TapWrapper = styled.div`
    background-color: ${({ theme }) => theme.colors.primaryColor};

    ${TapHeader} {
        display: flex;
        white-space: nowrap;
    }
`;
