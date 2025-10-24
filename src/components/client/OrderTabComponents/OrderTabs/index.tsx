import { useTranslation } from "react-i18next";
import styled, { css } from 'styled-components';

import * as LANGUAGE from '@/constants/Language';
import MyAvatar from "@/components/client/MyAvatar"

export default function Index({ language = LANGUAGE.KOREAN }) {

    return (
        <TapWrapper>
            <TabContent >
                <MyAvatar />
            </TabContent>
        </TapWrapper>
    );
}

const TabContent = styled.div`
    display: block;
    width: 300px;
    height: 493px;
`;

const TapWrapper = styled.div`
    background-color: ${({ theme }) => theme.colors.primaryColor};


`;
