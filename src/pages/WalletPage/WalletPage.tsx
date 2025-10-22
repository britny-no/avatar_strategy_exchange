import ClientLayout from '@/components/client/ClientLayout';
import RegisterWallet from '@/components/client/RegisterWallet';
import SearchWallet from '@/components/client/SearchWalletAddress';

const WalletPage = () => {
    return (
        <ClientLayout>
            <RegisterWallet />
            <SearchWallet />
        </ClientLayout>
    );
};

export default WalletPage;
