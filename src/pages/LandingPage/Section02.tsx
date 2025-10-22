import styled, { css } from 'styled-components';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

import { Wrap } from './SectionWrap';
import LandingSectionTitle from './LandingSectionTitle';
import LandingSectionSubTitle from './LandingSectionSubTitle';
import LandingSectionImageWrap from './LandingSectionImageWrap';
import LandingSectionButtonWrap from './LandingSectionButtonWrap';
import LandingSectionContents from './LandingSectionContents';
import OutlinedButton from './OutlinedButton';
import useScreenSize from '@/hooks/useScreenSize';
import SECTION02_BACKGROUND from '@/assets/landing/section2_background@2x.png';
import SECTION02_CAPTURE from '@/assets/landing/section2_pc@2x.png';


const Section02 = () => {
    const { t } = useTranslation()
    const navigate = useNavigate();
    const { isMobile } = useScreenSize();
    return (
        <Section $isMobile={isMobile}>
            <div className="inner">
                {isMobile && (
                    <LandingSectionImageWrap>
                        <div >
                            <img src={SECTION02_CAPTURE} style={{ width: '100%', height: 'auto' }} alt="section2" />
                        </div>
                    </LandingSectionImageWrap>
                )}
                <div>
                    <LandingSectionTitle>
                        {isMobile ? (
                            <p>
                                {t("landing:section_2_title_1")}
                                <br />
                                {t("landing:section_2_title_2")}
                            </p>
                        ) : (
                            <> {t("landing:section_2_title_1")}  {t("landing:section_2_title_2")}</>
                        )}
                    </LandingSectionTitle>
                    <LandingSectionSubTitle>{t("landing:section_2_sub_title")}</LandingSectionSubTitle>
                    <LandingSectionContents>
                        {isMobile ? (
                            <p>
                               {t("landing:section_2_contents_1")} <br /> {t("landing:section_2_contents_2")}
                            </p>
                        ) : (
                            <>{t("landing:section_2_contents_1")} {t("landing:section_2_contents_2")}</>
                        )}
                    </LandingSectionContents>
                    <LandingSectionButtonWrap>
                        <OutlinedButton onClick={() => navigate('/trade')}>{t("landing:start_trading")}</OutlinedButton>
                    </LandingSectionButtonWrap>
                </div>
                {!isMobile && (
                    <LandingSectionImageWrap>
                        <div style={{width: '100% !important', height: 'auto !important', top: '15%', position: 'absolute'}}>
                            <img src={SECTION02_CAPTURE} style={{ width: '575px', height: '379px' }} alt="section2" />
                        </div>
                    </LandingSectionImageWrap>
                )}
            </div>
            <div className="absolute-background">
                <img src={SECTION02_BACKGROUND} alt="section2_background" />
            </div>
        </Section>
    );
};

export default Section02;

const Section = styled(Wrap)`
    background: #f3f6f8;
    & > .absolute-background {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 0;
        height: auto;
        width: 676px;
    }
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            & > .absolute-background {
                position: absolute;
                top: 0;
                right: 0;
                z-index: 0;
                height: auto;
                width: 235px;
            }
        `}
`;
