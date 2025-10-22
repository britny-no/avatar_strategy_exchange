import styled, { css } from 'styled-components';
import { Button } from '@mui/material';
import useScreenSize from '../../hooks/useScreenSize';
import { useTranslation } from "react-i18next";

interface IProps {
    onClick: () => void;
    theme?: 'dark' | 'light';
}

const LogoutButton = ({ onClick, theme }: IProps) => {
    const { isMobile } = useScreenSize();
    const { t } = useTranslation()
    return (
        <StyledLogoutButton $isMobile={isMobile} onClick={onClick} theme={theme}>
            {t("landing:logout")}
        </StyledLogoutButton>
    );
};

export default LogoutButton;

export const StyledLogoutButton = styled(Button)<{ $isMobile: boolean; theme?: 'dark' | 'light' }>`
    width: 90px;
    height: 32px;
    border: ${({ theme }) =>
        theme === 'light'
            ? '1px solid rgba(0, 0, 0, 0.62) !important'
            : '1px solid rgba(255, 255, 255, 0.62) !important'};
    box-sizing: border-box;
    border-radius: 4px;
    text-align: center;
    padding: 5px 10px !important;
    text-transform: unset !important;
    & > span {
        font-weight: bold;
        font-size: 1.4rem;
        line-height: 23px;
        color: ${({ theme }) =>
            theme === 'light' ? 'rgba(0, 0, 0, 0.62) !important' : 'rgba(255, 255, 255, 0.62) !important'};
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
