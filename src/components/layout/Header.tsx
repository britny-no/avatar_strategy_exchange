import { NavLink } from 'react-router-dom';
import Navigation from './Navigation';
import styled, { css } from 'styled-components';
import useScreenSize from '../../hooks/useScreenSize';
import ImcosunLightLogo from '../../assets/imcosun-rev.svg';
import ImcosunDarkLogo from '../../assets/imcosun.svg';
import RexLogoW from '../../assets/svg/bittrex-logo-white.svg';
import RexLogoB from '../../assets/svg/bittrex-logo-black.svg';

interface IProps {
    headerType?: 'absolute' | 'relative';
    theme?: 'dark' | 'light';
}

const Header = ({ headerType = 'absolute', theme = 'dark' }: IProps) => {
    const { isMobile } = useScreenSize();

    return (
        <StyledHeader $isMobile={isMobile} $headerType={headerType}>
            <LOGO to="/" $isMobile={isMobile}>
              {
                  import.meta.env.VITE_EXCHANGE === 'BITREX' ? 
                  <img src={theme === 'light' ? RexLogoB : RexLogoW} alt="logo" /> 
                : <img src={theme === 'light' ? ImcosunDarkLogo : ImcosunLightLogo} alt="logo" /> 
              }
            </LOGO>
            <Navigation theme={theme} />
        </StyledHeader>
    );
};

export default Header;

const StyledHeader = styled.div<{ $isMobile: boolean; $headerType: 'absolute' | 'relative' }>`
    position: ${({ $headerType }) => $headerType};
    top: 0;
    z-index: 100;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 74px;
    min-height: 50px;
    min-width: 1040px;
    padding: 8px 46px;
    background: transparent;
    box-sizing: border-box;
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            width: 100%;
            height: 48px;
            padding: 13px 16px;
            min-width: 360px;
        `}
`;

const LOGO = styled(NavLink)<{ $isMobile: boolean }>`
    width: 128px;
    margin-right: 56px;
    font-weight: bold;
    font-size: 30px;
    line-height: 34px;
    color: #ffffff;

    .black {
        color: #000;
    }

    ${({ $isMobile }) =>
    $isMobile &&
        css`
            width: 140px;
            height: 43px;
            font-size: 18px;
            line-height: 21px;
        `}
`;
