import  {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux';

import useUsersData from '@/hooks/useUserData';
import {logout} from '@/states/reducers/userReducer';
import PageNameList from '@/constants/PageNameLIst';


let interval: NodeJS.Timeout = setInterval(() => {
    console.log(` `);
}, 100000000);

interface IProps {
    theme?: 'dark' | 'light';
}

const CountDownTimer = ({theme}: IProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [countdown, setCountdown] = useState<number>(1800);
    const {exp, email} = useUsersData();
    const {szAccNo, isLoggedIn} = useUsersData();

    useEffect(() => {
        if (!window || !exp || email === 'block02@mexdaq.com') return;
        setCountdown(Math.floor(countdown));
        window.clearInterval(interval);
        interval = setInterval(() => {
            setCountdown((prev) => {
                return prev - 1 > 0 ? prev - 1 : 0;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [exp]);

    useEffect(() => {
        if (0 >= countdown && szAccNo) {
            dispatch(logout());
            navigate(PageNameList.MOBILE_SIGNIN);
        }
    }, [countdown]);


    const timeFormat = (time: number) => {
        const m = Math.floor(time / 60).toString()
        let s = (time % 60).toString()
        if (s.length === 1) s = `0${s}`
        return `${m}:${s}`
    }

    const resetTimer = () => {
        setCountdown(() => {
            return 1800;
        });
    }

    return (
      <div className="count-down-timer"  onClick={resetTimer}>
            <span className="login-timer"
                  style={{color: theme === 'light' ? '#404040' : '#FFFFFF'}}>After {timeFormat(countdown)}</span>
          <svg x="0px" y="0px" viewBox="0 0 1000 1000" className="refresh-icon">
              <g>
                  <path
                    d="M990,763.2L923.4,500L728.8,689.3l83.5,23.6C742.4,815.8,626.8,878.1,500,878.1c-146.2,0-276.8-81.8-340.5-213.6L77.8,704C155.6,864.9,321.3,968.8,500,968.8c167.3,0,318.2-87.9,402.5-230.4L990,763.2z"/>
                  <path
                    d="M187.8,287.2C257.5,184.3,373.1,121.9,500,121.9c142.7,0,271.8,78.9,336.7,206l80.9-41.3C837,129.1,677,31.2,500,31.2c-167.3,0-318.1,87.9-402.5,230.5L10,236.9L76.6,500l194.6-189.3L187.8,287.2z"/>
              </g>
          </svg>
      </div>
    );
};


export default CountDownTimer;
