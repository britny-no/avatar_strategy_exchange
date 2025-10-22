import styled, { css } from 'styled-components';
import { useTranslation } from "react-i18next";


import { Wrap } from './SectionWrap';
import LandingSectionTitle from './LandingSectionTitle';
import LandingSectionSubTitle from './LandingSectionSubTitle';
import LandingSectionContents from './LandingSectionContents';
import { ImageWrap } from './LandingSectionImageWrap';
import { ButtonWrap } from './LandingSectionButtonWrap';

import OutlinedButton from './OutlinedButton';
import useScreenSize from '@/hooks/useScreenSize';
import SECTION04 from '@/assets/landing/section4@2x.png';
import { useNavigate } from 'react-router-dom';

const Section04 = () => {
    const { t } = useTranslation()
    const navigate = useNavigate();
    const { isMobile } = useScreenSize();
    return (
        <Section $isMobile={isMobile}>
            <div className="inner">
                {isMobile && (
                    <LandingSectionImageWrap $isMobile={isMobile}>
                        <img
                            src={SECTION04}
                            style={isMobile ? { width: '225px', height: '220px' } : { width: '410px', height: '400px' }}
                            alt="section4"
                        />
                    </LandingSectionImageWrap>
                )}

                <div className="contents">
                    <LandingSectionTitle>
                        {isMobile ? (
                            <>
                                {t("landing:section_4_title_1")}
                                <br />
                                {t("landing:section_4_title_2")}
                            </>
                        ) : (
                            <>{t("landing:section_4_title_1")} {t("landing:section_4_title_2")}</>
                        )}
                    </LandingSectionTitle>
                    <LandingSectionSubTitle>{t("landing:section_4_sub_title")}</LandingSectionSubTitle>
                    <LandingSectionContents>
                        {t("landing:section_4_contents_1")}
                        <br />  {t("landing:section_4_contents_2")}
                    </LandingSectionContents>
                    <LandingSectionButtonWrap $isMobile={isMobile}>
                        <OutlinedButton onClick={() => navigate('/trade')}> {t("landing:start_trading")}</OutlinedButton>
                    </LandingSectionButtonWrap>
                </div>
                {!isMobile && (
                    <LandingSectionImageWrap $isMobile={isMobile}>
                        <img src={SECTION04} style={{ width: '410px', height: '400px' }} alt="section4" />
                    </LandingSectionImageWrap>
                )}
            </div>
        </Section>
    );
};

export default Section04;

const Section = styled(Wrap)`
    background: #f3f6f8;
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            .contents {
                width: 100%;
                text-align: right;
            }
        `}
`;

const LandingSectionImageWrap = styled(ImageWrap)`
    margin-left: 200px;

    ${({ $isMobile }) =>
    $isMobile &&
        css`
            height: 220px;
            margin-left: 0;
            & > img {
                height: auto !important;
                position: absolute !important;
                top: unset;
                left: 10px;
                transform: unset;
            }
        `}
`;

const LandingSectionButtonWrap = styled(ButtonWrap)`
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            justify-content: flex-end;
            width: auto;
            margin: 0;
        `}
`;
