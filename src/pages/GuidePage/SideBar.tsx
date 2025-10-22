import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SideBar = ({routes, title}) => {
    const {pathname} = useLocation()

    return (
        <SidebarWrap className="side-bar">
                <div style={{ display: 'flex' }}>
                    <div
                        style={{
                            padding: '10px 0 ',
                            width: '100%',

                        }}
                    >
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                          <li>
                            <Title>{title}</Title>
                          </li>
                            {routes.map(({ to, exact, menu }) => {
                                const fontStyle = {
                                    display: 'block',
                                    fontWeight: 'bold' as const,
                                    background: '#FDECD4',
                                    borderRadius: '2px',
                                    padding: '6px 12px'
                                };
                                return (
                                    <li key={to}>
                                        <Menu to={to} style={pathname === to ? fontStyle: {}}>
                                            {menu}
                                        </Menu>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
        </SidebarWrap>
    );
};

export default SideBar;

const SidebarWrap = styled.div`
    width: 200px;
    background: #ffffff;
    height: 100%;
    margin-right: 120px;
    li {
        padding: 10px 0;
    }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 15px;
  line-height: 20px;

  color: #383838;
`

const Menu = styled(NavLink)`
  font-size: 14px;
  line-height: 19px;
  /* identical to box height */


  color: #7E7E7E;
`
