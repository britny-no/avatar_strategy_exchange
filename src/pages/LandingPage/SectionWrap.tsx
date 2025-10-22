import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import useScreenSize from '@/hooks/useScreenSize';

interface IProps {
    children: string | ReactNode;
}

const SectionWrap = ({ children }: IProps) => {
    const { isMobile } = useScreenSize();

    return (
        <Wrap $isMobile={isMobile}>
            <div className="inner">{children}</div>
        </Wrap>
    );
};

export default SectionWrap;

export const Wrap = styled.div<{ $isMobile: boolean }>`
    width: 100%;
    position: relative;
    padding: 40px 50px;
    overflow: hidden;
    .inner {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        max-width: 1440px;
        margin: 0 auto;
    }
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            width: 100%;
            height: auto;
            padding: 60px 16px;
            .inner {
                display: flex;
                width: 100%;
                max-width: unset;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
            }
        `}
`;
