import { useRef, useEffect, useState, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
// import Dropdown from 'react-dropdown';
import styled, { css } from 'styled-components';
import { useDispatch } from 'react-redux';
// import { withRouter } from 'react-router';
import {
    Button,
    ClickAwayListener,
    Grow,
    IconButton,
    MenuItem,
    MenuList,
    Paper,
    Popper,
} from '@mui/material';
import { useTranslation } from "react-i18next";


import socketService from '@/states/socketAgent/SocketService';
import { useTypedSelector } from '@/states/useTypedSelector';
import { logout } from '@/states/reducers/userReducer';
import { deleteTr, resetTr } from '@/states/reducers/stateReducer';

import useScreenSize from '@/hooks/useScreenSize';
import useUsersData from '@/hooks/useUserData';

import MobileNavigation from './MobileNavigation';
import LogoutButton from '../common/LogoutButton';

import MobileMenu from '../svgs/MobileMenu';
import User from '../svgs/User';
import CountDownTimer from './CountDownTimer';
import i18n from "@/locales";

interface IProps {
    theme?: 'dark' | 'light';
}

const LANGUAGE_OB = {
    "en-US" : "English",
    "ko-KR" : "Korean",
    "jp-JP" : "日本語",
    "ch-CH-1": "简体\n中文",
    "ch-CH-2" :"繁體\n中文",
    "vt-VT": "Tiếng\nViệt"
}

const Navigation = ({ theme }: IProps) => {
    const { t } = useTranslation()
    const dispatch = useDispatch();
    const szAccNo = useTypedSelector((state) => state.userReducer.data.szAccNo);
    const loout =  useTypedSelector((state) => state.stateReducer.loout);

    const [openMobileNav, setOpenMobileNav] = useState(false);
    const { isMobile } = useScreenSize();
    const location = useLocation();
    const { isLoggedIn, email } = useUsersData();

    const [loading, setLoading] = useState(false);
    const [openWallet, setOpenWallet] = useState(false);
    const [openEvent, setOpenEvent] = useState(false);
    const [openTrade, setOpenTrade] = useState(false);
    const [openSupport, setOpenSupport] = useState(false);
    const [openLang, setOpenLang] = useState(false);
    const [language, setLanguage] = useState(localStorage.getItem("lang") || "en-US");

    const walletAnchorRef = useRef<HTMLButtonElement>(null);
    const eventAnchorRef = useRef<HTMLButtonElement>(null);
    const tradeAnchorRef = useRef<HTMLButtonElement>(null);
    const supportAnchorRef = useRef<HTMLButtonElement>(null);
    const langAnchorRef = useRef<HTMLButtonElement>(null);
    const prevOpenWallet = useRef(openWallet);
    const prevOpenEvent = useRef(openEvent);
    const prevOpenTrade = useRef(openSupport);
    const prevOpenSupport = useRef(openSupport);

    const toggleLocales = useCallback(
        (locale: string) => {
          i18n.changeLanguage(locale);
        },
        [i18n]
      );


    useEffect(() => {
        toggleLocales(language)
        localStorage.setItem("lang", language)
    }, [language])

    useEffect(() => {
        return () => {
            dispatch(deleteTr({ key: `loout`, data: [] }))
        }
    }, [])

    useEffect(() => {
        if (loout) {
            console.log(loout)
            const { flag, data } = loout.Message;
            switch (flag) {
                case 'E':
                    alert(data);
                    // setLoading(false);
                    break;
                case '0':
                    dispatch(logout());
                    // reset시 order book도 사라짐?
                    // dispatch(resetTr());
                    // setLoading(false);
                    break;
                default:
                    alert(data);
            }
        }
    }, [loout, loading]);

    useEffect(() => {
        if (prevOpenWallet.current && !openEvent) {
            walletAnchorRef.current!.focus();
        }
        prevOpenWallet.current = openEvent;
    }, [openEvent]);

    useEffect(() => {
        if (prevOpenEvent.current && !openEvent) {
            eventAnchorRef.current!.focus();
        }

        prevOpenEvent.current = openEvent;
    }, [openEvent]);

    useEffect(() => {
        if (prevOpenSupport.current && !openSupport) {
            supportAnchorRef.current!.focus();
        }

        prevOpenSupport.current = openSupport;
    }, [openSupport]);

    useEffect(() => {
        if (prevOpenTrade.current && !openTrade) {
            tradeAnchorRef.current!.focus();
        }

        prevOpenSupport.current = openTrade;
    }, [openTrade]);

    useEffect(() => {
        if (prevOpenTrade.current && !openTrade) {
            langAnchorRef.current!.focus();
        }

        prevOpenSupport.current = openTrade;
    }, [openTrade]);

    const handleOpenWallet = () => {
        console.log('123')
        setOpenWallet((state) => !state);
    };

    const handleOpenEvent = () => {
        setOpenEvent((state) => !state);
    };

    const handleOpenTrade = () => {
        setOpenTrade((state) => !state);
    };
    const handleOpenSupport = () => {
        setOpenSupport((state) => !state);
    };

    const handleOpenLang = () => {
        setOpenLang((state) => !state);
    };

    const handleClose = (event:  MouseEvent | TouchEvent, type: 'event' | 'support' | 'wallet' | 'trade' | 'lang') => {
        switch (type) {
            case 'event':
                if (eventAnchorRef.current && eventAnchorRef.current.contains(event.target as HTMLElement)) {
                    return;
                }
                setOpenEvent(false);
                break;
            case 'support':
                if (supportAnchorRef.current && supportAnchorRef.current.contains(event.target as HTMLElement)) {
                    return;
                }

                setOpenSupport(false);
                break;
            case 'trade':
                if (tradeAnchorRef.current && tradeAnchorRef.current.contains(event.target as HTMLElement)) {
                    return;
                }

                setOpenTrade(false);
                break;
            case 'wallet':
                if (walletAnchorRef.current && walletAnchorRef.current.contains(event.target as HTMLElement)) {
                    return;
                }

                setOpenWallet(false);
                break;

            case 'lang':
                    if (langAnchorRef.current && langAnchorRef.current.contains(event.target as HTMLElement)) {
                        return;
                    }
    
                    setOpenLang(false);
                    break;
            default:
                break;
        }
    };

    const handleListKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenEvent(false);
        }
    };

    const handleOpenMobileNav = () => {
        setOpenMobileNav((state) => !state);
    };

    const walletHandleClose = (e) => handleClose(e, 'wallet');
    const tradeHandleClose = (e) => handleClose(e, 'trade');
    const langHandleClose = (e, lang) => {
        setLanguage(lang);
        handleClose(e, 'lang');
    }

    const wallet_loaction = {
        location_1: {
            pathname: '/wallet',
            state: { sub_path: '/asset', szAccNo: szAccNo },
        },
        location_2: {
            pathname: '/wallet',
            state: { sub_path: '/history', szAccNo: szAccNo },
        },
        location_3: {
            pathname: '/wallet',
            state: { sub_path: '/convert', szAccNo: szAccNo },
        },
        location_4: {
            pathname: '/wallet',
            state: { sub_path: '/transfer', szAccNo: szAccNo },
        },
        location_5: {
            pathname: '/wallet',
            state: { sub_path: '/deposit_withdraw', szAccNo: szAccNo },
        },
    };

    const trade_loaction = {
        location_1: {
            pathname: '/execution',
            state: { sub_path: '/list', szAccNo: szAccNo },
        },
        location_2: {
            pathname: '/execution',
            state: { sub_path: '/detail', szAccNo: szAccNo },
        },
        location_3: {
            pathname: '/execution',
            state: { sub_path: '/close', szAccNo: szAccNo },
        },
    };
    const handleSubmit = () => {
        const liveTrCodes = ['96', '95', '98'];
        liveTrCodes.map(v => {
            socketService.sendToAgent({
                Header: {
                    function: 'U', // 응답시 'F'
                    termtype: 'HTS',
                    trcode: v,
                },
                Input1: {
                    // 응답시 "Input" 없슴
                    Key1: szAccNo, // 계좌번호(key)
                },
            })
        })
        socketService.sendToAgent({
            Header: { function: 'D', termtype: 'HTS', trcode: 'loout' },
            Input1: { 
                szMemberNo: "000",
                szCustId: email,
                cUserLevel : "4",
                szIPAddress : "",
                cFlag : "1"
            },
        })
        setLoading(true);
    };

    

    return (
        <StyledNavigation $isMobile={isMobile}>
            {isMobile ? (
                <>
                    <IconButton onClick={handleOpenMobileNav}>
                        <MobileMenu fill={theme === 'light' ? '#404040' : '#FFFFFF'} />
                    </IconButton>
                    {openMobileNav && <MobileNavigation onClose={handleOpenMobileNav} />}
                </>
            ) : (
                <Inner>
                    <NavigationWrap>
                        <Menu to="/trade" theme={theme}>
                            {t("header:futures_trade")}
                        </Menu>
                        <div>
                            <MultiMenu
                                ref={walletAnchorRef}
                                aria-controls={openWallet ? 'menu-list-grow' : undefined}
                                aria-haspopup="true"
                                onClick={handleOpenWallet}
                            >
                                <MenuNotLink theme={theme}>
                                {t("header:wallet")} ▾
                                </MenuNotLink>
                            </MultiMenu>
                            <Popper
                                open={openWallet}
                                anchorEl={walletAnchorRef.current}
                                role={undefined}
                                transition
                                disablePortal
                            >
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{
                                            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                        }}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={walletHandleClose}>
                                                <SubMenuWrap
                                                    autoFocusItem={openWallet}
                                                    id="menu-list-grow"
                                                    onKeyDown={handleListKeyDown}
                                                >
                                                    <MenuItem onClick={walletHandleClose}>
                                                        <Menu
                                                            to={wallet_loaction.location_1}
                                                            state={wallet_loaction.location_1.state}
                                                            style={{ fontWeight: 'bold' }}
                                                        >
                                                            {t("header:my_asset")}
                                                        </Menu>
                                                    </MenuItem>
                                                    <MenuItem onClick={walletHandleClose}>
                                                        <Menu
                                                            to={wallet_loaction.location_2}
                                                            state={wallet_loaction.location_2.state}
                                                            style={{ fontWeight: 'bold' }}
                                                        >
                                                            {t("header:history")}
                                                        </Menu>
                                                    </MenuItem>
                                                    <MenuItem onClick={walletHandleClose}>
                                                        <Menu
                                                            to={wallet_loaction.location_3}
                                                            state={wallet_loaction.location_3.state}
                                                            style={{ fontWeight: 'bold' }}
                                                        >
                                                            {t("header:convert")}
                                                        </Menu>
                                                    </MenuItem>
                                                    <MenuItem onClick={walletHandleClose}>
                                                        <Menu
                                                            to={wallet_loaction.location_5}
                                                            state={wallet_loaction.location_5.state}
                                                            style={{ fontWeight: 'bold' }}
                                                        >
                                                            {t("header:deposit")}
                                                        </Menu>
                                                    </MenuItem>
                                                </SubMenuWrap>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </div>
                        <div>
                            <MultiMenu
                                ref={tradeAnchorRef}
                                aria-controls={openTrade ? 'menu-list-grow' : undefined}
                                aria-haspopup="true"
                                onClick={handleOpenTrade}
                            >
                                <MenuNotLink theme={theme}>
                                {t("header:trade_history")} ▾
                                </MenuNotLink>
                            </MultiMenu>
                            <Popper
                                open={openTrade}
                                anchorEl={tradeAnchorRef.current}
                                role={undefined}
                                transition
                                disablePortal
                            >
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{
                                            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                        }}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={(e) => handleClose(e, 'trade')}>
                                                <SubMenuWrap
                                                    autoFocusItem={openEvent}
                                                    id="menu-list-grow"
                                                    onKeyDown={handleListKeyDown}
                                                >
                                                    <MenuItem onClick={tradeHandleClose}>
                                                        <Menu
                                                            to={trade_loaction.location_1.pathname}
                                                            state={trade_loaction.location_1.state}
                                                            style={{ fontWeight: 'bold' }}
                                                        >
                                                           {t("header:execution_list")}
                                                        </Menu>
                                                    </MenuItem>
                                                    <MenuItem onClick={tradeHandleClose}>
                                                        <Menu
                                                            to={trade_loaction.location_2.pathname}
                                                            state={trade_loaction.location_2.state}
                                                            style={{ fontWeight: 'bold' }}
                                                        >
                                                            {t("header:order_execution_detail")}
                                                        </Menu>
                                                    </MenuItem>
                                                    <MenuItem onClick={tradeHandleClose}>
                                                        <Menu
                                                           to={trade_loaction.location_3.pathname}
                                                           state={trade_loaction.location_3.state}
                                                            style={{ fontWeight: 'bold' }}
                                                        >
                                                            {t("header:close_execution_list")}
                                                        </Menu>
                                                    </MenuItem>
                                                </SubMenuWrap>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </div>

                        <div>
                            <Menu to="/metaverse/avatar-trader" theme={theme}>
                            {t("header:metaverse_trader")}
                            </Menu>
                            <Menu to="/guide/deposit" theme={theme}>
                            {t("header:support_exchange")}
                            </Menu>
                        </div>
                    </NavigationWrap>

                    <RegisterWrap $isMobile={isMobile}>
                        <div>
                            <MultiMenu
                                ref={langAnchorRef}
                                aria-controls={openLang ? 'menu-list-grow' : undefined}
                                aria-haspopup="true"
                                onClick={handleOpenLang}
                            >
                                <span style={{"color": theme === 'light' ?  "#000000" :  "#ffffff"}} >
                                {LANGUAGE_OB[language]}
                                </span>                            
                            </MultiMenu>
                            <Popper
                                open={openLang}
                                anchorEl={langAnchorRef.current}
                                role={undefined}
                                transition
                                disablePortal
                            >
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{
                                            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                        }}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={(e) => handleClose(e, 'lang')}>
                                                <SubMenuWrap
                                                    autoFocusItem={openEvent}
                                                    id="menu-list-grow"
                                                    onKeyDown={handleListKeyDown}
                                                >
                                                    <MenuItem onClick={(e) => {langHandleClose(e, "en-US")}}>
                                                       <LangSpan>English</LangSpan>
                                                    </MenuItem>
                                                    <MenuItem onClick={(e) => {langHandleClose(e, "ko-KR")}}>
                                                        <LangSpan>Korean</LangSpan>
                                                    </MenuItem>
                                                    <MenuItem onClick={(e) => {langHandleClose(e, "jp-JP")}}>
                                                        <LangSpan>日本語</LangSpan>
                                                    </MenuItem>
                                                    <MenuItem onClick={(e) => {langHandleClose(e, "ch-CH-1")}}>
                                                        <LangSpan>简体中文</LangSpan>
                                                    </MenuItem>
                                                    <MenuItem onClick={(e) => {langHandleClose(e, "ch-CH-2")}}>
                                                        <LangSpan>繁體中文</LangSpan>
                                                    </MenuItem>
                                                    <MenuItem onClick={(e) => {langHandleClose(e, "vt-VT")}}>
                                                        <LangSpan>Tiếng Việt</LangSpan>
                                                    </MenuItem>
                                                </SubMenuWrap>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </div>
                        {isLoggedIn ? (
                            <div className="login-user">
                                <CountDownTimer theme={theme} />
                                <User fill={theme === 'light' ? '#404040' : '#FFFFFF'} />
                                <p style={{ color: theme === 'light' ? '#404040' : '#FFFFFF', marginRight:"4px" }}>{email}</p>
                                <LogoutButton theme={theme} onClick={handleSubmit} />
                            </div>
                        ) : (
                            <>
                                <LoginMenu to="/mobile/signin" theme={theme}>
                                    <span>
                                        {t("header:login")}
                                    </span>
                                </LoginMenu>
                                <SignMenu to="/mobile/signup" style={{ margin: 0 }} theme={theme}>
                                    <ContainedButton $isMobile={isMobile} variant="contained">
                                    {t("header:register")}
                                    </ContainedButton>
                                </SignMenu>
                            </>
                        )}
                    </RegisterWrap>
                </Inner>
            )}
        </StyledNavigation>
    );
};

