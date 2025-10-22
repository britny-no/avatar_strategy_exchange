import React, {useEffect, useCallback} from 'react';
import { NavLink } from 'react-router-dom';
import {
    List,
    ListItem,
    ListItemText,
    Collapse,
    IconButton
  } from '@mui/material';
  import { ExpandLess, ExpandMore } from '@mui/icons-material';
  import { makeStyles, createStyles } from '@mui/styles';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";


import { deleteTr, resetTr } from '@/states/reducers/stateReducer';
import socketService from '@/states/socketAgent/SocketService';
import { useTypedSelector } from '@/states/useTypedSelector';
import { logout } from '@/states/reducers/userReducer';

import Close from '../svgs/Close';
import useUsersData from '@/hooks/useUserData';
import { ContainedButton, RegisterWrap } from './Navigation';
import useScreenSize from '@/hooks/useScreenSize';
import LogoutButton from '../common/LogoutButton';
import i18n from "@/locales";

const LANGUAGE_OB = {
    "en-US" : "English",
    "ko-KR" : "Korean",
    "jp-JP" : "日本語",
    "ch-CH-1": "简体\n中文",
    "ch-CH-2" :"繁體\n中文",
    "vt-VT": "Tiếng\nViệt"
}

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            minHeight: '100vh',
            backgroundColor: '#2F4C68',
            padding: '16px',
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'flex-start',
            justifyContent: 'space-between',
            height: '90%',
        },
        navigation: {},
        nested: {
            marginLeft: '15px',
            border: 'none',
            backgroundColor: 'transparent'
        },
        listItem: {
            width: '100%',
            padding: '16px',
            border: 'none',
            borderBottom: '1px solid #203C57',
            backgroundColor: '#2F4C68'
        },
        listItemText: {
            '& > span': {
                color: '#fff',
                fontSize: '15px',
                lineHeight: '17px',
            },
        },
        listItemTextIn: {
            '& > span': {
                color: '#F49405',
                fontSize: '15px',
                lineHeight: '17px',
            },
        },
    }),
);

