import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {  Link } from 'react-router-dom';

import useScreenSize from '@/hooks/useScreenSize';
import { useTypedSelector } from '@/states/useTypedSelector';
import {returnSymbol} from './Hero'

const MyAsset = ({coinOb, szAccNo, selectedSymbol}) => {
    const {t} = useTranslation()
    const { isMobile } = useScreenSize();

    const t9732_BIN_BTCUSDT = useTypedSelector((state) => state.stateReducer.t9732_BIN_BTCUSDT);
    const t9732_BIN_ETHUSDT= useTypedSelector((state) => state.stateReducer.t9732_BIN_ETHUSDT);
    const t9732_BIN_XRPUSDT= useTypedSelector((state) => state.stateReducer.t9732_BIN_XRPUSDT);


    const RenderRowPc = () => {
        const coinObKey = Object.keys(coinOb)
        let key = 0;

        if(!t9732_BIN_BTCUSDT || !t9732_BIN_ETHUSDT || !t9732_BIN_XRPUSDT){
            return <tr><td>{t("wallet:wait_please")}</td></tr>;
        }

        return  coinObKey.map(v => {
            const data = coinOb[v][0]
            const location_props = {
                pathname: '/wallet',
                state: { sub_path: '/deposit_withdraw', szAccNo: szAccNo, locationCoin: v, depositWithdraw: 'deposit' }
            }
            let now_price = 0

            switch(v){
                case 'BTC':
                    now_price = t9732_BIN_BTCUSDT.Output1.fClose
                    break;
                case 'ETH':
                    now_price = t9732_BIN_ETHUSDT.Output1.fClose
                    break;
                case 'XRP':
                    now_price = t9732_BIN_XRPUSDT.Output1.fClose
                    break;
                default:
                    break
            }

            key += 1;
            return <tr className="row"  key={key}>
            <RowFirst style={{width: '10%'}}>
                    <span className="wallet_coin_symbol">{returnSymbol(v)}</span>
                    <span>{data[1]}</span>
            </RowFirst>
            <RowMiddle style={{width: '10%'}}>{ Math.round(data[2] * now_price * 100) / 100}</RowMiddle>
            <RowMiddle style={{width: '10%'}}>{data[2]}</RowMiddle>
            <ActionRoot style={{width: '20%'}}>
                <Link to={location_props}>
                    <ActionDeposit className="action_deposit">{t("wallet:deposit")}</ActionDeposit>
                </Link>
                <Link 
                    to={{
                        ...location_props,
                    }}
                    state = {{
                        ...location_props.state,
                        depositWithdraw: 'withdraw'
                    }}
                >
                <ActionWithdraw className="action_withdraw">{t("wallet:withdraw")}</ActionWithdraw>
                </Link>
            </ActionRoot>
        </tr>
        })
    }

    const RenderRowMo = () => {
        const coinObKey = Object.keys(coinOb)
        let key = 0;

        if(!t9732_BIN_BTCUSDT || !t9732_BIN_ETHUSDT || !t9732_BIN_XRPUSDT){
            return <tr><td>Wait please...</td></tr>;
        }

        return  coinObKey.map(v => {
            const data = coinOb[v][0]
            const location_props = {
                pathname: '/wallet',
                state: { sub_path: '/deposit_withdraw', szAccNo: szAccNo, locationCoin: v, depositWithdraw: 'deposit' }
            }
            let now_price = 0

            switch(v){
                case 'BTC':
                    now_price = t9732_BIN_BTCUSDT.Output1.fClose
                    break;
                case 'ETH':
                    now_price = t9732_BIN_ETHUSDT.Output1.fClose
                    break;
                case 'XRP':
                    now_price = t9732_BIN_XRPUSDT.Output1.fClose
                    break;
                default:
                    break
            }

            key += 1;
            return <table style={{borderBottom: '1px solid #EDEDED', marginBottom: '10px', width: '100%'}} key={key}>
            <thead>
                <tr>
                <RowFirst style={{display: 'inline-block', width: '50%'}} >
                            <span className="wallet_coin_symbol">{returnSymbol(v)}</span>
                            <span>{data[1]}</span>
                    </RowFirst>
                    <ActionRoot style={{display: 'inline-block', width: '50%'}}>
                        <Link to={location_props}><ActionDeposit className="action_deposit">{t("wallet:deposit")}</ActionDeposit></Link>
                        <Link 
                        to={{
                        ...location_props
                        }}
                        state = {{
                            ...location_props.state,
                            depositWithdraw: 'withdraw'
                        }}
                    >
                        <ActionWithdraw className="action_withdraw">{t("wallet:withdraw")}</ActionWithdraw>
                    </Link>
                        
                    </ActionRoot>
                </tr>
            </thead>
            <tbody style={{margin: '10px 0px', padding: '10px 0px', height:'60px'}}>
                <tr style={{display: 'inline-block', width: '100%', marginTop: '10px'}}>
                    <td style={{display: 'inline-block', width: '50%'}} >
                        <M_Column>{t("asset_value:deposit")}</M_Column><br/>
                        <M_Row>{ Math.round(data[2] * now_price * 100) / 100}</M_Row>
                    </td>
                    <td style={{display: 'inline-block', width: '50%'}} >
                        <M_Column>{t("asset_value:total")}</M_Column><br/>
                        <M_Row>{data[2]}</M_Row>
                    </td>
                </tr>
            </tbody>
        </table>
        })
    }

    return (
        <div>  
            <div className="flex_div">
                <span className="sub_title">{t("asset_value:my_asset")}</span>
            </div>
            {isMobile ? <div style={{overflowY: 'scroll', height: '400px'}}>
                <br/>
                {RenderRowMo()}
            </div>
            :     
                <AssetTable >
                <thead style={{ display: 'table',  width: '100%'}}>
                    <tr className="column">
                        <th style={{width: '10%'}}>{t("wallet:coin")}</th>
                        <th style={{width: '10%'}}>{t("wallet:asset_value")}</th>
                        <th style={{width: '10%'}}>{t("wallet:total")}</th>
                        <th style={{width: '20%'}}>{t("wallet:action")}</th>
                    </tr>
                </thead>
                <tbody  style={{display: 'block', overflowY: 'scroll', width: '100%',  height: '400px'}}>
                    {RenderRowPc()}
                </tbody>
            </AssetTable>
            }
        </div>
    );
};

