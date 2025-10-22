import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import useScreenSize from '@/hooks/useScreenSize';

interface IProps {
    children: string | ReactNode;
}

const ContainedButton = ({ children }: IProps) => {
    const { isMobile } = useScreenSize();
    return <ButtonWrap $isMobile={isMobile}>{children}</ButtonWrap>;
};

export default ContainedButton;

export const ButtonWrap = styled.div<{ $isMobile: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 420px;
    height: 62px;
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            width: 248px;
            height: 42px;
            > span {
                font-size: 12px;
                line-height: 15px;
            }
        `}
`;