interface IProps {
    onClose: () => void;
}
const MobileNavigation = ({ onClose }: IProps) => {
    const { t } = useTranslation()
    const dispatch = useDispatch();
    const classes = useStyles();
    const { isMobile } = useScreenSize();

    const szAccNo = useTypedSelector((state) => state.userReducer.data.szAccNo);
    const  email = useTypedSelector((state) => state.userReducer.data.email);
    const loout = useTypedSelector((state) => state.stateReducer.loout);

    const [loading, setLoading] = React.useState(false);
    const [openWallet, setOpenWallet] = React.useState(false);
    const [openEvent, setOpenEvent] = React.useState(false);
    const [openTrade, setOpenTrade] = React.useState(false);
    const [openSupport, setOpenSupport] = React.useState(false);
    const [openMetaverse, setOpenMetaverse] = React.useState(false);
    const [openLanguage, setOpenLanguage] = React.useState(false);
    const [language, setLanguage] = React.useState(localStorage.getItem("lang") || "en-US");
    const { isLoggedIn } = useUsersData();

    const toggleLocales = useCallback(
        (locale: string) => {
          i18n.changeLanguage(locale);
        },
        [i18n]
      );

    useEffect(() => {
        return () => {
            // dispatch(deleteTr({ key: `loout`, data: [] }))
        }
    }, [])
    


    useEffect(() => {
        console.log('!!!')
        toggleLocales(language)
        localStorage.setItem("lang", language)
    }, [language])

    useEffect(() => {
        if (loout) {
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
                    setLoading(false);
                    break;
                default:
                    alert(data);
            }
        }
    }, [loout, loading]);

    const handleClickWallet = () => {
        setOpenWallet((state) => !state);
    };

    const handleClickEvent = () => {
        setOpenEvent((state) => !state);
    };

    const handleClickTrade = () => {
        setOpenTrade((state) => !state);
    };

    const handleClickSupport = () => {
        setOpenSupport((state) => !state);
    };

    const handleClickMetaverse = () => {
        setOpenMetaverse((state) => !state);
    };

    const handleClickLang = () => {
        setOpenLanguage((state) => !state);
    }

    const langHandleClose = (e, lang) => {
        setLanguage(lang);
        handleClickLang();
    }

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

    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            }
            className={classes.root}
        >
            <div className={classes.container}>
                <div className={classes.navigation}>
                    <ListItem component="button" className={classes.listItem}>
                        <NavLink to="/trade">
                            <ListItemText className={classes.listItemText} primary= {t("header:futures_trade")}/>
                        </NavLink>
                    </ListItem>
                    <ListItem component="button" onClick={handleClickWallet} className={classes.listItem}>
                        <ListItemText
                            className={openWallet ? classes.listItemTextIn : classes.listItemText}
                            primary= {t("header:wallet")}
                        />

                        {openWallet ? <ExpandLess fill={'#fff'} /> : <ExpandMore fill={'#fff'} />}
                    </ListItem>
                    <Collapse in={openWallet} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem component="button" className={classes.nested}>
                                <NavLink to={wallet_loaction.location_1.pathname} state={wallet_loaction.location_1.state} onClick={onClose}>
                                    <ListItemText className={classes.listItemText} primary= {t("header:my_asset")} />
                                </NavLink>
                            </ListItem>
                            <ListItem component="button" className={classes.nested}>
                                <NavLink to={wallet_loaction.location_2.pathname} state={wallet_loaction.location_2.state} onClick={onClose}>
                                    <ListItemText className={classes.listItemText} primary= {t("header:history")} />
                                </NavLink>
                            </ListItem>
                            <ListItem component="button" className={classes.nested}>
                                <NavLink to={wallet_loaction.location_3.pathname} state={wallet_loaction.location_3.state} onClick={onClose}>
                                    <ListItemText className={classes.listItemText} primary= {t("header:convert")} />
                                </NavLink>
                            </ListItem>
                            <ListItem component="button" className={classes.nested}>
                                <NavLink to={wallet_loaction.location_5.pathname} state={wallet_loaction.location_5.state} onClick={onClose}>
                                    <ListItemText className={classes.listItemText} primary= {t("header:deposit")} />
                                </NavLink>
                            </ListItem>
                        </List>
                    </Collapse>

                    <ListItem component="button" onClick={handleClickTrade} className={classes.listItem}>
                        <ListItemText
                            className={openSupport ? classes.listItemTextIn : classes.listItemText}
                            primary= {t("header:trade_history")}
                        />

                        {openTrade ? <ExpandLess fill={'#fff'} /> : <ExpandMore fill={'#fff'} />}
                    </ListItem>

                    <Collapse in={openTrade} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem component="button" className={classes.nested}>
                                <NavLink to={trade_loaction.location_1.pathname} state={trade_loaction.location_1.state} onClick={onClose}>
                                    <ListItemText className={classes.listItemText} primary={t("header:execution_list")} />
                                </NavLink>
                            </ListItem>
                            <ListItem component="button" className={classes.nested}>
                                <NavLink to={trade_loaction.location_2.pathname} state={trade_loaction.location_2.state} onClick={onClose}>
                                    <ListItemText className={classes.listItemText} primary={t("header:order_execution_detail")} />
                                </NavLink>
                            </ListItem>
                            <ListItem component="button" className={classes.nested}>
                                <NavLink to={trade_loaction.location_3.pathname} state={trade_loaction.location_3.state} onClick={onClose}>
                                    <ListItemText className={classes.listItemText} primary={t("header:close_execution_list")} />
                                </NavLink>
                            </ListItem>
                        </List>
                    </Collapse>

                    <ListItem component="button" onClick={handleClickSupport} className={classes.listItem}>
                        <ListItemText
                            className={openSupport ? classes.listItemTextIn : classes.listItemText}
                            primary={t("header:support_exchange")}
                        />

                        {openSupport ? <ExpandLess fill={'#fff'} /> : <ExpandMore fill={'#fff'} />}
                    </ListItem>
                    <Collapse in={openSupport} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                        <ListItem component="button" className={classes.nested} onClick={onClose}>
                                <NavLink to="/guide/deposit">
                                    <ListItemText className={classes.listItemText} primary={t("header:mo_deposit")} />
                                </NavLink>
                            </ListItem>
                            <ListItem component="button" className={classes.nested} onClick={onClose}>
                                <NavLink to="/guide/withdraw">
                                    <ListItemText className={classes.listItemText} primary={t("header:mo_withdraw")} />
                                </NavLink>
                            </ListItem>
                            <ListItem component="button" className={classes.nested} onClick={onClose}>
                                <NavLink to="/guide/submit">
                                    <ListItemText className={classes.listItemText} primary={t("header:mo_submit_request")} />
                                </NavLink>
                            </ListItem>
                            <ListItem component="button" className={classes.nested} onClick={onClose}>
                                <NavLink to="/guide">
                                    <ListItemText className={classes.listItemText} primary={t("header:mo_user_guide")} />
                                </NavLink>
                            </ListItem>
                        </List>
                    </Collapse>


                    <ListItem component="button" onClick={handleClickMetaverse} className={classes.listItem}>
                        <ListItemText
                            className={openMetaverse ? classes.listItemTextIn : classes.listItemText}
                            primary={t("header:metaverse_trader")}
                        />

                        {openMetaverse ? <ExpandLess fill={'#fff'} /> : <ExpandMore fill={'#fff'} />}
                    </ListItem>
                    <Collapse in={openMetaverse} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                        <ListItem component="button" className={classes.nested} onClick={onClose}>
                                <NavLink to="/metaverse/avatar-trader">
                                    <ListItemText className={classes.listItemText} primary={t("header:mo_avatar_traders")}/>
                                </NavLink>
                            </ListItem>
                            <ListItem component="button" className={classes.nested} onClick={onClose}>
                                <NavLink to="/metaverse/my-avatars">
                                    <ListItemText className={classes.listItemText} primary={t("header:mo_my_avatars")} />
                                </NavLink>
                            </ListItem>
                            <ListItem component="button" className={classes.nested} onClick={onClose}>
                                <NavLink to="/metaverse/avatars-detail">
                                    <ListItemText className={classes.listItemText} primary={t("header:mo_avatars_detail")} />
                                </NavLink>
                            </ListItem>
                            <ListItem component="button" className={classes.nested} onClick={onClose}>
                                <NavLink to="/metaverse/leaders-avatars">
                                    <ListItemText className={classes.listItemText} primary={t("header:mo_leaders_avatars")} />
                                </NavLink>
                            </ListItem>
                        </List>
                    </Collapse>

                    <ListItem component="button" onClick={handleClickLang} className={classes.listItem}>
                        <ListItemText
                            className={openLanguage ? classes.listItemTextIn : classes.listItemText}
                            primary={LANGUAGE_OB[language]}
                        />

                        {openLanguage ? <ExpandLess fill={'#fff'} /> : <ExpandMore fill={'#fff'} />}
                    </ListItem>
                    <Collapse in={openLanguage} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                                <ListItem component="button" className={classes.nested} onClick={(e) => {langHandleClose(e, "en-US")}}>
                                    <ListItemText className={classes.listItemText} primary={"English"}/>
                                </ListItem>
                                <ListItem component="button" className={classes.nested} onClick={(e) => {langHandleClose(e, "ko-KR")}}>
                                    <ListItemText className={classes.listItemText} primary={"Korean"}/>
                                </ListItem>
                                <ListItem component="button" className={classes.nested} onClick={(e) => {langHandleClose(e, "jp-JP")}}>
                                    <ListItemText className={classes.listItemText} primary={"日本語"}/>
                                </ListItem>
                                <ListItem component="button" className={classes.nested} onClick={(e) => {langHandleClose(e, "ch-CH-1")}}>
                                    <ListItemText className={classes.listItemText} primary={"简体中文"}/>
                                </ListItem>
                                <ListItem component="button" className={classes.nested} onClick={(e) => {langHandleClose(e, "ch-CH-2")}}>
                                    <ListItemText className={classes.listItemText} primary={"繁體中文"}/>
                                </ListItem>
                                <ListItem component="button" className={classes.nested} onClick={(e) => {langHandleClose(e, "vt-VT")}}>
                                    <ListItemText className={classes.listItemText} primary={"Tiếng Việt"}/>
                                </ListItem>
                            <ListItem component="button" className={classes.nested} onClick={onClose}>
                                <NavLink to="/metaverse/leaders-avatars">
                                    <ListItemText className={classes.listItemText} primary={t("header:mo_leaders_avatars")} />
                                </NavLink>
                            </ListItem>
                        </List>
                    </Collapse>
                </div>

                <RegisterWrap $isMobile={isMobile}>
                    {isLoggedIn ? (
                        // <Menu to="/mobile/signin" style={{ margin: 0 }}>
                        //     <LogoutButton onClick={handleSubmit} />
                        // </Menu>
                        <LogoutButton onClick={handleSubmit} />
                    ) : (
                        <>
                            <Menu 
                                to="/mobile/signin" 
                                // activeStyle={{ fontWeight: 'bold' }}
                            >
                            {t("header:login")}
                            </Menu>
                            <Menu to="/mobile/signup" style={{ margin: 0 }}>
                                <ContainedButton $isMobile={isMobile} variant="contained">
                                {t("header:register")}
                                </ContainedButton>
                            </Menu>
                        </>
                    )}
                </RegisterWrap>
            </div>
        </List>
    );
};

export default MobileNavigation;

const Menu = styled(NavLink)`
    width: 100%;
    font-size: 16px;
    line-height: 20px;
    color: #ffffff;
    text-decoration: none;
`;