export default MyAsset;


const AssetTable = styled.table`
    max-width:1200px;
    margin: 38px auto 0px;
    width: 100%;
    text-align: left;
    & .column{
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #9A9A9A;
        font-family: Noto Sans;
        font-style: normal;
        font-weight: bold;
        font-size: 14px;
        line-height: 19px;
        color: #383838;
    }

    & .row{
        display:table;
        width: 100%;
        height:55px;
        border-bottom: 1px solid #E7E7E7;
        line-height: 55px;
        font-family: Noto Sans;
        font-style: normal;
        line-height: 19px;


        td:nth-child(6){
            width: 20%;
        }
    }
`

const RowFirst = styled.td `
    height: 50px;
    span{
        font-weight: 700;
        font-size: 14px;
        color: #383838;
    }
    svg{
        margin-right: 10px;
        position: relative;
        top: 10px;
    }
`

const RowMiddle = styled.td `
    font-weight: normal;
    font-size: 14px;
    color: #7D7D7D;
`

const ActionRoot = styled.td`
    @media (max-width: 900px){
        min-width: 150px;
        button{
            width: 75px;
            height: 34px;
            border-radius: 4px;
        }
    }

    @media (min-width: 900px){
        min-width: 200px;
        button{
            width: 100px;
            height: 34px;
            border-radius: 4px;
        }
    }
`
const ActionDeposit = styled.button`
    margin-right: 10px;
    border: 0px;
    background: #173959;
    color: #FFFFFF;

    &:active{
        color: #b5b2b2;
    }
`

const ActionWithdraw = styled.button`
    border: 1px solid #173959;
    background: #FFFFFF;
    color: #173959;

    &:active{
        color: #b5b2b2;
    }
`
const M_Column = styled.span`
    height: 30px;
    line-height: 30px;
    font-family: Noto Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 19px;
    color: #383838;
`

const M_Row = styled.span`
    font-weight: normal;
    font-size: 14px;
    color: #7D7D7D;
`

