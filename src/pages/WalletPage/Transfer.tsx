import styled, {css} from 'styled-components';
import Dropdown from 'react-dropdown';

import useScreenSize from '@/hooks/useScreenSize';
import { useTypedSelector } from '@/states/useTypedSelector';




const Transfer = ({coinOb}) => {
    const { isMobile } = useScreenSize();

    const t9732_BIN_BTCUSDT = useTypedSelector((state) => state.stateReducer.t9732_BIN_BTCUSDT);
    const t9732_BIN_ETHUSDT= useTypedSelector((state) => state.stateReducer.t9732_BIN_ETHUSDT);

    const RenderRowPc = () => {
        const coinObKey = Object.keys(coinOb)
        let key = 0;

        if(!coinObKey[0] || !t9732_BIN_BTCUSDT || !t9732_BIN_ETHUSDT){
            return <div>Wait please...</div>;
        }

        return  coinObKey.map(v => {
            const data = coinOb[v][0]
            let now_price = 1;


            switch(v){
                case 'BTC':
                    now_price = t9732_BIN_BTCUSDT.Output1.fClose
                    break;
                case 'ETH':
                    now_price = t9732_BIN_ETHUSDT.Output1.fClose
                    break;
                default:
                    break
            }

            key += 1;
            return <tr className="row"  key={key}>
                        <RowMiddle style={{width: '4%'}}>No</RowMiddle>
                        <RowMiddle style={{width: '10%'}}>Currency</RowMiddle>
                        <RowMiddle style={{width: '10%'}}>Code</RowMiddle>
                        <RowMiddle style={{width: '10%'}}>Rates</RowMiddle>
                        <RowMiddle style={{width: '10%'}}>Cypto Amt.</RowMiddle>
                        <RowMiddle style={{width: '10%'}}>POINT</RowMiddle>
                        <RowMiddle style={{width: '10%'}}>BTC Current Bal.</RowMiddle>
                        <RowMiddle style={{width: '10%'}}>POINT Current Bal.</RowMiddle>
                    </tr>
        })
    }


    const options = [
        { value: 'address', label: 'address' },
        // { value: 'strawberry', label: 'Strawberry' },
        // { value: 'vanilla', label: 'Vanilla' },
    ];

    const coin_options = [
        { value: 'BTC', label: 'BTC' },
        { value: 'ETH', label: 'ETH' },
        { value: 'USDT', label: 'USDT' },
        // { value: 'strawberry', label: 'Strawberry' },
        // { value: 'vanilla', label: 'Vanilla' },
    ];


    return (
        <>  
            <div className="flex_div" >
                <span className="sub_title">Spot wallet - Future wallet</span>
            </div>
            <br/>
            <Content id="transfer">
                <div style={{borderBottom: '1px solid #E1E1E1', paddingBottom: '20px'}}>
                    <FormItem>
                        <div  style={{display:'flex'}}>
                            {isMobile ?  <>
                            <TransferDiv>
                                <div className="input_div">
                                    <BoldTitle>From</BoldTitle><br/>
                                    <Dropdown  options={options}  placeholder="Select an option"  />
                                    <br/>
                                    <SmallDiv>
                                        <span className="right">000,0000,000 unit</span>
                                    </SmallDiv>
                                </div>
                                <div  className="input_div">
                                    <BoldTitle>to</BoldTitle><br/>
                                    <Dropdown options={options}  placeholder="Select an option"  />
                                    <br/>
                                    <SmallDiv>
                                        <span className="right">000,0000,000 unit</span>
                                    </SmallDiv>
                                </div>
                            </TransferDiv>
                    
                            <ExchangeButton>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.5625 21.5625H23.4375C23.955 21.5625 24.375 21.1425 24.375 20.625C24.375 20.1075 23.955 19.6875 23.4375 19.6875H6.5625C6.045 19.6875 5.625 20.1075 5.625 20.625C5.625 21.1425 6.045 21.5625 6.5625 21.5625Z" fill="white" stroke="white" strokeWidth="0.6"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M23.4375 9.375L6.5625 9.375C6.045 9.375 5.625 9.795 5.625 10.3125C5.625 10.83 6.045 11.25 6.5625 11.25L23.4375 11.25C23.955 11.25 24.375 10.83 24.375 10.3125C24.375 9.795 23.955 9.375 23.4375 9.375Z" fill="white" stroke="white" strokeWidth="0.6"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M22.6579 20.1046L20.7829 22.9171C20.496 23.3483 20.6122 23.9305 21.0426 24.2174C21.4738 24.5043 22.056 24.388 22.3429 23.9577L24.2179 21.1452C24.5047 20.7139 24.3885 20.1317 23.9582 19.8449C23.5269 19.558 22.9447 19.6742 22.6579 20.1046Z" fill="white" stroke="white" strokeWidth="0.6"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.78212 10.8327L7.65713 13.6452C7.944 14.0755 8.52619 14.1918 8.95744 13.9049C9.38776 13.618 9.50401 13.0358 9.21713 12.6046L7.34213 9.79206C7.05525 9.36175 6.47306 9.2455 6.04181 9.53238C5.6115 9.81925 5.49525 10.4014 5.78212 10.8327Z" fill="white" stroke="white" strokeWidth="0.6"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M24.2179 20.1046L22.3429 17.2921C22.056 16.8618 21.4738 16.7455 21.0426 17.0324C20.6122 17.3193 20.496 17.9014 20.7829 18.3327L22.6579 21.1452C22.9447 21.5755 23.5269 21.6918 23.9582 21.4049C24.3885 21.118 24.5047 20.5358 24.2179 20.1046Z" fill="white" stroke="white" strokeWidth="0.6"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.34213 10.8327L9.21713 8.02019C9.50401 7.58894 9.38776 7.00675 8.95744 6.71988C8.52619 6.433 7.944 6.54925 7.65713 6.97956L5.78212 9.79206C5.49525 10.2233 5.6115 10.8055 6.04181 11.0924C6.47306 11.3793 7.05525 11.263 7.34213 10.8327Z" fill="white" stroke="white" strokeWidth="0.6"/>
                                </svg>
                            </ExchangeButton>
                            </> :  <>
                            <TransferDiv>
                                <div className="input_div">
                                    <BoldTitle>From</BoldTitle><br/>
                                    <Dropdown  options={options}  placeholder="Select an option"  />
                                    <br/>
                                    <SmallDiv>
                                        <span className="right">000,0000,000 unit</span>
                                    </SmallDiv>
                                </div>
                            </TransferDiv>
                                <ExchangeButton>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.5625 21.5625H23.4375C23.955 21.5625 24.375 21.1425 24.375 20.625C24.375 20.1075 23.955 19.6875 23.4375 19.6875H6.5625C6.045 19.6875 5.625 20.1075 5.625 20.625C5.625 21.1425 6.045 21.5625 6.5625 21.5625Z" fill="white" stroke="white" strokeWidth="0.6"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M23.4375 9.375L6.5625 9.375C6.045 9.375 5.625 9.795 5.625 10.3125C5.625 10.83 6.045 11.25 6.5625 11.25L23.4375 11.25C23.955 11.25 24.375 10.83 24.375 10.3125C24.375 9.795 23.955 9.375 23.4375 9.375Z" fill="white" stroke="white" strokeWidth="0.6"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M22.6579 20.1046L20.7829 22.9171C20.496 23.3483 20.6122 23.9305 21.0426 24.2174C21.4738 24.5043 22.056 24.388 22.3429 23.9577L24.2179 21.1452C24.5047 20.7139 24.3885 20.1317 23.9582 19.8449C23.5269 19.558 22.9447 19.6742 22.6579 20.1046Z" fill="white" stroke="white" strokeWidth="0.6"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.78212 10.8327L7.65713 13.6452C7.944 14.0755 8.52619 14.1918 8.95744 13.9049C9.38776 13.618 9.50401 13.0358 9.21713 12.6046L7.34213 9.79206C7.05525 9.36175 6.47306 9.2455 6.04181 9.53238C5.6115 9.81925 5.49525 10.4014 5.78212 10.8327Z" fill="white" stroke="white" strokeWidth="0.6"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M24.2179 20.1046L22.3429 17.2921C22.056 16.8618 21.4738 16.7455 21.0426 17.0324C20.6122 17.3193 20.496 17.9014 20.7829 18.3327L22.6579 21.1452C22.9447 21.5755 23.5269 21.6918 23.9582 21.4049C24.3885 21.118 24.5047 20.5358 24.2179 20.1046Z" fill="white" stroke="white" strokeWidth="0.6"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.34213 10.8327L9.21713 8.02019C9.50401 7.58894 9.38776 7.00675 8.95744 6.71988C8.52619 6.433 7.944 6.54925 7.65713 6.97956L5.78212 9.79206C5.49525 10.2233 5.6115 10.8055 6.04181 11.0924C6.47306 11.3793 7.05525 11.263 7.34213 10.8327Z" fill="white" stroke="white" strokeWidth="0.6"/>
                                </svg>
                            </ExchangeButton>
                            <TransferDiv>
                                <div  className="input_div">
                                    <BoldTitle>to</BoldTitle><br/>
                                    <Dropdown options={options}  placeholder="Select an option"  />
                                    <br/>
                                    <SmallDiv>
                                        <span className="right">000,0000,000 unit</span>
                                    </SmallDiv>
                                </div>
                            </TransferDiv>
                            </>}
                            </div>
                    </FormItem>
                </div>
                <div style={{ paddingBottom: '20px'}}>
                    <FormItem style={{marginTop: '20px', maxWidth: '440px'}}>
                        <div style={{maxWidth: '360px'}}>
                            <BoldTitle>Coin</BoldTitle><br/>
                            <Dropdown options={coin_options}  placeholder="Select an option"  />
                        </div>
                        <br/>
                            <BoldTitle>Amount</BoldTitle><br/>
                            <AmountInputDiv>
                                <div className="input">
                                    <InputBoxDiv>
                                        <InputBox />
                                        <SmallDiv >
                                            <span className="right">000,0000,000 unit</span>
                                        </SmallDiv>
                                    </InputBoxDiv>
                                </div>
                                <MaxButton className="button">Max</MaxButton>
                            </AmountInputDiv>
      
                        <br/>
                        <RequestButton onClick={() => alert('개발중입니다')}>
                            Confirm
                        </RequestButton>
                    </FormItem>
                </div>
                
            </Content>
        </>
    );
};

