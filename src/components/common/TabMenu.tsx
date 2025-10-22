import React, { useState, useMemo, useCallback } from 'react';
import styled, { css } from 'styled-components';

interface PropsType {
  menu: Array<string>;
  components: Array<React.ReactNode>;
  tabWidth?: number | string;
  tabHeight?: number;
  reloadComponent?: boolean;
  menuHeight?: number;
}

export default function TabMenu({
                                  menu,
                                  components,
                                  tabWidth = 108,
                                  tabHeight = 40,
                                  reloadComponent = false,
                                  menuHeight = undefined,
                                }: PropsType) {
  const [currentTab, setCurrentTab] = useState(0);
  const handleClick = (i) => () => {
    setCurrentTab(i);
  };

  const tabStyle = useMemo(
    () => ({
      width: tabWidth,
      height: tabHeight,
      lineHeight: `${tabHeight}px`,
    }),
    [],
  );

  const tabWrapperStyle = useMemo(
    () => ({
      // height: menuHeight || 'auto',
    }),
    [],
  );

  return (
    <TabWrapper style={tabWrapperStyle}>
      <TabHeader>
        {menu.map((m, i) => (
          <TabHeaderItem key={i} onClick={handleClick(i)} $isCurrent={currentTab === i} style={tabStyle}>
            {m}
          </TabHeaderItem>
        ))}
      </TabHeader>
      {reloadComponent === true ? (
        <TabContent $isCurrent={true}>{components[currentTab]}</TabContent>
      ) : (
        components.map((component, index) => (
          <TabContent key={index} $isCurrent={currentTab === index}>
            {component}
          </TabContent>
        ))
      )}
    </TabWrapper>
  );
}
const TabHeader = styled.div`
    display: flex;
    white-space: nowrap;
    background-color: ${({ theme }) => theme.colors.inputFieldColor};
    line-height: ${({ theme }) => theme.tabMenu.tabMenuHeight};
`;
const TabHeaderItem = styled.div<{ $isCurrent: boolean }>`
    border-bottom: 1px solid #223141;
    text-align: center;
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSizes.tabHeader};
    margin-bottom: 3px;
    height: ${({ theme }) => theme.tabMenu.tabMenuHeight};

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
                      //color: #d0d1d4;
                      //font-weight: 700;
                  }
              `}
`;
const TabContent = styled.div<{ $isCurrent: boolean }>`
    background-color: ${({ theme }) => theme.colors.primaryColor};
    ${({ $isCurrent }) =>
    $isCurrent
    ? css`
                  display: block;
              `
    : css`
                  display: none;
              `}
`;
const TabWrapper = styled.div`
    overflow: hidden;
`;
