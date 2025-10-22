import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Box, TextField } from '@mui/material';

import { ENGLISH, KOREAN } from '@/constants/Language';
import useCurrentLanguage from '@/hooks/useCurrentLanguage';
import useScreenSize from '@/hooks/useScreenSize';
import CustomInput, { TypeEnum } from '@/components/common/CustomInput';
import Layout from '@/components/layout';
import { useTypedSelector } from '@/states/useTypedSelector';
import socketService from '@/states/socketAgent/SocketService';
import { useNavigate } from 'react-router-dom';



const signUpText = (language) => {
    switch (language) {
        case ENGLISH:
            return 'Request';
        case KOREAN:
            return '회원가입';
        default:
            return '회원가입';
    }
};

const signInText = (language) => {
    switch (language) {
        case ENGLISH:
            return 'Sign In';
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
            return '이메일';
        default:
            return '이메일';
    }
};

const familyNameText = (language) => {
    switch (language) {
        case ENGLISH:
            return 'Nick Name';
        case KOREAN:
            return '닉네임';
        default:
            return 'Nick Name';
    }
};

const inviteCodeText = (language) => {
    switch (language) {
        case ENGLISH:
            return 'Invite Code';
        case KOREAN:
            return '초대 코드';
        default:
            return 'Invite Code';
    }
};
const passwordText = (language) => {
    switch (language) {
        case ENGLISH:
            return 'Password';
        case KOREAN:
            return '패스워드';
        default:
            return 'Password';
    }
};

const checkPasswordText = (language) => {
    switch (language) {
        case ENGLISH:
            return 'Check password';
        case KOREAN:
            return '패스워드 확인';
        default:
            return 'Check password';
    }
};

const countryCodeText = (language) => {
    switch (language) {
        case ENGLISH:
            return 'Country code';
        case KOREAN:
            return '국가 번호';
        default:
            return 'Country code';
    }
};

const phoneNumberText = (language) => {
    switch (language) {
        case ENGLISH:
            return 'Phone number';
        case KOREAN:
            return '전화번호';
        default:
            return 'Phone number';
    }
};