export default Navigation

const StyledNavigation = styled.div<{ $isMobile: boolean }>`
    width: 100%;
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            display: flex;
            justify-content: flex-end;
            align-items: center;
        `}
`;
const Inner = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

export const RegisterWrap = styled.div<{ $isMobile: boolean }>`
    display: flex;
    width:35%;
    flex-wrap: nowrap;
    .login-user {
        display: flex;
        align-items: center;
        > svg {
            margin-right: 5px;
        }
        .count-down-timer {
            display: flex;
            margin-right: 10px;
            cursor: pointer;
            .login-timer {
                display: inline-block;
                width: 36px;
                font-size: 14px;
                line-height: 19px;
                color: #ffffff;
                margin: 0 5px 0 5px;
            }
            .refresh-icon {
                display: inline-block;
                vertical-align: middle;
                width: 13px;
                margin: 5px 0;
                > g {
                    fill: #fff;
                }
            }
        }
    }
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-end;
            width: 100%;
            height: 100px;
            text-align: center;
        `}
`;

const Menu = styled(NavLink)<{ theme?: 'dark' | 'light' }>`
    width: auto;
    margin-left: 10px !important;
    margin-right: 28px;
    font-size: 16px;
    line-height: 20px;
    color: #ffffff;
    text-decoration: none;
    white-space: break-spaces;
    ${({ theme }) =>
        theme === 'light' &&
        css`
            color: #000000;
        `}
`;


