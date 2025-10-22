import moment from 'moment';
import 'moment-timezone';

import {
    initChart
} from "../reducers/chartReducer"
import {
    updateLive,
    updateTr,
    appendTr,
    appendLive
} from "../reducers/stateReducer"
import { connectionOn } from '../reducers/agentReducer';
import { updateSymbol, appendData } from '../reducers/symbolReducer';
import { MESSAGE_PUSH } from '../reducers/messageReducer';
import { initFavorites, setCurrentUser } from '../reducers/userReducer';


// SocketService class안에서는 memory leak 방지를 위해 가능한 const 지양해야합니다
// 특히 onmessage안에서는 지양해야합니다
class SocketService {
    ws: WebSocket | undefined;
    connected = false;
    dispatch: any;

    constructor() {
        const webSocketUrl = import.meta.env.VITE_TYPE === 'DEPLOY' ? import.meta.env.VITE_WS_HOST : import.meta.env.VITE_WS_HOST_DEV
        if (!webSocketUrl) return;
        // console.log(webSocketUrl)
        // console.log('connecting to ', webSocketUrl);
        this.ws = new WebSocket(webSocketUrl);
        this.dispatch = undefined;
    }

    setDispatch = (dispatch) => {
        this.dispatch = dispatch;
    };

    init = () => {
        if (!this.ws) {
            console.log('no ws connection')
            return 
        }

        this.ws.onopen = () => {
            this.connected = true;
            this.dispatch(connectionOn());

            //91_pre_time 갱신
            sessionStorage.setItem('91_pre_time', '');
        };
        this.ws.onclose = (error) => {
            // dispatch(UPDATE_WS(''));
        };

        this.ws.onmessage = ({ data }) => {
            this.handleOnMessage(JSON.parse(data));
        };

        this.ws.onerror = (error) => {
            // console.error('Socket error in SocketService: ', error);
            // dispatch(UPDATE_WS(''));
        };
    };

    handleOnMessage = (data) => {
        switch (data.Header.function.replace(/ /g, '')) {
            case 'F':
                // if (['96', '95'].includes(data.Header.trcode)) console.log('on live message : ', data);
                return this.handleLiveTransaction({ data });
            case 'D':
                // console.log('on tr message : ', data);
                return this.handleTransaction({ data });
            default:
                // console.log(data)
            // console.error(`data on error : `, data);
            // return alert('function code is neither F or D');
        }
    };

    handleMessage = (message) => {
        // Message 필드가 있을때 message reducer에 푸쉬
        if (message) {
            const messageText = message.data;
            this.dispatch(MESSAGE_PUSH(messageText));
        }
    };

    handleLiveTransaction = ({ data }) => {
        const trcode = data.Header.trcode;
        const symbol = data.Output1 && data.Output1.szSymbol ? String(data.Output1.szSymbol).trim() : '';
        const pre_date = sessionStorage.getItem('91_pre_time');

        switch (trcode) {
            case '91':
                // 심볼공백 제거
                if (!pre_date) {
                    sessionStorage.setItem('91_pre_time', moment().add(600, 'ms').format('YYYY-MM-DD HH:mm:ss'));
                } else if (moment(pre_date) < moment()) {
                    this.dispatch(updateLive({ key: `${trcode}_interval_${symbol}`, data }));
                    this.dispatch(updateLive({ key: `${trcode}_${symbol}`, data }));
                    sessionStorage.setItem('91_pre_time', moment().add(600, 'ms').format('YYYY-MM-DD HH:mm:ss'));
                }
                break
            case '92':
                // 심볼공백 제거
                return this.dispatch(updateLive({ key: `${trcode}_${symbol}`, data }));
            case '95':
                return this.dispatch(appendLive({ key: trcode, data }));
            case '96':
                return this.dispatch(appendLive({ key: trcode, data }));
            case '98':
                return this.dispatch(appendLive({ key: trcode, data }));
            default:
                return alert('default in handleLiveTransaction');
        }
    };

