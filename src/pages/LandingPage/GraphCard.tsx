import styled, { css } from 'styled-components';
import HERO_CARD_GRAPH_RED from '@/assets/landing/hero_card_graph_red@2x.png';
import HERO_CARD_GRAPH_GREEN from '@/assets/landing/hero_card_graph_green@2x.png';
import useScreenSize from '@/hooks/useScreenSize';
import useLatestSymbolInfo from '@/hooks/useLatestSymbolInfo';

interface IProps {
    symbolData: Record<string, string | number | boolean>;
}

const GraphCard = ({ symbolData }: IProps) => {
    const { isMobile } = useScreenSize();
    const { close, status, changePerc  } = useLatestSymbolInfo({
        symbolInfo: symbolData,
    });

    return (
        <StyledGraphCard $isMobile={isMobile} type={status}>
            <div className="card-header">
                <p className="coin">{symbolData.NAME_ENG}</p>
                <p className="badge">{changePerc || 0}%</p>
            </div>
            <div className="card-body">
                <p className="price">${close || 0.1}</p>
                <img src={status === 'up' ? HERO_CARD_GRAPH_RED : HERO_CARD_GRAPH_GREEN} alt="card graph" />
            </div>
        </StyledGraphCard>
    );
};

export default GraphCard;

const StyledGraphCard = styled.div<{ $isMobile: boolean; type?: 'up' | 'down' }>`
    box-sizing: border-box;
    width: 300px;
    height: 190px;
    padding: 22px 18px;
    box-shadow: 0px 6px 26px rgba(86, 75, 162, 0.4);
    border-radius: 10px;
    background: #ffffff;
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 24px;
        width: 100%;
    }
    .coin {
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 18px;
        color: #353535;
    }
    .badge {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 24px;
        font-style: normal;
        font-weight: bold;
        font-size: 14px;
        line-height: 16px;
        text-align: center;
        color: #ffffff;
        background: #ff6b6b;
        border-radius: 4px;
    }
    .card-body {
        margin: 6px 0;
    }
    .price {
        font-weight: bold;
        font-size: 30px;
        line-height: 34px;

        color: #ff6b6b;
    };

    & img {
        width: 100%;
        height: 100%;
    }
    ${({ type }) =>
        type === 'down' &&
        css`
            .price {
                color: #56b4c0 !important;
            }
            .badge {
                background: #56b4c0;
            }
        `}
    ${({ $isMobile }) =>
    $isMobile &&
        css`
            min-width: 158px;
            width: 100%;
            height: 120px;
            padding: 14px 10px;
            .card-header {
                width: 100%;
                height: 20px;
            }
            .coin {
                font-size: 11px;
                line-height: 13px;
            }
            .badge {
                width: 47px;
                height: 20px;
                font-size: 12px;
                line-height: 14px;
            }
            .price {
                font-size: 16px;
                line-height: 18px;

                color: #ff6b6b;
            }
        `}
`;
