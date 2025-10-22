import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import useScreenSize from '@/hooks/useScreenSize';

interface IProps {
    children: string | ReactNode;
}

const LandingSectionImageWrap = ({ children }: IProps) => {
    const { isMobile } = useScreenSize();
    
    return <ImageWrap $isMobile={isMobile}>{children}</ImageWrap>;
};

export default LandingSectionImageWrap;

export const ImageWrap = styled.div<{ $isMobile: boolean }>`
    position: relative;
    z-index: 1;
    width: 600px;
    height: 600px;
    overflow: hidden;
    & > img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            width: 100%;
            max-height: 270px;
            margin-bottom: 28px;
            & > img {
                position: relative;
                height: 100% !important;
                width: auto;
            }
        `}
`;
