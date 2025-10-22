import { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import useScreenSize from '@/hooks/useScreenSize';

interface IProps {
    children: string | ReactNode;
}

const LandingSectionTitle = ({ children }: IProps) => {
    const { isMobile } = useScreenSize();
    return <Title $isMobile={isMobile}>{children}</Title>;
};

export default LandingSectionTitle;

export const Title = styled.div<{ $isMobile: boolean }>`
    margin-bottom: 27px;
    font-weight: bold;
    font-size: 32px;
    line-height: 37px;
    color: #000743;
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            margin-bottom: 18px;
            font-size: 20px;
            line-height: 23px;
        `}
`;
