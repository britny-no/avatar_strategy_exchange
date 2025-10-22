import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Box, TextField } from '@mui/material';

import { ENGLISH, KOREAN } from '@/constants/Language';
import useSignIn from '@/hooks/useSignIn';
import useCurrentLanguage from '@/hooks/useCurrentLanguage';
import PageNameList from '@/constants/PageNameLIst';
import CustomInput, { TypeEnum } from '@/components/common/CustomInput';
import Layout from '@/components/layout';
import useScreenSize from '@/hooks/useScreenSize';
import { useNavigate } from 'react-router-dom';

const landingPageText = (language) => {
    switch (language) {
        case ENGLISH:
            return 'Trustworthy Trading Platform';
        case KOREAN:
            return '믿을수 있는 가상화폐 거래소';
        default:
            return '믿을수 있는 가상화폐 거래소';
    }
};
const signUpText = (language) => {
    switch (language) {
        case ENGLISH:
            return 'Register';
        case KOREAN:
            return '회원가입';
        default:
            return '회원가입';
    }
};
const signInText = (language) => {
    switch (language) {
        case ENGLISH:
            return 'Login';
        case KOREAN:
            return '로그인';
        default:
            return '로그인';
    }
};
const emailText = (language) => {
    switch (language) {
        case ENGLISH:
            return 'Email';
        case KOREAN:
            return '이메일 주소';
        default:
            return '이메일 주소';
    }
};

const passwordText = (language) => {
    switch (language) {
        case ENGLISH:
            return 'Password';
        case KOREAN:
            return '비밀번호';
        default:
            return '비밀번호';
    }
};
const otpTokenText = (language) => {
    switch (language) {
        case ENGLISH:
            return 'OTP Token';
        case KOREAN:
            return 'OTP 토큰';
        default:
            return 'OTP 토큰';
    }
};

const SignIn = () => {
    const navigate = useNavigate()
    const { isMobile } = useScreenSize();
    const { currentLanguage } = useCurrentLanguage();
    const [input, setInput] = useState({
        password: '',
        email: '',
        otp_token: '',
    });

    const { handleSignIn, handleDemoLogin, error, success, data } = useSignIn();

    useEffect(() => {
        if (success) {
            navigate(`${PageNameList.TRADE}`);
            localStorage.setItem('elpist', JSON.stringify({ isLoggedIn: true }));
        }
    }, [success]);

    const handleChange = (target) => (e) => {
        setInput({
            ...input,
            [target]: e.target.value,
        });
    };

    const handleSubmit = () => {
        handleSignIn({ ...input });
    };

    const handleRedirect = () => {
        navigate(`${PageNameList.MOBILE_SIGNUP}`);
    };

    const handleDemoSignInAndRedirect = () => {
        handleDemoLogin();
        navigate(`${PageNameList.TRADE}?debug=true`);
    };

    return (
        <Layout theme="light">
            <Wrapper  justifyContent="center" $isMobile={isMobile}>
                <Title $isMobile={isMobile}>Login</Title>
                <Container $isMobile={isMobile}>
                    <InputWrapper>
                        {error && <ErrorMsg>{error}</ErrorMsg>}
                        <div style={{ height: 4 }}></div>

                        <CustomInput
                            label={emailText(currentLanguage)}
                            onChange={handleChange('email')}
                            type={TypeEnum.Text}
                            color="black"
                        />
                        <div style={{ height: 4 }}></div>
                        <CustomInput
                            label={passwordText(currentLanguage)}
                            onChange={handleChange('password')}
                            type={TypeEnum.Password}
                            color="black"
                        />

                        <LoginButton onClick={handleSubmit}>{signInText(currentLanguage)}</LoginButton>
                        {/*<LoginButton onClick={handleDemoSignInAndRedirect}>{'강남 데모 로그인'}</LoginButton>*/}
                    </InputWrapper>
                </Container>
                <LoginButton onClick={handleRedirect}>{signUpText(currentLanguage)}</LoginButton>
            </Wrapper>
        </Layout>
    );
};

export default SignIn;

const Wrapper = styled(Box)<{ $isMobile : boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: #ffffff;
    ${({ $isMobile }) =>
    $isMobile  &&
        css`
            padding: 0 16px;
        `}
`;

const Container = styled.div<{ $isMobile : boolean }>`
    max-width: 1200px;
    width: 100%;
    height: auto;
    margin: 0 auto;
    padding: 20px 0;
    border: 1px solid #d0d0d0;
    box-sizing: border-box;
    border-radius: 4px;
    ${({ $isMobile  }) =>
    $isMobile  &&
        css`
            padding: 30px 16px;
        `}
`;

const Title = styled.div<{ $isMobile : boolean }>`
    font-weight: bold;
    font-size: 32px;
    line-height: 46px;
    text-align: center;

    color: #323232;
    margin-bottom: 40px;
    ${({ $isMobile  }) =>
    $isMobile  &&
        css`
            font-size: 18px;
            line-height: 26px;
            text-align: center;
        `}
`;

const InputWrapper = styled.div`
    max-width: 380px;
    width: 100%;
    margin: 0 auto;
`;

const LoginButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 380px;
    width: 100%;
    height: 48px;
    cursor: pointer;
    margin-top: 5px;
    background: linear-gradient(90.91deg, #f3ad4c 0%, #e69536 100%);
    border-radius: 4px;
    font-weight: bold;
    font-size: 15px;
    line-height: 22px;
    /* identical to box height */

    text-align: center;

    color: #ffffff;
`;

const ErrorMsg = styled.div`
    color: red;
`;
