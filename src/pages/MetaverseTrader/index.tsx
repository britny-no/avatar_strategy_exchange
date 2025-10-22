import styled, { css } from 'styled-components';
import { Route, useLocation, useParams } from 'react-router-dom';

import Layout from '@/components/layout';
import SideBar from '../GuidePage/SideBar';
// import UserGuides from './UserGuides';
import AvatarTraders from './AvatarTraders';
import MyAvatars from './MyAvatars';
import AvatarsDetail from './AvatarsDetail';
import Detail from '../GuidePage/Detail';
import LeadersAvatars from './LeadersAvatars';
import useScreenSize from '@/hooks/useScreenSize';
import { useTranslation } from 'react-i18next';

// import SubmitRequest from './SubmitRequest';

const index = () => {
    const {t} = useTranslation()
    const { isMobile } = useScreenSize();
    const { subpage } = useParams<{ subpage: string }>();
    const { pathname } = useLocation();
    // const isDetailPage = pathname !== url;

    const title = t("metaverseTrader:metaverse_trader")
    const routes = [
        {
            to: '/metaverse/avatar-trader',
            path: '/metaverse/avatar-trader',
            exact: false,
            menu: t("metaverseTrader:avatar_traders")
        },
        {
            to: '/metaverse/my-avatars',
            path: '/metaverse/my-avatars',
            exact: false,
            menu: t("metaverseTrader:my_avatars")
        },
        {
            to: '/metaverse/avatars-detail',
            path: '/metaverse/avatars-detail',
            exact: false,
            menu: t("metaverseTrader:avatars_detail")
        },
        {
            to: '/metaverse/leaders-avatars',
            path: '/metaverse/leaders-avatars',
            exact: false,
            menu: t("metaverseTrader:leader_avatars")
        },
    ];

    const renderContents = () => {
        switch (pathname) {
            case '/metaverse/avatar-trader':
                return <AvatarTraders />;
            case '/metaverse/my-avatars':
                return <MyAvatars />;
            case '/metaverse/avatars-detail':
                return <AvatarsDetail />;
            case '/metaverse/leaders-avatars':
                return <LeadersAvatars />;
            default:
                return <h1>404</h1>;
        }
        return null
    };


    return (
      <div style={{background: "#fffffF", width: '100%', height: '100%',}}>
          <Layout headerType="relative" theme="light">
              <Container $isMobile={isMobile}>
                {!isMobile && <SideBar  routes={routes} title={title}/> }
                  <div className="contents" style={{width: '100%'}}>
                    {/* {<Detail />} */}
                    {renderContents()}
                  </div>
              </Container>
          </Layout>
      </div>

    );
};

export default index;

const Container = styled.div<{$isMobile: boolean}>`
    display: flex;
    justify-content: space-between;
    max-width: 1400px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 116px 0;
    ${({$isMobile}) => $isMobile && css`
        padding: 32px 16px;
    `}
    
`;
