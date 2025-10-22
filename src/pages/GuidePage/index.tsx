import React from 'react';
import styled, { css } from 'styled-components';
import { useLocation, useParams,  } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from '@/components/layout';
import SideBar from './SideBar';
import UserGuides from './UserGuides';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Detail from './Detail';
import useScreenSize from '@/hooks/useScreenSize';

import SubmitRequest from './SubmitRequest';

const index = () => {
    const {t} = useTranslation()
    const { isMobile } = useScreenSize();
    // const { url } = useRouteMatch();
    const { subpage } = useParams<{ subpage: string }>();
    const { pathname } = useLocation();

    // const isDetailPage = pathname !== url;
    const title = t("helpCenter:help_center")
    const routes = [
        {
            to: '/guide/deposit',
            path: '/guide/deposit:shortcut/:id',
            exact: false,
            menu: t("helpCenter:deposit")
        },
        {
            to: '/guide/withdraw',
            path: '/guide/withdraw',
            exact: false,
            menu: t("helpCenter:withdraw")
        },
        {
            to: '/guide/submit',
            path: '/guide/submit/',
            exact: false,
            menu: t("helpCenter:submit_request")
        },
        {
            to: '/guide/user-guide',
            path: '/guide/user-guide/',
            exact: false,
            menu: t("helpCenter:user_guides")
        },
    ];


    const renderContents = () => {
        // console.log(subpage)
        switch (pathname) {
            case '/guide/deposit':
                return <Deposit />;
            case '/guide/withdraw':
                return <Withdraw />;
            case '/guide/user-guide':
                return <UserGuides />;
            case '/guide/submit':
                return <SubmitRequest />;
            default:
                return <h1>404</h1>;
        }
    };


    return (
      <div style={{background: "#fffffF", width: '100%', height: '100%',}}>
          <Layout headerType="relative" theme="light">
              <Container $isMobile={isMobile}>
                  {!isMobile && <SideBar  routes={routes} title={title}/> }
                  {/* <SideBar /> */}

                  <div className="contents" style={{width: '100%'}}>
                      {/* {isDetailPage ? (
                        <Switch>
                            <Route path={`${url}/:shortcut/:id`}>
                                <Detail />
                            </Route>
                        </Switch>
                      ) : (
                        renderContents()
                      )} */}
                      {
                        renderContents()
                      }
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
        // flex-flow: wrap;
    `}
    
`;
