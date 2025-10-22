import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Button } from '@mui/material';
import { useTranslation } from "react-i18next";

import ILLUST from '@/assets/landing/hero_illust@3x.png';
import BACKGROUND from '@/assets/landing/hero_bg@2x.png';
import GraphCard from './GraphCard';

import useScreenSize from '@/hooks/useScreenSize';
import useSymbolList from '@/hooks/useSymbolList';

const Hero = () => {
    const { t } = useTranslation()
    const { isMobile } = useScreenSize();
    const navigate = useNavigate();
    const { symbolsInObjectForm } = useSymbolList();

    const symbolKeyArr = Object.keys(symbolsInObjectForm).map((data) => data);
    return (
        <StyledHero $isMobile={isMobile}>
            <img src={BACKGROUND} alt="hero background" />
            <div className="contents-wrapper">
                <div className="content-box">
                    <p className="title">
                        <>{t("landing:title")}</>
                    </p>
                    <p className="info">
                    {t("landing:sub_title_1")}
                        <br /> {t("landing:sub_title_2")}
                    </p>
                    <div className="button">
                        <Button variant="contained" onClick={() => navigate('/mobile/signup')}>
                        {t("landing:join_now")}
                        </Button>
                    </div>
                </div>

                <div className="illust-wrap">
                    <img src={ILLUST} alt="hero illust" />
                </div>
            </div>
            <div className="card-wrap">
                {symbolKeyArr.length > 0 && symbolKeyArr.map((symbol, index) => {
                    return (
                        <GraphCard key={index} symbolData={symbolsInObjectForm[symbol]}/>
                    )
                })}
            </div>
        </StyledHero>
    );
};

export default Hero;

const StyledHero = styled.div<{ $isMobile: boolean }>`
    position: relative;
    z-index: 0;
    width: 100%;
    height: 1140px;
    background: #f3f6f8;

    & > img {
        position: absolute;
        top: 0;
        z-index: -1;
        width: 100%;
        height: auto;
    }

    .contents-wrapper {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        max-width: 1440px;
        padding: 160px 0 80px;
        margin: 0 auto;
    }

    .title {
        width: 100%;
        margin-bottom: 40px;
        font-weight: bold;
        font-size: 44px;
        line-height: 60px;
        color: #ffffff;
    }

    .info {
        margin-bottom: 50px;
        font-size: 20px;
        line-height: 32px;

        color: #ffffff;
    }

    .button > Button {
        width: 200px;
        height: 62px;
        background: linear-gradient(92.5deg, #f29100 1.95%, #ffab2e 98.72%);
        border-radius: 6px;
        font-weight: bold;
        font-size: 24px;
        line-height: 28px;
        color: #ffffff;
        text-transform: unset !important;
    }

    .illust-wrap {
        width: 700px;
        > img {
            width: 100%;
            height: 100%;
        }
    }

    .card-wrap {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 1340px;
        margin: 0 auto;
    }

    ${({ $isMobile }) =>
    $isMobile  &&
        css`
            height: auto;
            padding-bottom: 30px;

            & > img {
                position: absolute;
                top: 0;
                left: -40px;
                z-index: -1;
                width: 200%;
                height: auto;
            }

            .contents-wrapper {
                position: relative;
                display: block;
                padding: 116px 16px;
            }

            .title {
                width: 100%;
                margin-bottom: 10px;
                font-size: 20px;
                line-height: 23px;
            }

            .info {
                max-width: 200px;
                width: 100%;
                margin-bottom: 26px;
                font-size: 9px;
                line-height: 10px;
                color: #ffffff;
            }

            & .button > Button {
                width: 96px;
                height: 32px;
                background: linear-gradient(92.5deg, #f29100 1.95%, #ffab2e 98.72%);
                border-radius: 4px;
                font-weight: bold;
                font-size: 12px;
                line-height: 14px;
                text-align: center;

                color: #ffffff;
            }

            .card-wrap {
                width: 100%;
                padding: 0 16px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 120px 120px;
                gap: 12px 10px;
            }

            .illust-wrap {
                position: absolute;
                width: 233px;
                top: 48%;
                right: 3%;
            }
        `}
`;
