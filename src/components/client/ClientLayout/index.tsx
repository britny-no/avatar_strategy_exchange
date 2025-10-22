import React from 'react';
import config from '@/config/clientMenu';
import ClientLayout from './ClientLayout';

const Index = ({ children }: { children: React.ReactNode }) => {
    return <ClientLayout menus={config.general}>{children}</ClientLayout>;
};

export default Index;