    handleTransaction = ({ data }) => {
        this.handleMessage(data.Message);
        const trcode = data.Header.trcode;
        const { trid } = data.Header
        const { flag } = data.Message;
        // trid로 symbol 구분
        const szCurNo = ['0', 'BTC', 'ETH', 'USDT', 'XRP']

        switch (trcode) {
            /*============================
            | 차트조회 tr => chartReducer |
            =============================*/
            case 't9731':
                data.Header.trid === '1' && this.dispatch(initChart(data));

                if (data.Output1) {
                    const filter_arr = [...data.Output1].reverse().slice(0, 100);
                    this.dispatch(updateTr(this.formatTrData({ trcode: `${trcode}_convert`, data: filter_arr })));

                    if (data.Header.trid) {
                        const coin = [0, 'BTC', 'ETH', 'USDT', 'XRP'];
                        // 성공시 코인 주소 update
                        this.dispatch(
                            updateTr(
                                this.formatTrData({ trcode: `${trcode}_${coin[data.Header.trid]}`, data: filter_arr }),
                            ),
                        );
                    }
                }

                return this.dispatch(updateTr(this.formatTrData({ trcode, data })));

            /*==============================================
            | 상장된종목리스트 및 디테일 tr => symbolReducer |
            ===============================================*/
            case 't5511':
                if (data.Output2) {
                    // 심볼공백 제거
                    data.Output2.map((v) => {
                        v[0] = String(v[0]).trim();
                        v[1] = String(v[1]).trim();
                        v[2] = String(v[2]).trim();

                        return v;
                    });
                    this.dispatch(updateSymbol(data));
                    // return trcode;
                }
                return trcode
                // return this.dispatch(updateTr(this.formatTrData({ trcode, data })));

            /*=====================================
            | 유저의 favorite list => userReducer  |
            =======================================*/
            case 't3181':
                this.dispatch(initFavorites(data));
                return trcode;
            //t9732 => append data to symbolReducer and then update stateReducer too

            /*==================================================
            | 종목 현재가 t9732 => symbolReducer, stateReducer  |
            | 동시에 append                                     |
            ===================================================*/
            case 't9732':
                // 9732현재가조회 가끔 데이터조회오류가 나올수있어서 Output1이 있을경우에만 append시켜줌
                // if (data.Output1) {
                //     this.dispatch(appendData({ Output1: data.Output1 }));
                //     const szCurNo = data.Output1.szCurNo.replace(/ /g, '');
                //     this.dispatch(appendTr({ key: `${trcode}_${szCurNo}`, data }));
                // }
                switch (flag) {
                    case 'E':
                        alert(data.Message.data)
                        this.dispatch(appendTr({ key: `${trcode}_BIN_${szCurNo[trid]}USDT`, data: [] }));
                        break;
                    case '0':
                        this.dispatch(appendData(data.Output1));
                        this.dispatch(appendTr({ key: `${trcode}_BIN_${szCurNo[trid]}USDT`, data }));

                        break;
                    default:
                        alert('관리자에게 문의바랍니다');
                }
                break;

            //유저의 이메일 accNo, szPasswd 가져오는 tr
            case 't0306':
                if (data && data.Message && data.Message.flag === '0') {
                    const email = data.Output2[0][1].replace(/ /g, '');
                    const szAccNo = data.Output2[0][2].replace(/ /g, '');
                    // const szPasswd = data.Output2[0][3].replace(/ /g, '');
                    const szPasswd =data.Output2[0][3].trim()

                    data.Output2[0][3] = szPasswd
                    this.dispatch(
                        setCurrentUser({
                            szAccNo,
                            szPasswd,
                            email,
                            jwt: '',
                            exp: 2627884047,
                        }),
                    );

                }
                return this.dispatch(updateTr(this.formatTrData({ trcode, data })));
                break;
            // 입/출금 내역 정리
            // 입출금 내역 t3615 -> t3626으로 대체
            // case 't3615':
            //     const deposit: Array<string> = [];
            //     const withdraw: Array<string> = [];

            //     if (data.Output2) {
            //         data.Output2.forEach((v) => {
            //             v[1] = String(v[1]).trim();
            //             v[6] = String(v[6])
            //                 .trim()
            //                 .replace(/[\/\:]/g, '.')
            //                 .replace(/-/g, ' ');
            //             if (String(v[2]).trim() === '079') {
            //                 deposit.push(v);
            //             } else {
            //                 withdraw.push(v);
            //             }
            //         });
            //     }

            //     this.dispatch(
            //         updateTr(
            //             this.formatTrData({
            //                 trcode: `${trcode}_history`,
            //                 data: {
            //                     deposit,
            //                     withdraw,
            //                 },
            //             }),
            //         ),
            //     );

            //     return this.dispatch(updateTr(this.formatTrData({ trcode, data })));
            case 't2713':
                if (data.Output1) {
                    this.dispatch(appendLive({ key: `${trcode}_used_number`, data: data.Output1.szPrc_Seq_No }));
                    this.dispatch(appendLive({ key: trcode, data: data.Output1 }));
                }
                break;
            case 't3626':
                switch (flag) {
                    case 'E':
                        alert(data.Message.data)
                        this.dispatch(
                            updateTr(this.formatTrData({ trcode: `${trcode}_${szCurNo[trid]}`, data: [] })),
                        );
                        break;
                    case '0':
                        if(data.Output2){
                            const new_data =  data.Output2.map((v) => {
                                v[1] = String(v[1]).trim();
                                v[2] = String(v[2]).trim();
                                v[3] = String(v[3]).trim();
                                v[6] = String(v[6])
                                    .trim()
                                    .replace(/[\/\:]/g, '.')
                                    .replace(/-/g, ' ');
                                return v;
                            });
                            this.dispatch(
                                updateTr(this.formatTrData({ trcode: `${trcode}_${szCurNo[trid]}`, data: new_data })),
                            );
                        }else{
                            this.dispatch(
                                updateTr(this.formatTrData({ trcode: `${trcode}_${szCurNo[trid]}`, data: [] })),
                            );
                        }
                        break;
                    default:
                        alert('관리자에게 문의바랍니다');
                }
                break;

            case 't3616':
            case 't3625':
                switch (flag) {
                    case 'E':
                        alert(data.Message.data)
                        this.dispatch(
                            updateTr(this.formatTrData({ trcode: `${trcode}_${szCurNo[trid]}`, data: [] })),
                        );
                        break;
                    case '0':
                        if(data.Output2){
                            const new_data = data.Output2.map((v) => {
                                return v.map((v) => String(v).trim());
                            });
                            this.dispatch(
                                updateTr(this.formatTrData({ trcode: `${trcode}_${szCurNo[trid]}`, data: new_data })),
                            );
                        }else{
                            this.dispatch(
                                updateTr(this.formatTrData({ trcode: `${trcode}_${szCurNo[trid]}`, data: [] })),
                            );
                        }
                        break;
                    default:
                        alert('관리자에게 문의바랍니다');
                }
                break;
            case 't365C':
            case 't221C':
            case 't211C':
            case 't2510':
                return this.dispatch(updateTr(this.formatTrData({ trcode: `${trcode}_${data.Header.trid}`, data })));

            //코인 주소 등록
            case 't0230':
                if (data && data.Message.code === '00000') {
                    const coin = [0, 'BTC', 'ETH', 'USDT'];
                    // 성공시 코인 주소 update
                    this.dispatch(
                        updateTr(
                            this.formatTrData({
                                trcode: `$t0231_${coin[data.Header.trid]}`,
                                data: data.Output1.szWallet_Addr,
                            }),
                        ),
                    );
                } else {
                    return this.dispatch(updateTr(this.formatTrData({ trcode, data })));
                }
                break;
            //코인별 주소 가져오기
            case 't0231':
                if (data && data.Output1) {
                    const coin = [0, 'BTC', 'ETH', 'USDT', 'XRP'];
                    this.dispatch(
                        updateTr(
                            this.formatTrData({
                                trcode: `${trcode}_${coin[data.Header.trid]}`,
                                data: {
                                    address: data.Output1.szWallet_Addr,
                                    destination_tag: data.Output1.szDest_Tag,
                                },
                            }),
                        ),
                    );
                }
                return this.dispatch(updateTr(this.formatTrData({ trcode, data })));

            case 'login':
                if (data?.Message?.data && data.Message.flag === 'E') {
                    alert(data.Message.data);
                }
                if (data && data.Message && data.Message.flag === '0') {
                    // set userLevel
                    localStorage.setItem('mmex_userlevel', data.Output1.userlevel)
                    const szCustNo = data.Output1.userid.replace(/ /g, '');
                    const input = {
                        Header: { function: 'D', termtype: 'HTS', trcode: 't0306' },
                        Input1: {
                            select_flag: '0',
                            comp_code: '000',
                            hts_id: szCustNo,
                            name: '',
                        },
                    };
                    // console.log('t0306 input : ', input);
                    socketService.sendToAgent(input);
                }

                break;
            default:
                return this.dispatch(updateTr(this.formatTrData({ trcode, data })));
        }
    };

