import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from './states/useTypedSelector';
import socketService from './states/socketAgent/SocketService';
import useInitScreenSize from './hooks/useInitScreenSize';
import InitComponent from './components/common/InitComponent';

import { createGlobalStyle } from 'styled-components';
import SignIn from './pages/MobileSinInUp/SignIn';
import SignUp from './pages/MobileSinInUp/SignUp';
import TradingPage from './pages/TradingPage';
import WalletPage from './pages/WalletPage';
import TradeHistoryPage from './pages/TradeHistoryPage';
import MetaverseTrader from './pages/MetaverseTrader';
import GuidePage from './pages/GuidePage';
import UserAuthenticate from './components/common/UserAuthenticate';
import MobileLoginHelper from './components/common/LoginHelper_m';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

 p {
  margin: 0;
  padding: 0;
 }

 body {
  color: #222222;
 }

 button {
    color: inherit; /* 부모 요소의 색상을 상속 */
    background-color: #fff;
    cursor: pointer;
  }

  a {
    text-decoration-line: none;
  }
`;

function App() {

  const dispatch = useDispatch();
  const state = useTypedSelector((state) => state.agentReducer);
  const {} = useInitScreenSize();
  const { ws } = state;

  useEffect(() => {
    socketService.setDispatch(dispatch);
    socketService.init();
  }, [ws, dispatch]);


  if (!state.connected) return <div>Socket connecting....</div>;


  return (
    <Router>
      <GlobalStyle />
      <InitComponent />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mobile/signin" element={<SignIn />} />
        <Route path="/mobile/signup" element={<SignUp />} />
        <Route path="/trade" element={<TradingPage />} />
        <Route path="/wallet" element={<>
          <WalletPage/><MobileLoginHelper/>
        </>} />
        <Route path="/execution" element={<>
          <TradeHistoryPage/><MobileLoginHelper/>
        </>} />
        <Route path={`/metaverse/:subpage`} element={<><MetaverseTrader/><MobileLoginHelper/></>}/>
        <Route path={`/guide/:subpage`} element={<><GuidePage/><MobileLoginHelper/></>}/>
      </Routes>
    </Router>
  );
}

interface PropsType {
    path: string;
    exact: boolean;
    component: React.FC;
}



export default App;