
import styled, { css } from 'styled-components';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

import { Wrap } from './SectionWrap';
import LandingSectionTitle from './LandingSectionTitle';
import LandingSectionSubTitle from './LandingSectionSubTitle';
import { ImageWrap } from './LandingSectionImageWrap';
import LandingSectionButtonWrap from './LandingSectionButtonWrap';
import LandingSectionContents from './LandingSectionContents';
import OutlinedButton from './OutlinedButton';
import useScreenSize from '@/hooks/useScreenSize';
import SECTION03 from '@/assets/landing/section3@2x.png';

const Section03 = () => {
    const { t } = useTranslation()
    const navigate = useNavigate();
    const { isMobile } = useScreenSize();

    return (
        <Section $isMobile={isMobile}>
            <div className="inner">
                <LandingSectionImageWrap $isMobile={isMobile}>
                    <img
                        src={SECTION03}
                        style={isMobile ? { width: '225px', height: '244px' } : { width: '423px', height: '460px' }}
                        alt="section3"
                    />
                </LandingSectionImageWrap>
                <div>
                    <LandingSectionTitle>{t("landing:section_3_title")}</LandingSectionTitle>
                    <LandingSectionSubTitle>{t("landing:section_3_sub_title")}</LandingSectionSubTitle>
                    <LandingSectionContents>
                        {t("landing:section_3_contents")}
                    </LandingSectionContents>
                    <LandingSectionButtonWrap>
                        <OutlinedButton onClick={() => navigate('/trade')}>{t("landing:start_trading")}</OutlinedButton>
                    </LandingSectionButtonWrap>
                </div>
            </div>
        </Section>
    );
};

export default Section03;

const Section = styled(Wrap)`
    background: #ffffff;
`;

const LandingSectionImageWrap = styled(ImageWrap)`
    margin-right: 140px;
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            margin-right: 0;
            & > img {
                position: absolute !important;
                top: unset;
                left: unset;
                transform: unset;
                right: 0;
            }
        `}
`;