    formatTrData = ({ trcode, data }) => {
        return {
            [trcode]: data,
        };
    };

    // Tr for live channel requires key
    sendToAgent = (json, key = ''): string | undefined => {
        // console.log(`Send to agent called json is : `, json);
        if (!this.ws) {
            alert('No socket connection');
            return undefined;
        }
        // if (json.Header.trcode === 't9731') {
        //     // console.log('send 9731 : ', json);
        // }
        // console.log(`json to send : `, json);
        this.ws.send(JSON.stringify(json));

        switch (json.Header.trcode) {
            case 't9732':
                // console.log(`9732 to send : `, json);
                return `${json.Header.trcode}_${json.Input1.szCurNo}`;

            /*===========================================================
            | 현물종목은 symbolList가 아닌 CoinInfo에서                   |
            | transaction 을 request 해주기 때문에 key를 리턴해줘야한다    |
            ===========================================================*/
            case '91':

                return `${json.Header.trcode}_${json.Input1.Key1}`;
            case '92':
                return `${json.Header.trcode}_${json.Input1.Key1}`;
            case '95':
                return json.Header.trcode;
            case '96':
                return json.Header.trcode;
            case '98':
                return json.Header.trcode;
            default:
                return `${json.Header.trcode}`;
        }
    };
}
const socketService = new SocketService();
export default socketService;
