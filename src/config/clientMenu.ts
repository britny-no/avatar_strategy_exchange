import { KOREAN, ENGLISH } from '../constants/Language';

const clientMenu = {
    general: [
        {
            [KOREAN]: '상품설명',
            [ENGLISH]: 'Product info',
            subMenus: [
                {
                    [KOREAN]: '상품설명2',
                    [ENGLISH]: 'Sub Product info1',
                    link: '',
                },
                {
                    [KOREAN]: '상품설명3',
                    [ENGLISH]: 'Sub Product info2',
                    link: '',
                },
            ],
        },
        {
            [KOREAN]: '플랫폼',
            [ENGLISH]: 'Platform',
            subMenus: [
                {
                    [KOREAN]: '거래소',
                    [ENGLISH]: 'Trading',
                    link: '/trade',
                },
            ],
        },
        {
            [KOREAN]: '고객정보/서비스',
            [ENGLISH]: 'Platform',
            subMenus: [
                {
                    [KOREAN]: '외부 지갑 등록',
                    [ENGLISH]: 'Register Wallet Address',
                    link: '/wallet',
                },
                {
                    [KOREAN]: '코인별 외부주소 조회',
                    [ENGLISH]: 'Search Wallet Address',
                    link: '/wallet',
                },
                {
                    [KOREAN]: '고객 정보 변경',
                    [ENGLISH]: 'Edit user info',
                    link: '/edit/user/info',
                },
            ],
        },
        {
            [KOREAN]: '입출고',
            [ENGLISH]: 'Deposit & Withdraw',
            subMenus: [
                {
                    [KOREAN]: '출금신청',
                    [ENGLISH]: '거래도구2',
                    link: '',
                },
                {
                    [KOREAN]: '출금신청내역조회',
                    [ENGLISH]: '거래도구2',
                    link: '',
                },
                {
                    [KOREAN]: '코인입출고 완료 내역',
                    [ENGLISH]: '거래도구2',
                    link: '',
                },
                {
                    [KOREAN]: '코인송금정보조회',
                    [ENGLISH]: '거래도구2',
                    link: '',
                },
            ],
        },
        {
            [KOREAN]: '환전',
            [ENGLISH]: 'Platform',
            subMenus: [
                {
                    [KOREAN]: '환전 신청',
                    [ENGLISH]: '수수료비용2',
                    link: '/exchange',
                },
                {
                    [KOREAN]: '환전내역 조회',
                    [ENGLISH]: '수수료비용2',
                    link: '/exchange/history',
                },
                {
                    [KOREAN]: '환율 변동 조회',
                    [ENGLISH]: '수수료비용2',
                    link: '',
                },
            ],
        },
    ],
    private: [],
};

export default clientMenu;
