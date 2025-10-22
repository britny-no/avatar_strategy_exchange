import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
// import { Link } from "react-router-dom";
import { TweenMax } from 'gsap';

const MenuItems = ({ items, handleClick }) => {
    return items.map((item, index) => (
        <Link key={index} onClick={handleClick(index)}>
            <StyledLink>{item}</StyledLink>
        </Link>
    ));
};

const StyledLink = styled.div`
    cursor: pointer;
    /* margin: 0 10px; */
    padding: 10px 20px;
    border-radius: 3%;
    color: #b2bbc8;
    &:hover {
        background-color: rgb(243, 243, 245);
    }
`;

const MobileTabMenu = ({ components, menus }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const leftMenuRef = useRef<any>(null);

    let touchStartX = 0;
    let previousX = 0;
    const handleTouchStart = (e) => {
        touchStartX = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
        const x = e.targetTouches[0].clientX;
        const howMuchMoved = touchStartX - x;

        let lastPossibleX = leftMenuRef.current!.getBoundingClientRect().width - window.screen.width;

        let howMuchMove = howMuchMoved + previousX;

        if (howMuchMove < 0 || howMuchMove >= lastPossibleX) return;

        TweenMax.to(leftMenuRef.current, 0, {
            transform: `translate(${-howMuchMove}px,0)`,
        });
    };

    const handleTouchEnd = (e) => {
        previousX = -leftMenuRef.current!.computedStyleMap().get('transform')[0].x.value;
    };

    const handleClick = (index) => () => {
        setCurrentIndex(index);
    };

    return (
        <StLayout>
            <MenuWrapper
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                ref={leftMenuRef}
            >
                <MenuItems items={menus} handleClick={handleClick} />
            </MenuWrapper>
            <ContentWrapper>
                {components.map((component, index) => (
                    <Content key={index} isCurrent={currentIndex === index}>
                        {component}
                    </Content>
                ))}
            </ContentWrapper>
        </StLayout>
    );
};

export default MobileTabMenu;

const Link = styled.div``;

const Logo = styled.div``;
const SearchBar = styled.input``;
const StLayout = styled.div`
    display: flex;
    flex-flow: column;
    height: 100vh;
    overflow-x: hidden;
`;
const Content = styled.div<{ isCurrent: boolean }>`
    display: ${({ isCurrent }) => (isCurrent ? 'block' : 'none')};
`;
const Header = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 10px 0px;
    background-color: #101013;
    color: #b2bbc8;
    ${Logo} {
        padding: 0px 30px;
        font-size: 16px;
    }

    ${SearchBar} {
        margin-left: 2px;
        padding: 10px 16px;
        width: 200px;
        border: 1px solid #3a3a3a;
        border-radius: 1%;
        background-color: rgba(0, 0, 0, 0);
        color: inherit;
    }
`;

const MenuWrapper = styled.div`
    transform: translate(0, 0);
    background-color: #f8f8fa;
    display: flex;
    align-items: center;
    width: 100vw;
    min-width: 1024px;
`;
const ContentWrapper = styled.div`
    overflow: auto;
    text-align: center;
    flex: 1;
`;
