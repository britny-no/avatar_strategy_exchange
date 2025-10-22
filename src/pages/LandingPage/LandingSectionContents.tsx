import { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import useScreenSize from '@/hooks/useScreenSize';

interface IProps {
    children: string | ReactNode;
}

const LandingSectionContents = ({ children }: IProps) => {
    const { isMobile } = useScreenSize();
    return <Contents $isMobile={isMobile}>{children}</Contents>;
};

export default LandingSectionContents;

export const Contents = styled.div<{ $isMobile: boolean }>`
    margin-bottom: 68px;
    font-size: 20px;
    line-height: 23px;
    color: #7b7b7b;
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            margin-bottom: 28px;
            font-size: 13px;
            line-height: 15px;
        `}
`;
