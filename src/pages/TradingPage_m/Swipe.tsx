import React, { useState, createRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useDispatch } from 'react-redux';
import {Grid} from '@mui/material';

import { useTypedSelector } from '@/states/useTypedSelector';
import { updateIndex } from '@/states/reducers/orderReducer';


export default function Swipe({ components, menus, reloadComponent = false }) {
    const orderReducerState = useTypedSelector((state) => state.orderReducer);
    const { index } = orderReducerState;
    const [touchStart, setTouchStart] = useState(0);
    const [numOfComponents] = useState(components.length);
    const [touchEnd, setTouchEnd] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(index);
    const dispatch = useDispatch();

    useEffect(() => {
        setCurrentIndex(index);
    }, [index])

    function handleTouchStart(e) {
        setTouchStart(e.targetTouches[0].clientX);
    }

    function handleTouchMove(e) {
        setTouchEnd(e.targetTouches[0].clientX);
    }

    function handleTouchEnd() {
        if (touchStart - touchEnd > 170) {
            moveSliderRight();
        } else if (touchStart - touchEnd < -170) {
            moveSliderLeft();
        }
    }

    const moveSliderLeft = () => {
        currentIndex === 0 ? setCurrentIndex(numOfComponents - 1) : setCurrentIndex(currentIndex - 1);
    };
    const moveSliderRight = () => {
        currentIndex === numOfComponents - 1 ? setCurrentIndex(0) : setCurrentIndex(currentIndex + 1);
    };

    const handleClick = (index) => () => {
        setCurrentIndex(index);
        currentIndex !== index && dispatch(updateIndex(index));
    };

    return (
        <Grid container>
            <HeaderComponent menus={menus} handleClick={handleClick} currentIndex={currentIndex} />
            <ContentWrapper>
                {reloadComponent ? (
                    <>
                        <Content isCurrent={true}>{components[currentIndex]}</Content>
                    </>
                ) : (
                    components.map((component, index) => (
                        <Content key={index} isCurrent={currentIndex === index}>
                            {component}
                        </Content>
                    ))
                )}
            </ContentWrapper>
        </Grid>
    );
}

const HeaderComponent = ({ menus, handleClick, currentIndex }) => {
    return (
        <Header>
            <MenuWrapper style={{ width: '100%' }}>
                {menus.map((menu, index) => (
                    <Menu key={index} isCurrent={index === currentIndex ? true : false} onClick={handleClick(index)}>
                        {menu}
                    </Menu>
                ))}
            </MenuWrapper>
        </Header>
    );
};

const Menu = styled.div<{ isCurrent: boolean }>`
    //height: 100%;
    width: auto;
    padding: 0 15px;
    text-align: center;
    font-weight: 700;
    margin-bottom: 3px;

    ${({ isCurrent }) =>
        isCurrent &&
        css`
        `}
`;
const Header = styled.div`
    width: 100vw;
    overflow-x: auto;
    transform: translate(0, 0);
    &::-webkit-scrollbar {
        display: none;
    }
`;

const MenuWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const Content = styled.div<{ isCurrent: boolean }>`
    height: 100%;
    width: 100%;
    display: ${({ isCurrent }) => (isCurrent ? 'block' : 'none')};
`;

const ContentWrapper = styled.div`
    //height: calc(100vh - 112px);
    padding-bottom: 16px;
    width: 100vw;
    overflow: auto;
    background-color: ${({ theme }) => theme.colors.primaryColor};
`;

const ContentSlide = styled.div`
    position: relative;
    display: flex;
    height: 100%;
`;
