import React, { useState } from 'react';
import {
    Button,
    TextField,
} from '@mui/material';
import { KOREAN, ENGLISH } from '../../../constants/Language';
import useCurrentLanguage from '../../../hooks/useCurrentLanguage';
import useAgentToSend from '../../../hooks/useAgentToSend';
import useUsersData from '../../../hooks/useUserData';

const szCurNoText = {
    [KOREAN]: '종목명',
    [ENGLISH]: 'Course name',
};

const SearchWalletAddress = () => {
    const { currentLanguage } = useCurrentLanguage();

    const [input, setInput] = useState({});

    const { result, sendTransaction } = useAgentToSend();
    const { szAccNo } = useUsersData();

    const handleSubmit = () => {
        const inputToSend = {
            Header: { function: 'D' as const, termtype: 'HTS' as const, trcode: 't023B' },
            Input1: {
                szAccNo: szAccNo,
                ...input,
            },
        };

        console.log(`input to send : `, inputToSend);
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
                    label={szCurNoText[currentLanguage]}
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

export default SearchWalletAddress;
