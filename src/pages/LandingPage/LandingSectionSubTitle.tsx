import styled, { css } from 'styled-components';
import useScreenSize from '@/hooks/useScreenSize';

interface IProps {
    children: string;
}

const LandingSectionSubTitle = ({ children }: IProps) => {
    const { isMobile } = useScreenSize();
    return <SubTitle $isMobile={isMobile}>{children}</SubTitle>;
};

export default LandingSectionSubTitle;

export const SubTitle = styled.div<{ $isMobile: boolean }>`
    margin-bottom: 18px;
    font-size: 24px;
    line-height: 28px;
    color: #000743;
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            margin-bottom: 16px;
            font-size: 15px;
            line-height: 17px;
        `}
`;
