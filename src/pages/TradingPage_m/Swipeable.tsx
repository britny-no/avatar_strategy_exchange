import { TweenMax } from 'gsap/gsap-core';
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
export default function Swipeable({ components }) {
    const [touchStart, setTouchStart] = useState(0);
    const [screenWidth] = useState(window.screen.width);
    const [numOfComponents] = useState(components.length);
    const [touchEnd, setTouchEnd] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const contentSlideRef = useRef<HTMLDivElement>(null);
    const currentSlideLeft = useRef(0);

    useEffect(() => {
        TweenMax.to(contentSlideRef.current, 0.2, {
            left: -currentIndex * screenWidth,
        });
    }, [currentIndex]);

    function handleTouchStart(e) {
        setTouchStart(e.targetTouches[0].clientX);

        let currentLeft = contentSlideRef.current!.style.left.replace('px', '');
        currentSlideLeft.current = parseInt(currentLeft);
    }

    function handleTouchMove(e) {
        setTouchEnd(e.targetTouches[0].clientX);
        let offset: number = touchStart - e.targetTouches[0].clientX;
        // When slide go too far to left
        if (currentSlideLeft.current - offset > 0) return;
        // When slide go too far to right
        if (currentSlideLeft.current - offset < -screenWidth * (numOfComponents - 1)) return;

        TweenMax.to(contentSlideRef.current, 0, {
            left: currentSlideLeft.current - offset,
        });
    }

    function handleTouchEnd() {
        if (touchStart - touchEnd > 170) {
            moveSliderRight();
        } else if (touchStart - touchEnd < -170) {
            moveSliderLeft();
        } else {
            backTo();
        }
    }

    const moveSliderLeft = () => {
        currentIndex !== 0 && setCurrentIndex(currentIndex - 1);
    };
    const moveSliderRight = () => {
        currentIndex !== numOfComponents - 1 && setCurrentIndex(currentIndex + 1);
    };
    const backTo = () => {
        TweenMax.to(contentSlideRef.current, 0.2, {
            left: -currentIndex * screenWidth,
        });
    };

    return (
        <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchMove={handleTouchMove}>
            <ContentWrapper>
                <ContentSlide ref={contentSlideRef} style={{ width: `${numOfComponents * 100}vh`, left: '0' }}>
                    {components.map((component, index) => (
                        <Content key={index} isCurrent={currentIndex === index}>
                            {component}
                        </Content>
                    ))}
                </ContentSlide>
            </ContentWrapper>
        </div>
    );
}

const Content = styled.div<{ isCurrent: boolean }>`
    height: 100%;
    width: 100vw;
`;

const ContentWrapper = styled.div`
    height: calc(100vh - 50px);
    position: relative;
    overflow: hidden;
`;

const ContentSlide = styled.div`
    position: relative;
    display: flex;
    height: 100%;
`;
