import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import GUIDE01 from '@/assets/landing/guide01@2x.png';
import GUIDE02 from '@/assets/landing/guide02@2x.png';
import GUIDE03 from '@/assets/landing/guide03@2x.png';
import { Wrap } from './SectionWrap';
import useScreenSize from '@/hooks/useScreenSize';
import useSymbolList from '@/hooks/useSymbolList';
import CoinCard from './CoinCard';


const Guides = () => {
    const { t } = useTranslation()
    const navigate = useNavigate();
    const { isMobile } = useScreenSize();
    const { symbolsInObjectForm } = useSymbolList();

    const symbolKeyArr = Object.keys(symbolsInObjectForm).slice(0, 2);
    const IMAGES = [
        {
            img: GUIDE01,
            alt: 'GUIDE01',
            contents: t("landing:guides_guide_1")
        },
        {
            img: GUIDE02,
            alt: 'GUIDE02',
            contents: t("landing:guides_guide_2")
        },
        {
            img: GUIDE03,
            alt: 'GUIDE03',
            contents: t("landing:guides_guide_3")
        },
    ];

    return (
        <Section $isMobile={isMobile}>
            <Inner $isMobile={isMobile}>
                <div className="row coin">
                    {symbolKeyArr.map((symbol, index) => {
                        return (
                            <CoinCard
                                key={index}
                                isMobile={isMobile}
                                symbolData={symbolsInObjectForm[symbol]}
                            />
                        );
                    })}
                </div>
                <div className="image row">
                    {IMAGES.map(({ img, alt, contents }) => {
                        return (
                            <ImageCard $isMobile={isMobile} key={alt} onClick={() => navigate("/guide/user-guide")}>
                                <div className="image-wrap">
                                    <img src={img} alt={alt} />
                                </div>
                                <span className="highlight">{contents}</span>
                            </ImageCard>
                        );
                    })}
                </div>
            </Inner>
        </Section>
    );
};

export default Guides;

const Section = styled(Wrap)`
    padding: 70px 16px;
    height: 679px;
    background: #fff;
    .contents {
        width: 557px;
        height: auto;
        > img {
            width: auto;
        }
    }

    ${({ $isMobile }) =>
    $isMobile &&
        css`
            height: auto;
            .contents {
                width: 100%;
                text-align: center;
            }
        `}
`;

const Inner = styled.div<{ $isMobile: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 1440px;
    margin: 0 auto;
    .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 536px;
    }
    .image.row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 1340px;
        margin-top: 30px;
    }
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            width: 100%;
            .row {
                width: 100%;
            }
            .coin.row {
                padding: 0 28px;
            }
            .image.row {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-top: 10px;
            }
        `}
`;

const ImageCard = styled.div<{ $isMobile: boolean }>`
    width: 410px;
    height: 269px;
    padding: 20px;
    text-align: center;
    background: #ffffff;
    box-shadow: 0px 6px 26px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    & > div.image-wrap {
        height: 150px;
        margin-bottom: 40px;
        & > img {
            width: auto;
            height: 100%;
        }
    }
    & > span.highlight {
        position: relative;
        font-size: 17px;
        line-height: 20px;
        text-align: center;
        color: #575757;
        ::before {
            position: absolute;
            left: 50%;
            bottom: -3px;
            transform: translateX(-50%);
            content: '';
            width: 104%;
            height: 12px;
            background: rgba(237, 116, 67, 0.3);
        }
    }
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            width: 100%;
            height: 208px;
            padding: 25px 28px;
            margin-bottom: 10px;
            & > div.image-wrap {
                height: 110px;
                margin-bottom: 30px;
                & > img {
                    width: auto;
                    height: 100%;
                }
            }
            & > span.highlight {
                font-size: 14px;
                line-height: 16px;
            }
        `}
`;
