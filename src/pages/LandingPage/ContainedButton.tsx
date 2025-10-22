import styled, { css } from 'styled-components';
import { Button } from '@mui/material';
import useScreenSize from '@/hooks/useScreenSize';

interface IProps {
    children: string | string[];
    onClick?: () => void;
}

const ContainedButton = ({ children, onClick }: IProps) => {
    const { isMobile } = useScreenSize();
    return (
        <StyledContainedButton $isMobile={isMobile} onClick={onClick}>
            {children}
        </StyledContainedButton>
    );
};

export default ContainedButton;

export const StyledContainedButton = styled(Button)<{ $isMobile: boolean }>`
    width: 200px;
    height: 62px;
    background: linear-gradient(92.5deg, #f29100 1.95%, #ffab2e 98.72%);
    border-radius: 6px;
    text-align: center;
    text-transform: unset !important;
    padding: 17px 0 !important;
    & > span {
        font-weight: bold;
        font-size: 20px;
        line-height: 28px;
        color: #ffffff;
    }
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            width: 120px;
            height: 42px;
            > span {
                font-size: 12px;
                line-height: 15px;
            }
        `}
`;
