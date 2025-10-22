import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Slider from '@mui/material/Slider';
import { useDispatch } from 'react-redux';

import { setLeverage } from '@/states/reducers/marginAndLeverageReducer';
import useMarginAndLeverage from '@/hooks/useMarginAndLeverage';
import useSymbolList from '@/hooks/useSymbolList';

const defaultProps = {
    handleClose: () => {
        //Default
    },
};

const LeveragePopup = ({ handleClose = defaultProps.handleClose, isForMobile = false }) => {
    const { leverage } = useMarginAndLeverage();
    const { currentSymbolData } = useSymbolList();
    const { MAX_LEVERAGE } = currentSymbolData;

    const [currentLeverage, setCurrentLeverage] = useState(leverage);
    const dispatch = useDispatch();
    const steps = ['1', '5', '10', '25', '50', '75', '100'];
    const WARNING_TEXT = 'Please manage your risk accordingly';

    const handleStepClick = (step, isActive) => () => {
        isActive && setCurrentLeverageBaseOnMaxLeverage(step);
    };

    const handleApply = () => {
        if (0 < Number(currentLeverage) && Number(currentLeverage) <= 100) {
            dispatch(setLeverage(currentLeverage));
            handleClose();
        }
    };

    const handleCancel = () => {
        handleClose();
    };

    const handleChange = (e) => {
        if (e.target.value >= 0 && e.target.value <= 100) {
            setCurrentLeverageBaseOnMaxLeverage(Number(e.target.value) + '');
        }
    };

    const handleKeyDown = (evt) => {
        if (evt.key === 'e' || evt.key === '+' || evt.key === '-') {
            evt.preventDefault();
        }
    };

    const handleSliderChange = (e) => {
        setCurrentLeverageBaseOnMaxLeverage(e.target.value);
    };

    const setCurrentLeverageBaseOnMaxLeverage = (value) => {
        if (Number(value) > Number(MAX_LEVERAGE)) {
            console.log('leverage slider change max : ', MAX_LEVERAGE);

            setCurrentLeverage(MAX_LEVERAGE.replace(' ', ''));
        } else {
            console.log('leverage slider change : ', value);

            setCurrentLeverage(value);
        }
    };
    console.log('leverage slider change :currentLeverage ', currentLeverage);

    const renderSteps = () => {
        return steps.map((step, index) => {
            const isActive = Number(MAX_LEVERAGE) >= Number(step);
            return (
                <Step
                    key={index}
                    onClick={handleStepClick(step, isActive)}
                    isActive={isActive}
                    isCurrent={Number(step) === Number(currentLeverage)}
                >
                    {step + 'x'}
                </Step>
            );
        });
    };

    return (
        <Wrapper style={{ width: isForMobile ? '100vw' : '100%' }}>
            <LeverageText>Leverage</LeverageText>
            <InputWrapper>
                <LeverageInput
                    type="number"
                    value={currentLeverage}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
            </InputWrapper>
            {/*{currentLeverage + 'x'}*/}
            <SliderWrapper>
                <Slider
                    max={Number(MAX_LEVERAGE)}
                    value={Number(currentLeverage)}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    onChange={handleSliderChange}
                />
            </SliderWrapper>
            <StepsWrapper>{renderSteps()}</StepsWrapper>
            <WarningText>{WARNING_TEXT}</WarningText>
            <ButtonWrapper>
                <ApplyBtn onClick={handleApply}>Apply</ApplyBtn>
                <CancelBtn onClick={handleCancel}>Cancel</CancelBtn>
            </ButtonWrapper>
        </Wrapper>
    );
};

export default LeveragePopup;

const BUTTON_WIDTH = 260;
const BUTTON_HEIGHT = 50;

const Wrapper = styled.div`
    //width: 600px;
    //height: 320px;
    padding: 25px;
    position: relative;
    background-color: ${({ theme }) => theme.colors.primaryColor};
    border: 1px solid ${({ theme }) => theme.colors.secondaryColor};
    width: 100%;
    height: 100%;
    border-radius: 5px;
`;

const BaseBtn = styled.div`
    width: 40%;
    height: ${BUTTON_HEIGHT}px;
    line-height: ${BUTTON_HEIGHT}px;
`;

const ApplyBtn = styled(BaseBtn)`
    margin-right: 10px;
    text-align: center;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.colors.orange};
    color: ${({ theme }) => theme.colors.normalTextColor};
    cursor: pointer;
`;
const CancelBtn = styled(BaseBtn)`
    text-align: center;
    border-radius: 5px;
    // background-color: ${({ theme }) => theme.colors.secondaryColor};
    color: ${({ theme }) => theme.colors.dimmerTextColor};
    border: 1px solid ${({ theme }) => theme.colors.dimmerTextColor};
    cursor: pointer;
`;
const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
`;
const StepsWrapper = styled.div`
    display: flex;
    justify-content: center;
`;
const Step = styled.div<{ isCurrent: boolean; isActive: boolean }>`
    background-color: ${({ theme }) => theme.colors.secondaryColor};
    color: ${({ theme, isActive }) => (isActive ? theme.colors.normalTextColor : theme.colors.dimmerTextColor)};
    line-height: 35px;
    height: 35px;
    text-align: center;
    border-radius: 5px;
    width: 70px;
    margin: 5px;
    cursor: pointer;
    border: 1px solid ${({ theme, isCurrent }) => (isCurrent ? theme.colors.orange : theme.colors.secondaryColor)};
`;

const WarningText = styled.div`
    width: 100%;
    text-align: center;
    color: ${({ theme }) => theme.colors.normalTextColor};
    margin: 23px 0;
`;

const InputWrapper = styled.div`
    width: 60%;
    margin: 10px auto 10px auto;
`;
const LeverageInput = styled.input`
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.dimmerTextColor};
    color: ${({ theme }) => theme.colors.normalTextColor};
    background-color: transparent;
    border-radius: 5px;
    text-align: center;
    //margin: 15px 100px;
    height: 45px;
    line-height: 45px;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const LeverageText = styled.div`
    padding-bottom: 10px;
    text-align: center;
    color: ${({ theme }) => theme.colors.normalTextColor};
    font-size: 18px;
`;

const SliderWrapper = styled.div`
    //margin: 15px 100px;
    width: 80%;
    margin: 20px auto 20px auto;

    .MuiSlider-thumb {
        color: ${({ theme }) => theme.colors.normalTextColor};
    }

    .MuiSlider-track {
        color: ${({ theme }) => theme.colors.normalTextColor};
    }

    .MuiSlider-rail {
        color: ${({ theme }) => theme.colors.dimmerTextColor};
    }

    .MuiSlider-valueLabelOpen {
        color: ${({ theme }) => theme.colors.dimmerTextColor} !important;
    }
`;