export default Transfer;

const Content = styled.div`
    max-width:1200px;
    margin: 0px auto ;
`
const FormItem = styled.div`
`

const SmallDiv = styled.div`
    width:100%;
    display:inline-block;
    color: #383838;
    font-family: Noto Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 11px;
    color: #A4A4A4;

    & .right{
        float: right;
    }

    & .left{
        float: left;
    }
`

const TransferDiv = styled.div`
    @media (max-width: 700px){
    max-width: 280px;
        & .input_div{
            width:100%;
            display:inline-block;
        }
    }

    @media (min-width: 700px){
        & .input_div{
            width:220px;
            display:inline-block;
        }
    }
`
const ExchangeButton = styled.button`
    background: linear-gradient(280.43deg, #F29100 0%, #FFAB2E 99.12%);
    border: 0;
    border-radius: 4px;
    max-width: 40px;

    @media (max-width: 600px){
        margin: auto auto auto 10px;
        height: 140px;
        width: 100%;
    }

    @media (min-width: 600px){
        margin: auto 20px;
        height: 40px;
        width: 40px;
    }

    &:active{
        background: linear-gradient(280.43deg,#e78a00 0%,#FFAB2E 99.12%)
    }
}
`

const BoldTitle = styled.span`
    display: inline-block;
    margin-bottom: 4px;
    font-family: Noto Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 20px;
`

const AmountInputDiv = styled.div`
    display: flex;
    @media (max-width: 700px){
        & .input{
            width: calc(100% - 94px);
        }
    }

    @media (min-width: 700px){
        & .input{
            display:inline-block;
            width: 420px;
        }
    }
`

const RequestButton = styled.button`
    margin-top: 16px;
    max-width:356px;
    width: 100%;
    height: 40px;
    background: #173959;
    border-radius: 4px;
    color: #FFFFFF;
`


const RowMiddle = styled.td `
    font-weight: normal;
    font-size: 14px;
    color: #7D7D7D;
`

const InputBoxDiv = styled.div`
    display: inline-block;
    width: 100%;
    margin-bottom:8px;
`

const InputBox = styled.input`
    border: 1px solid #DDDDDD;
    box-sizing: border-box;
    border-radius: 4px;
    width: 100%;
    height: 40px;
`
const MaxButton = styled.button`
    margin-left: 10px;
    border: 1px solid #F49405;
    box-sizing: border-box;
    border-radius: 4px;
    width: 84px;
    height: 40px;
    color: #F49405;

    &: active{
        color: #ffffff;
        background-color:#F49405;
    }
`