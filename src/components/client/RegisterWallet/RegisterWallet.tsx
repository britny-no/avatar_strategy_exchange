import React, { useState } from 'react';
import {
    Button,
    TextField,
} from '@mui/material';
import { KOREAN, ENGLISH } from '../../../constants/Language';
import useCurrentLanguage from '../../../hooks/useCurrentLanguage';
import useAgentToSend from '../../../hooks/useAgentToSend';
import useUsersData from '../../../hooks/useUserData';

const walletAddressText = (language) => {
    switch (language) {
        case [KOREAN]:
            return '지갑 주소';
        case [ENGLISH]:
            return 'Wallet address';
        default:
            return '지갑 주소';
    }
};

const szCurNoText = (language) => {
    switch (language) {
        case [KOREAN]:
            return '종목명';
        case [ENGLISH]:
            return 'Course name';
        default:
            return '종목명';
    }
};

const RegisterWallet = () => {
    const { currentLanguage } = useCurrentLanguage();

    const [input, setInput] = useState({});

    const { result, sendTransaction } = useAgentToSend();
    const { szAccNo, szPasswd } = useUsersData();

    const handleSubmit = () => {
        const inputToSend = {
            Header: { function: 'D' as const, termtype: 'HTS' as const, trcode: 't023A' },
            Input1: {
                szAccNo: szAccNo,
                szPasswd: szPasswd,
                ...input,
            },
        };

        sendTransaction(inputToSend);
    };

    const handleChange = (target) => (e) => {
        setInput({
            ...input,
            [target]: e.target.value,
        });
    };

    return (
        <div>
            <form noValidate autoComplete="off">
                <TextField
                    fullWidth
                    label={walletAddressText(currentLanguage)}
                    margin="normal"
                    variant="outlined"
                    onChange={handleChange('szWallet_Addr')}
                />
                <TextField
                    fullWidth
                    label={szCurNoText(currentLanguage)}
                    margin="normal"
                    variant="outlined"
                    onChange={handleChange('szCurNo')}
                />
            </form>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                제출
            </Button>
            {JSON.stringify(result)}
        </div>
    );
};

export default RegisterWallet;
