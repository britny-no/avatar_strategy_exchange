import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Slider from '@mui/material/Slider';

const AmountCalculator = ({ balance = 0, price = 0, handleChange, maxOrderCount = 100, minOrderCount = 0.01, leverage = 1 }) => {
    const buttons = ['10%', '25%', '50%', '75%', 'MAX', 'RESET'];
    const buttonsValue = [0.1, 0.25, 0.5, 0.75, 1, 0];

    const [amountPerc, setAmountPerc] = useState(-1);
    const decimalCnt =  minOrderCount &&  String(minOrderCount).split('.')[1] ? String(minOrderCount).split('.')[1].length : 0;

    const renderButtons = () => {
        return buttons.map((text, index) => (
            <Button
                $isCurrent={buttonsValue[index] === amountPerc * 0.01}
                key={index}
                onClick={handleClick(buttonsValue[index])}
            >
                {text}
            </Button>
        ));
    };

    const calculateAmount = (option) => {
        return Number((((balance * option) / price) * leverage).toFixed(decimalCnt));
    };

    const handleSliderChange = (e) => {
        const rate = e.target.value;
        const amount = calculateAmount(rate * 0.01);
        setAmountPerc(rate);
        handleChange(amount > maxOrderCount ? maxOrderCount : amount);
    };

    const handleClick = (value) => () => {
        const amount = calculateAmount(value);
        setAmountPerc(value * 100);
        handleChange(amount > maxOrderCount ? maxOrderCount : amount);
    };

    useEffect(() => {
        const amount = calculateAmount(amountPerc / 100);
        handleChange(amount > maxOrderCount ? maxOrderCount : amount);
    }, [leverage])

    return (
        <div>
            <SliderWrapper>
                <Slider
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    value={amountPerc}
                    onChange={handleSliderChange}
                />
            </SliderWrapper>
            <div>
                <ButtonWrapper>{renderButtons()}</ButtonWrapper>
            </div>
        </div>
    );
};

export default AmountCalculator;

const Button = styled.div<{ $isCurrent: boolean }>`
    margin: 3px;
    width: 27%;
    //width: 48px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    background: #33353b;
    border-radius: 3px;

    border: 1px solid ${({ $isCurrent }) => ($isCurrent ? 'orange' : 'transparent')};
    color: ${({ $isCurrent }) => ($isCurrent ? 'orange' : 'white')};
`;
const ButtonWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;
const SliderWrapper = styled.div`
    //margin: 15px 100px;
    //width: 80%;
    //margin: 20px auto 20px auto;

    .MuiSlider-thumb {
        color: ${({ theme }) => theme.colors.orange};
    }

    .MuiSlider-track {
        color: ${({ theme }) => theme.colors.orange};
    }

    .MuiSlider-rail {
        color: ${({ theme }) => theme.colors.dimmerTextColor};
    }

    .MuiSlider-valueLabelOpen {
        color: ${({ theme }) => theme.colors.normalTextColor} !important;
        background-color: ${({ theme }) => theme.colors.orange} !important;
    }
`;
