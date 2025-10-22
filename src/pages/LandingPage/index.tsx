
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import Layout from '@/components/layout'; // 절대 경로 사용
import Hero from './Hero';
import Reviews from './Reviews';
import Guides from './Guides';
import Section01 from './Section01';
import Section02 from './Section02';
import Section03 from './Section03';
import Section04 from './Section04';
import ContainedButton from './ContainedButton';
import useScreenSize from '@/hooks/useScreenSize';

const Index = () => {
    return (
        <Layout>
            <Landing>
                <Hero />
            </Landing>
        </Layout>
    );
};

const BottomComponent = () => {
    const navigate = useNavigate();
    const { isMobile } = useScreenSize();
    const { t } = useTranslation()

    return (
        <StartNow $isMobile={isMobile}>
            <p className="title">{t("landing:start_trading_now")}</p>
            <ContainedButton onClick={() => navigate('/mobile/signup')}>{t("landing:join_now")}</ContainedButton>
        </StartNow>
    )
}

export default Index;

const Landing = styled.div`
    position: relative;
`;

const StartNow = styled.div<{ $isMobile: boolean }>`
    width: 100%;
    height: 364px;
    padding: 103px 0;
    text-align: center;
    background: #f3f6f8;

    & > .title {
        margin-bottom: 50px;
        font-weight: bold;
        font-size: 40px;
        line-height: 46px;
        color: #000743;
    }
    ${({ $isMobile }) =>
        $isMobile &&
        css`
            height: 209px;
            padding: 60px 0;
            .title {
                margin-bottom: 36px;
                font-size: 18px;
                line-height: 21px;
            }
        `}
`;
