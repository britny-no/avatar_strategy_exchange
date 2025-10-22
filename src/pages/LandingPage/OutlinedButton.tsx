import styled, { css } from 'styled-components';
import { Button } from '@mui/material';

import useScreenSize from '@/hooks/useScreenSize';

interface IProps {
    children: string | string[];
    onClick?: () => void;
}

const OutlinedButton = ({ children, onClick }: IProps) => {
    const { isMobile } = useScreenSize();
    return (
        <StyledOutlinedButton $isMobile={isMobile} onClick={onClick}>
            {children}
        </StyledOutlinedButton>
    );
};

export default OutlinedButton;

export const StyledOutlinedButton = styled(Button)<{ $isMobile: boolean }>`
    width: 200px;
    height: 62px;
    border: 2px solid #f49405 !important;
    box-sizing: border-box;
    border-radius: 6px;
    text-align: center;
    padding: 17px 0 !important;
    text-transform: unset !important;
    & > span {
        font-weight: bold;
        font-size: 20px;
        line-height: 28px;
        color: #f49405;
    }
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            width: 120px;
            height: 42px;
            > span {
                font-size: 13px;
                line-height: 15px;
            }
        `}
`;
