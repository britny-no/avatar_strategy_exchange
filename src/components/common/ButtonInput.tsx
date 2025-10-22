import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { NumericFormat } from 'react-number-format';
import { Box } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import formatNumber from '../../lib/formatNumber';
import * as CONST from '../../constants/OrderTab';
import useSymbolList from '../../hooks/useSymbolList';
import { useTypedSelector } from '../../states/useTypedSelector';

const priceStepsFourTwo = [100, 1000, 10000, 100000, 1000000];
const priceStepsForFour = [0.0001, 0.001, 0.01, 0.1, 1];
const amountSteps = [1, 5, 10, 15, 20];

interface IButtonInputProps {
  target: string | undefined;
  handleChange: (target: string | undefined, value: number) => void;
  initialValue: number | undefined;
  disabled?: boolean;
  width?: string | number;
  decimalCnt?: number;
  szAccNo?: string;
  stepButtonVisible?: boolean;
}

const ButtonInput = ({
  target,
  initialValue = 0,
  disabled = false,
  width = '65%',
  stepButtonVisible = true,
  decimalCnt = 2,
  szAccNo,
  handleChange = () => {
    alert('function not provided');
  },
}: IButtonInputProps) => {
  const { currentSymbolData } = useSymbolList();
  const { PIP_LOWEST, MIN_ORDCNT } = currentSymbolData;
  const sumToFixed = Number(MIN_ORDCNT) < 1 ? (1 / Number(MIN_ORDCNT)).toString().length - 1 : 0;
  const orderReducerData = useTypedSelector((state) => state.orderReducer.data);
  const priceSteps = decimalCnt > 2 ? priceStepsForFour : priceStepsFourTwo;
  const [step, setStep] = useState<number>(target === CONST.TARGET_AMOUNT ? amountSteps[0] : priceSteps[0]);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  useEffect(() => {
    setStep(target === CONST.TARGET_AMOUNT ? amountSteps[0] : priceSteps[0]);
  }, [orderReducerData]);

  const handleIncreaseDecrease = (type: 'increase' | 'decrease') => () => {
    if (disabled || target === undefined) return;
    let value = type === 'increase' ? Number(initialValue) + Number(step) : Number(initialValue) - Number(step);
    value = Number((value || 0).toFixed(decimalCnt));
    handleChange(target, value > 0 ? value : 1);
  };

  const handleOptionClick = (step: number) => () => {
    setIsOpened(false);
    setStep(step);
  };

  const handleOpenOptionBox = () => {
    setIsOpened(true);
  };

  const handleCloseOptionBox = () => {
    setIsOpened(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width }}>
      <InputWrapper>
        <Input
          onValueChange={(values) => {
            handleChange(target, values.floatValue);
          }}
          thousandSeparator
          // isNumericString
          allowLeadingZeros={true}
          allowNegative={false}
          value={initialValue}
          disabled={disabled}
          decimalScale={target === 'fOrderSu' ? sumToFixed : decimalCnt}
        />
        {stepButtonVisible && <MinusButton onClick={handleIncreaseDecrease('decrease')}>-</MinusButton>}
        {stepButtonVisible && <PlusButton onClick={handleIncreaseDecrease('increase')}>+</PlusButton>}
      </InputWrapper>
      {stepButtonVisible && (
        <IncreateOptionBtn
          onMouseEnter={handleOpenOptionBox}
          onClick={handleOpenOptionBox}
          onMouseLeave={handleCloseOptionBox}
        >
          <ArrowDropDown fontSize="large" style={{ cursor: 'pointer' }} />
          <OptionsWrapper $isOpened={isOpened}>
            {(target === CONST.TARGET_AMOUNT ? amountSteps : priceSteps).map((option, index) => (
              <Options key={index} onClick={handleOptionClick(option)} $isCurrent={option === step}>
                {formatNumber(option, decimalCnt > 4 ? decimalCnt : 0)}
              </Options>
            ))}
          </OptionsWrapper>
        </IncreateOptionBtn>
      )}
    </div>
  );
};

export default ButtonInput;

const Options = styled.div<{ $isCurrent: boolean }>`
  padding: 3px 12px;
  cursor: pointer;
  border-radius: 6px;
  background-color: ${({ theme, $isCurrent }) => $isCurrent && theme.colors.secondaryColor};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryColor};
  }
`;

const OptionsWrapper = styled.div<{ $isOpened: boolean }>`
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.secondaryColor};
  background-color: ${({ theme }) => theme.colors.primaryColor};
  color: ${({ theme }) => theme.colors.normalTextColor};
  display: ${({ $isOpened }) => ($isOpened ? 'block' : 'none')};
  position: absolute;
  z-index: 9999;
  top: 100%;
  right: 20%;
`;

const IncreateOptionBtn = styled.span`
  position: relative;
`;

const InputWrapper = styled(Box)`
  align-items: center;
  display: flex;
  padding: 0;
  margin: 3px 3px;
  background-color: ${({ theme }) => theme.colors.primaryColor};
`;

const Input = styled(NumericFormat)`
  width: 100%;
  outline: none;
  height: 30px;
  padding: 5px;
  color: ${({ theme }) => theme.colors.normalTextColor};
  border-bottom-left-radius: 2px;
  border-top-left-radius: 2px;
  background-color: ${({ theme }) => theme.colors.secondaryColor};
  border: 2px solid ${({ theme }) => theme.colors.secondaryColor};
`;

const BaseCalButton = styled.div`
  cursor: pointer;
  height: 30px;
  font-size: 20px;
  padding: 5px 10px;
  color: ${({ theme }) => theme.colors.dimmerTextColor};
  background-color: ${({ theme }) => theme.colors.primaryColor};
  border: 1px solid ${({ theme }) => theme.colors.secondaryColor};
  border-radius: 2px;

  &:hover {
    color: #525252;
  }
`;

const PlusButton = styled(BaseCalButton)`
  border-left: 0;
`;

const MinusButton = styled(BaseCalButton)`
  border-radius: 0;
`;
