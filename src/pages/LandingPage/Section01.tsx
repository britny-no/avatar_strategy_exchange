import styled, { css } from 'styled-components';
import { useTranslation } from "react-i18next";

import { Wrap } from './SectionWrap';
import LandingSectionTitle from './LandingSectionTitle';
import LandingSectionImageWrap from './LandingSectionImageWrap';
import LandingSectionButtonWrap from './LandingSectionButtonWrap';
import ContainedButton from './ContainedButton';
import SECTION01 from '@/assets/landing/section01_pc@2x.png';
import useScreenSize from '@/hooks/useScreenSize';
import LandingSectionContents from './LandingSectionContents';


const Section01 = () => {
    const { t } = useTranslation()
    const { isMobile } = useScreenSize();

    const download = async () => {
        // const { PWA, PWA_STATUS} : any = window
        // const agent = navigator.userAgent.toLowerCase();
        // const filter = [
        //     agent.indexOf("chrome") != -1,
        //     PWA_STATUS === true
        // ]
        // const err_index = filter.indexOf(false)
   
            
        // if (err_index === -1) {
        //     PWA.prompt();
        //     await PWA.userChoice;
        //     // console.log(outcome)
        // }else{
        //     const err_res = {
        //         0: t("landing:section_1_error_msg_1"),
        //         1: t("landing:section_1_error_msg_2")
        //     }

        //     alert(err_res[err_index])
        // }
        alert('scheduled to open')
    }
    return (
        <Section $isMobile={isMobile}>
            <div className="inner">
                <LandingSectionImageWrap>
                    <img src={SECTION01} alt="section1" />
                </LandingSectionImageWrap>
                <div>
                    <LandingSectionTitle>{t("landing:section_1_title")}</LandingSectionTitle>
                    <LandingSectionContents>{t("landing:section_1_contents")}</LandingSectionContents>
                    <LandingSectionButtonWrap>
                        <ContainedButton onClick={download}>{t("landing:app_download")}</ContainedButton>
                    </LandingSectionButtonWrap>
                </div>
            </div>
        </Section>
    );
};

export default Section01;

const Section = styled(Wrap)`
    background: #ffffff;
`;
