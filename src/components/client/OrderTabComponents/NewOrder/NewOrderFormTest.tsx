import React, { useState } from "react";
import styled from "styled-components";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel
} from "@mui/material"
import { NumericFormat } from "react-number-format";

import useAgentToSend from "@/hooks/useAgentToSend";

const ButtonInput = ({ target, handleChange }) => {
  return (
    <InputWrapper>
      <Input
        onValueChange={(values) => {
          handleChange(target, values.floatValue);
        }}
        thousandSeparator
        // isNumericString
        prefix={target === "price" ? "$" : ""}
      />
      <MinusButton>-</MinusButton>
      <PlusButton>+</PlusButton>
    </InputWrapper>
  );
};

const InputWrapper = styled(Box)`
  align-items: center;
  display: flex;
  border: 1px solid #e7e7e7;
  padding: 0 0;
  margin: 3px 3px;
`;

const Input = styled(NumericFormat)`
  outline: none;
  height: 100%;
  padding: 5px;
  border: none;
  color: grey;
  border-radius: 2px;
`;
const BaseCalButton = styled.div`
  cursor: pointer;
  height: 100%;
  font-size: 20px;

  padding: 5px 10px 5px 10px;
  color: #a0a0a0;

  background-color: #fcfbfb;
  /* outline: none; */
`;
const PlusButton = styled(BaseCalButton)``;
const MinusButton = styled(BaseCalButton)`
  border-left: 1px solid #e7e7e7;
  border-right: 1px solid #e7e7e7;
`;

const borderBottomStyle = {
  borderBottom: "1px solid #dfdfdf",
};

const fontEighteen = {
  fontSize: "18px",
};
const fontFifteen = {
  fontSize: "15px",
  fontWeight: "400",
};
const fontFourteen = {
  fontSize: "14px",
  // lineHeight:"20.27px"
};

const fontBold = {
  fontWeight: "bold",
};

const fontThirteen = {
  fontSize: "13px",
  color: "#5461BD",
};
const paddingRightSix = {
  paddingRight: "6px",
};
const paddingRightEight = {
  paddingRight: "8px",
};

const colorGrey = {
  color: "#E56060",
};

const NewOrderFormTest = () => {
  const [inputRef, setInputRef] = useState({
    Header: {
      function: "D",
      termtype: "HTS",
      trcode: "t3215",
    },
    Input1: {
      szAccNo: "00010057100005",
      szPasswd: "0000",
      szCurNo: "BCE2009Q03BU",
      fOrderSu: "",
      fOrderPrice: "",
      fStopPrice: "",
      fLimitPrice: "",
      szOrdType: "",
      nRange: "", //사용안함
      nAlivingTerm: "", //사용안함
      szDealDiv: "",
      fNxOpenRate: "",
      szSLCustItem: "",
      szOrgCustItem: "",
      szNotMemberAccNo: "", //사용안함
      szStaffID: "",
      szStaffPW: "",
      cIsStaff: "0",
      cModType: "4",
    },
  });
  const { result, sendTransaction } = useAgentToSend();

  const handleSubmit = (option) => (e) => {
    inputRef.Input1.szDealDiv = option;
    // validation check?
    sendTransaction(inputRef);
  };

  const handleClick = (e) => {
    setInputRef({
      ...inputRef,
      Input1: { ...inputRef.Input1, szOrdType: e.target.value },
    });
  };

  const handleChange = (target, value) => {
    setInputRef({
      ...inputRef,
      Input1: { ...inputRef.Input1, [target]: value },
    });
  };

  if (result?.Message?.data) {
    console.log('result in testform : ', result);
  }

  return (
    <NewOrderWrapper>
      <Box justifyContent="space-between" style={borderBottomStyle}>
        <div style={{ ...fontEighteen, ...fontBold }}>
          Using account number 0005
        </div>
        <Flex>
          <div style={{ ...fontFifteen, ...paddingRightEight }}>Leverage</div>
          <div style={{ ...fontFifteen, ...colorGrey }}>x 20</div>
        </Flex>
      </Box>

      <Box>
        <RadioGroup onChange={handleClick}>
          <Box>
            <StFormControlLabel
              value="UOE"
              control={<Radio />}
              label="Limit order"
            />
            <StFormControlLabel
              value="UOM"
              control={<Radio />}
              label="Market Order"
            />
          </Box>
        </RadioGroup>
      </Box>
      <Box alignItems="center" justifyContent="space-between">
        <div style={fontFifteen}>Price(USDT)</div>
        <ButtonInput target={"fOrderPrice"} handleChange={handleChange} />
      </Box>
      <Box justifyContent="flex-end" style={{ padding: 0 }}>
        <div style={{ ...fontFourteen, ...paddingRightSix }}>1,2344,5678</div>
        <div style={{ ...fontThirteen }}>USDT</div>
      </Box>
      <Box
        alignItems="center"
        justifyContent="space-between"
        style={borderBottomStyle}
      >
        <div style={fontFifteen}>Amount(BTC)</div>
        <ButtonInput target={"fOrderSu"} handleChange={handleChange} />
      </Box>

      <Box justifyContent="space-between">
        <div style={fontFourteen}>Order Value</div>
        <Flex>
          <div style={{ ...fontFourteen, ...paddingRightSix, ...fontBold }}>
            0
          </div>
          <div style={fontThirteen}>BTC</div>
        </Flex>
      </Box>
      <Box justifyContent="space-between">
        <div style={fontFourteen}>Available margin</div>
        <Flex>
          <div style={{ ...fontFourteen, ...paddingRightSix, ...fontBold }}>
            0
          </div>
          <div style={fontThirteen}>BTC</div>
        </Flex>
      </Box>
      <Box justifyContent="space-between">
        <BuyButton variant="contained" onClick={handleSubmit("079")}>
          Buy
        </BuyButton>
        <SellButton variant="outlined" onClick={handleSubmit("081")}>
          Sell
        </SellButton>
      </Box>
    </NewOrderWrapper>
  );
};

export default React.memo(NewOrderFormTest);

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const NewOrderWrapper = styled.div`
  height: ${({ theme }) => theme.orderTabMenu.height};
  padding: 20px 20px 10px 20px;
  & > div {
    padding: ${({ theme }) => theme.orderTabMenu.padding};
  }
`;

const StFormControlLabel = styled(FormControlLabel)`
  color: #000000 !important;
  span {
    font-size: 14px !important;
  }

  span:first-child {
    color: #5461bd !important;
  }
`;

const BaseButton = styled(Button)`
  /* width: 43%; */
  font-size: 14px !important;
  padding: 10px 0 !important;
  border-radius: 2px !important;
  font-weight: 700 !important;
  width: 185px;
  text-align: center;
`;
const BuyButton = styled(BaseButton)`
  background: #4271d9 !important;
  color: white !important;
  text-transform: none;
`;
const SellButton = styled(BaseButton)`
  border: 1px solid #4271d9 !important;
  color: #4271d9 !important;
  text-transform: none;
`;
