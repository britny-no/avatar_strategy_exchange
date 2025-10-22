import styled, { css } from 'styled-components';
import useLatestSymbolInfo from '@/hooks/useLatestSymbolInfo';

interface IProps {
    isMobile: boolean;
    symbolData: Record<string, string | number | boolean>;
}

const CoinCard = ({ isMobile, symbolData }: IProps) => {
    const { close } = useLatestSymbolInfo({
        symbolInfo: symbolData,
    });
    
    return (
        <CoinCardWrap $isMobile={isMobile}>
            <p className="title">{symbolData.NAME_ENG}</p>
            <p className="price">$ {close || 0.1}</p>
        </CoinCardWrap>
    );
};

export default CoinCard;

const CoinCardWrap = styled.div<{ $isMobile: boolean }>`
    width: 250px;
    height: 120px;
    padding: 26px 10px;
    text-align: center;
    background: #f6f7fc;
    border: 1px solid #d3d9f7;
    box-sizing: border-box;
    border-radius: 10px;
    & > p.title {
        margin-bottom: 16px;
        font-weight: bold;
        font-size: 16px;
        line-height: 18px;
        color: #353535;
    }
    & > p.price {
        font-weight: bold;
        font-size: 30px;
        line-height: 34px;

        color: #f39101;
    }

    ${({ $isMobile }) =>
    $isMobile &&
        css`
            width: 140px;
            height: 89px;
            padding: 22px 10px;
            margin-bottom: 10px;
            & > p.title {
                margin-bottom: 10px;
                font-size: 12px;
                line-height: 14px;
            }
            & > p.price {
                font-size: 18px;
                line-height: 21px;
            }
        `}
`;
