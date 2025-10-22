import styled from 'styled-components';
import React from 'react';
import { useTranslation } from "react-i18next";

interface PropsType {
    width: string;
    height: string;
}

const LogInRequired = ({ width = '100%', height = "385px" }: PropsType) => {
    const { t } = useTranslation()
    return <Wrapper style={{ width, height }}>{t("trade:login_error")}</Wrapper>;
};
const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: grey;
`;

export default LogInRequired;
