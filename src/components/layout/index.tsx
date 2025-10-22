import { ReactNode } from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

interface IProps {
    headerType?: 'absolute' | 'relative';
    children: ReactNode;
    theme?: 'dark' | 'light';
}

const Layout = ({ headerType = 'absolute', children, theme = 'dark' }: IProps) => {
    return (
        <StyledLayout>
            <Header headerType={headerType} theme={theme} />
            {children}
            <Footer theme={theme} />
        </StyledLayout>
    );
};

export default Layout;

const StyledLayout = styled.div`
    position: relative;
    width: 100%;
    height: auto;
    overflow: hidden;
`;
