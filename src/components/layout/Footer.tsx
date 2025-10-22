import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import useScreenSize from '../../hooks/useScreenSize';
import ChosunW from '../../assets/imcosun-logo.png';
import ImcosunLightLogo from '../../assets/imcosun-rev.svg';
import ImcosunDarkLogo from '../../assets/imcosun.svg';
// import RexLogoB from '../../assets/svg/bittrex-logo-black.svg';
import RexLogoW from '../../assets/svg/bittrex-logo-white.svg';
import RexLogoB from '../../assets/svg/bittrex-logo-black.svg';
import SymbolLogo from '../../assets/imcosun-rev2.svg';

interface IProps {
    theme?: 'dark' | 'light';
}


const FooterContent = ({theme}) =>{
    const {t} = useTranslation()

    return import.meta.env.VITE_EXCHANGE === 'BITREX' ?
    <>
        <p className="logo">
        <img  src={theme === 'light'? RexLogoB : RexLogoW} alt="logo" /> 
        </p>         
        <p className="info">
        {t("footer:bitrex_info_1")}<br/>
        {t("footer:bitrex_info_2")}<br/>
        {t("footer:bitrex_info_3")}<br/>
        </p>   
             
    </>
:
    <>
    <p className="logo">
        <img src={theme === 'light'? ImcosunDarkLogo : ImcosunLightLogo} alt="SymbolLogo" />
    </p>
    <p className="info">
    {t("footer:imchosun_info_1")}
        <br />
        {t("footer:imchosun_info_2")}
        <br />
        {t("footer:imchosun_info_3")}
        <br />
        {t("footer:imchosun_info_4")}
    </p>
    </>
}

const Footer = ({ theme }: IProps) => {
    const { isMobile } = useScreenSize();

    return (
        <FooterWrap $isMobile={isMobile} theme={theme}>
            {isMobile ? (
                <>
                    <div className="company">
                        <FooterContent theme={theme}/>
                    </div>
                </>
            ) : (
                <>
                    <div className="company">
                        <FooterContent theme={theme}/>
                    </div>
                </>
            )}
        </FooterWrap>
    );
};

export default Footer;

const FooterWrap = styled.div<{ $isMobile: boolean, theme: string }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 360px;
    padding: 30px 90px 0px 90px;
    ${({ theme }) => theme  === "light" && css`background-color: #ffffff;` }
   
    & .company {
        > .logo {
            margin-bottom: 20px;
            font-weight: bold;
            font-size: 30px;
            line-height: 34px;
            color: rgba(255, 255, 255, 0.7);
            >img{ width:180px; }
        }
        > .info {
            font-weight: normal;
            font-size: 14px;
            line-height: 22px;
            color: black;
            color: ${({ theme }) => theme  === "dark" && css`rgba(255, 255, 255, 0.5);` }
            
        }
    }
    & .category {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        height: auto;
        padding-left: 70px;
        border-left: 1px solid rgba(255, 255, 255, 0.4);
        > .links {
            width: 142px;
            margin-right: 80px;
            > a {
                display: block;
                margin-bottom: 16px;
                font-weight: bold;
                font-size: 15px;
                line-height: 17px;
                text-decoration-line: underline;

                color: rgba(255, 255, 255, 0.7);
            }
        }
    }
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            flex-direction: row;
            height: auto;
            padding: 40px 16px;

            & .company {
                flex-direction: row;
                width: 100%;
                height: 100%;
            }
            & .category {
                width: 100%;
                padding: 0;
                border-left: none;
            }
            & .info {
                margin-top: 70px;
            }
        `}
`;
