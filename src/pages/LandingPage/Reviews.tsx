import styled, { css } from 'styled-components';
import { useTranslation } from "react-i18next";

import { Wrap } from './SectionWrap';
import Audio from '@/components/svgs/Audio';
import useScreenSize from '@/hooks/useScreenSize';
import LandingSectionTitle from './LandingSectionTitle';
import LandingSectionContents from './LandingSectionContents';
import RATINGS from '@/assets/landing/ratings@2x.png';


const Reviews = () => {
    const { t } = useTranslation()
    const { isMobile } = useScreenSize();

    const REVIEWS = [
        {
            content: t("landing:reviews_reviews")
        },
        {
            content:t("landing:reviews_reviews")
        },
        {
            content: t("landing:reviews_reviews")
        },
        {
            content: t("landing:reviews_reviews")
        },
        {
            content: t("landing:reviews_reviews")
        },
    ];

    return (
        <Section $isMobile={isMobile}>
            <div className="inner">
                <div className="contents">
                    <LandingSectionTitle>{t("landing:reviews_title")}</LandingSectionTitle>
                    <LandingSectionContents>
                        {t("landing:reviews_contents")}
                    </LandingSectionContents>

                    <img src={RATINGS} style={isMobile ? { width: '137px' } : { width: '370px' }} alt="ratings" />
                </div>

                <ReviewCardWrap $isMobile={isMobile}>
                    {REVIEWS.map(({ content }, i) => (
                        <Card key={i} $isMobile={isMobile}>
                            <Audio />
                            <p>{content}</p>
                        </Card>
                    ))}
                </ReviewCardWrap>
            </div>
        </Section>
    );
};

export default Reviews;

const Section = styled(Wrap)`
    background: #eff3f5;
    padding: 60px 0 40px;
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
            .contents {
                width: 100%;
                padding: 0 16px;
                text-align: center;
            }
        `}
`;
const ReviewCardWrap = styled.div<{ $isMobile: boolean }>`
    width: 640px;
    height: 560px;
    padding: 40px 20px;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-base-color: transparent;
    ::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
    ::-webkit-scrollbar-thumb {
        background: rgba(90, 90, 90, 0);
    }
    ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0);
    }
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            width: 100%;
            height: 188px;
            padding: 10px 16px;
            margin-top: 24px;
            p {
                font-size: 12px;
                line-height: 14px;
            }
        `}
`;
const Card = styled.div<{ $isMobile: boolean }>`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: 106px;
    margin-bottom: 26px;
    padding: 34px 30px;
    background: #ffffff;
    box-shadow: 0px 6px 26px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    p {
        margin-left: 16px;
    }
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            width: 100%;
            height: auto;
            padding: 10px 16px;
            margin-bottom: 8px;
            p {
                font-size: 12px;
                line-height: 14px;
            }
        `}
`;