const SignUp = () => {
    const navigate = useNavigate()
    const { isMobile } = useScreenSize();
    const t113B = useTypedSelector((state) => state.stateReducer.t113B);

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({
        error: "",
        success: false,
        data: ''
    });
    const [input, setInput] = useState({
        email: '',
        inviteCode: '',
        password: '',
        check_password: '',
        szFamilyName: '',
        szUserName: 'Farming@gmail.com',
        szNation_Name: '',
        szTelNo2: '',
    });

    const [isOpened, setIsOpened] = useState(false);

    const { currentLanguage } = useCurrentLanguage();

    const handleChange = (target) => (e) => {
        setInput({
            ...input,
            [target]: e.target.value,
        });
    };

    // const { handleSignUp } = useSignUp();

    // console.log('data sign', data);

    // const handleSubmit = () => {
    //     handleSignUp({ ...input });
    // };
    const handleSubmit = () => {
        const {
            email,
            password,
            check_password,
            szFamilyName,
            szUserName,
            szNation_Name,
            szTelNo2
        } = input

        socketService.sendToAgent({
            Header: { function: 'D', termtype: 'HTS', trcode: 't113B' },
            Input1: {
                szMemberNo: '000',
                szCustNo: email,
                szPasswd: password,
                szPasswd1: check_password,
                szFamilyName: szFamilyName,
                szUserName: szUserName,
                szNation_Name: szNation_Name,
                szTelNo2: szTelNo2,
            },
        });
        setLoading(true);
    }

    useEffect(() => {
        if (loading && t113B) {
            const { flag, data } = t113B.Message;
            switch (flag) {
                case 'E':
                    alert(data);
                    setLoading(false);
                    break;
                case '0':
                    alert(data);
                    // // 잔고 갱신
                    // setLoading(false);
                    navigate('/mobile/signin');
                    break;
                default:
                    alert(data);
            }
        }
    }, [t113B, loading]);


    // useEffect(() => {
    //     if (success) {
    //         setIsOpened(true);
    //         history.push('/mobile/signin');
    //     }
    // }, [success]);

    // console.log(`error i!! : `, error, ' success : ', success);
    if (loading) {
        return <div>Wait please...</div>;
    }

    const { data, error, success } = response

    return (
        <Layout theme="light">
            <Wrapper justifyContent="center" $isMobile={isMobile}>
                <Title $isMobile={isMobile}>Register</Title>
                <Container className="container" $isMobile={isMobile}>
                    <InputWrapper>
                        {/* {error && <ErrorMsg>{JSON.stringify(error)}</ErrorMsg>} */}
                        <div style={{ height: 4 }}></div>

                        <CustomInput
                            label={emailText(currentLanguage)}
                            onChange={handleChange('email')}
                            type={TypeEnum.Email}
                            color="black"
                        />

                        <div style={{ height: 4 }}></div>
                        <CustomInput
                            label={passwordText(currentLanguage)}
                            onChange={handleChange('password')}
                            type={TypeEnum.Password}
                            color="black"
                        />
                        <div style={{ height: 4 }}></div>
                        <CustomInput
                            label={checkPasswordText(currentLanguage)}
                            onChange={handleChange('check_password')}
                            type={TypeEnum.Password}
                            color="black"
                        />
                        <div style={{ height: 4 }}></div>
                        <CustomInput
                            label={familyNameText(currentLanguage)}
                            onChange={handleChange('szFamilyName')}
                            type={TypeEnum.Text}
                            color="black"
                        />

                        <div style={{ height: 4 }}></div>
                        {/* <CustomInput
                            label={inviteCodeText(currentLanguage)}
                            onChange={handleChange('szUserName')}
                            type={TypeEnum.Text}
                            color="black"
                        /> */}

                        <div style={{ height: 4 }}></div>
                        <CustomInput
                            label={countryCodeText(currentLanguage)}
                            onChange={handleChange('szNation_Name')}
                            allowLeadingZeros={true}
                            type={TypeEnum.Number}
                            color="black"
                        />
                        <div style={{ height: 4 }}></div>
                        <CustomInput
                            label={phoneNumberText(currentLanguage)}
                            onChange={handleChange('szTelNo2')}
                            allowLeadingZeros={true}
                            maxLength={11}
                            type={TypeEnum.Number}
                            color="black"
                        />
                        <div style={{ height: 4 }}></div>
                        <LoginButton onClick={handleSubmit}>{signUpText(currentLanguage)}</LoginButton>
                    </InputWrapper>
                </Container>

                {/* 팝업창 부분 */}
                {/* <Modal opened={isOpened} setOpened={setIsOpened} closeButtonVisible={true} positions={{ y: '25%' }}>
                    <QRCode data={data} setOpened={setIsOpened} />
                </Modal> */}
            </Wrapper>
        </Layout>
    );
};
export default SignUp;

const Wrapper = styled(Box) <{ $isMobile: boolean }>`
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    background-color: #ffffff;
    padding: 80px 0;
    ${({ $isMobile }) =>
        $isMobile &&
        css`
            padding: 0 16px;
        `}
`;
const Container = styled.div<{ $isMobile: boolean }>`
    max-width: 1200px;
    width: 100%;
    height: auto;
    margin: 0 auto;
    padding: 50px 0;
    border: 1px solid #d0d0d0;
    box-sizing: border-box;
    border-radius: 4px;
    ${({ $isMobile }) =>
        $isMobile &&
        css`
            padding: 30px 16px;
        `}
`;
const Title = styled.div<{ $isMobile: boolean }>`
    font-weight: bold;
    font-size: 32px;
    line-height: 46px;
    text-align: center;

    color: #323232;
    margin-bottom: 40px;
    ${({ $isMobile }) =>
        $isMobile &&
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
const ContentsWrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    > div {
        width: 50%;
    }
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
