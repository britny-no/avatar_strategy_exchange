import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';
import {NumericFormat} from 'react-number-format';

export const TypeEnum = {
    String: 'string',
    Text: 'text',
    Password: 'password',
    Email: 'email',
    Phone: 'phone',
    Number: 'number',
    ReadOnly: 'readOnly',
};

type TypeOfInput = typeof TypeEnum[keyof typeof TypeEnum];

type PropsType = {
    label: string;
    onChange?: (e) => void;
    color?: string;
    type?: TypeOfInput;
    thousandSeparator?: boolean;
    maxLength?: number;
    readOnlyValue?: string;
    allowLeadingZeros?: boolean;
};

const CustomInput = ({
    label = 'default label',
    onChange = (e) => {
        alert('CustomInput onChnage func is not provided');
    },
    color = '',
    type = 'text',
    thousandSeparator = false,
    maxLength = 10,
    allowLeadingZeros = false,
    readOnlyValue = 'defaultReadOnlyValue',
}: PropsType) => {
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(e.target.value);

        onChange({
            target: {
                value: e.target.value,
            },
        });
    };

    const handleChangeNumber = (value) => {
        onChange({
            target: {
                value,
            },
        });
        setValue(value);
    };

    const handleChangeString = (e) => {
        const regex = /[\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/; // check if string contains number or special char
        if (!regex.test(e.target.value)) {
            setValue(e.target.value);
            onChange({
                target: {
                    value: e.target.value,
                },
            });
        }
    };

    return (() => {
        switch (type) {
            case TypeEnum.Number:
                return (
                    <StTextField
                        $customColor={color}
                        label={label}
                        variant="outlined"
                        fullWidth={true}
                        InputProps={{
                            inputComponent: NumberFormatCustom,
                            inputProps: {
                                thousandSeparator,
                                value,
                                maxLength,
                                handleChange: handleChangeNumber,
                                allowLeadingZeros,
                            },
                        }}
                    />
                );
            case TypeEnum.String:
                return (
                    <StTextField
                        $customColor={color}
                        label={label}
                        value={value}
                        variant="outlined"
                        fullWidth={true}
                        onChange={handleChangeString}
                        type={type}
                    />
                );

            case TypeEnum.ReadOnly:
                return (
                    <StTextField
                        $customColor={color}
                        label={label}
                        value={readOnlyValue}
                        variant="outlined"
                        fullWidth={true}
                        type={type}
                    />
                );
            case TypeEnum.Password:
                return (
                    <StTextField
                        $customColor={color}
                        label={label}
                        variant="outlined"
                        fullWidth={true}
                        type={type}
                        onChange={handleChange}
                    />
                );

            default:
                return (
                    <StTextField
                        $customColor={color}
                        label={label}
                        value={value}
                        autoComplete="current-password"
                        variant="outlined"
                        fullWidth={true}
                        onChange={handleChange}
                        type={type}
                    />
                );
        }
    })();
};

export default CustomInput;

const StTextField = styled(TextField)<{ $customColor: string }>`
    margin: 5px 0 !important;
    fieldset {
        border-color: ${({ $customColor }) => $customColor} !important;
        /* border-color: #ffffff !important; */
    }

    input {
        color: ${({ $customColor }) => $customColor} !important;
    }

    label {
        color: ${({ $customColor }) => $customColor} !important;
    }
`;

function NumberFormatCustom(props) {
    const { value, maxLength, handleChange, allowLeadingZeros, prefix, thousandSeparator, ...other } = props;

    return (
        <NumericFormat
            {...other}
            value={value}
            onValueChange={(values) => {
                handleChange(allowLeadingZeros ? values.floatValue : values.floatValue);
            }}
            thousandSeparator={thousandSeparator}
            isNumericString
            prefix={prefix}
            allowLeadingZeros={allowLeadingZeros}
            maxLength={maxLength}
        />
    );
}
