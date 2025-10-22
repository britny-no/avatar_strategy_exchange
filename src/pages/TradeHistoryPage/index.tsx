import Detail from './Detail';
import List from './List';
import Close from './Close';
import Layout from '@/components/layout';
import { useLocation } from 'react-router-dom';
import { useTypedSelector } from '@/states/useTypedSelector';

interface LocationState {
  sub_path: string;
  szAccNo: string
  locationCoin: undefined | string;
  depositWithdraw: undefined | string;
}

const TradeHistoryPage = () => {
  const isLoggedIn = useTypedSelector(state => state.userReducer.isLoggedIn);
  const location = useLocation();
  
  if(!location.state){
    window.location.href="/"
    return null
  } else if(!location.state.szAccNo || !isLoggedIn){
    alert('로그인 해주세요')
    window.location.href="/mobile/signin"
    return null
  }

  const {sub_path} =  location.state;

  const renderModule = () => {
    switch(sub_path){
      case '/list':
        return <List/>;
      case '/detail':
        return <Detail/>;
      case '/close':
        return <Close/>;
      default:
        return <Detail/>
    }
  }


  return (
    <Layout>
      {/* <Hero/> */}
      {
        renderModule()
      }
    </Layout>
  )
};

export default TradeHistoryPage;