const MenuNotLink = styled.div<{ theme?: 'dark' | 'light' }>`
    width: auto;
    margin-left: 10px !important;
    margin-right: 28px;
    font-size: 16px;
    line-height: 20px;
    color: #ffffff;
    text-decoration: none;
    white-space: break-spaces;
    ${({ theme }) =>
        theme === 'light' &&
        css`
            color: #000000;
        `}
`;


const NavigationWrap = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    max-width: 900px;
    width: 100%;
`;

const MultiMenu = styled(Button)`
    height: 100%;
    margin-right: 20px;
    text-transform: none !important;
    white-space: break-spaces;
    span {
        font-size: 16px;
        line-height: 20px;
        color: #ffffff;
    }
`;
export const SubMenuWrap = styled(MenuList)`
    width: 200px;
    height: auto;
    background-color: #2f4c68;
    overflow: hidden;
    padding: 10px;
`;
export const ContainedButton = styled(Button)<{ $isMobile: boolean }>`
    width: 120px;
    height: 32px;
    background: #ffab2e !important;
    border-radius: 4px;
    padding: 6px 10px;
    text-transform: unset !important;
    & > span {
        font-weight: bold;
        font-size: 16px;
        line-height: 20px;
        text-align: center;
        color: #ffffff;
    }
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            width: 100%;
            height: 48px;
        `}
`;

const LangSpan = styled.span`
    margin: 0;
    font-size: 1rem
`;

const LoginMenu = styled(NavLink)<{ theme?: 'dark' | 'light' }>`
    width: 50px;
    margin-left: 10px;
    margin-right: 10px;
    font-size: 16px;
    line-height: 48px;
    color: #ffffff;
    text-decoration: none;
    white-space: break-spaces;
    ${({ theme }) =>
        theme === 'light' &&
        css`
            color: #000000;
        `}
`;

const SignMenu = styled(NavLink)<{ theme?: 'dark' | 'light' }>`
    width: auto;
    margin-right: 30px;
    font-size: 16px;
    line-height: 48px;
    color: #ffffff;
    text-decoration: none;
    white-space: break-spaces;
    ${({ theme }) =>
        theme === 'light' &&
        css`
            color: #000000;
        `}
`;